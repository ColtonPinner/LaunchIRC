import { supabase } from '@/utils/supabase';

const PENDING_SURVEY_KEY = 'launch_irc_pending_survey';

export const pendingSurvey = {
  get() {
    try {
      const value = window.localStorage.getItem(PENDING_SURVEY_KEY);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },
  save(data) {
    window.localStorage.setItem(PENDING_SURVEY_KEY, JSON.stringify(data));
  },
  clear() {
    window.localStorage.removeItem(PENDING_SURVEY_KEY);
  },
};

const getSupabase = () => {
  return supabase;
};

const unwrap = ({ data, error }) => {
  if (error) throw error;
  return data;
};

const unwrapAuth = ({ data, error }) => {
  if (!error) return data;

  if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
    throw new Error('Confirmation email limit reached. Wait a few minutes and try again, or sign in if your account was already created.');
  }

  throw error;
};

const flattenRecord = (record) => ({
  ...record.data,
  id: record.id,
  created_date: record.created_date,
  updated_date: record.updated_date,
});

const flattenPortalRecord = ({ data, ...record }) => ({ ...data, ...record });

const createEntity = (table, { publicRead = false } = {}) => {

  return {
    async create(data) {
      const id = globalThis.crypto.randomUUID();
      const now = new Date().toISOString();
      unwrap(await getSupabase().from(table).insert({ id, data }));
      return { ...data, id, created_date: now, updated_date: now };
    },

    async filter(criteria) {
      const { id, ...dataCriteria } = criteria;
      let query = getSupabase().from(table).select('*');
      if (id) query = query.eq('id', id);
      if (Object.keys(dataCriteria).length) query = query.contains('data', dataCriteria);
      return unwrap(await query).map(flattenRecord);
    },

    async list(orderBy) {
      const records = unwrap(await getSupabase().from(table).select('*')).map(flattenRecord);
      if (!orderBy) return records;

      const descending = orderBy.startsWith('-');
      const field = descending ? orderBy.slice(1) : orderBy;
      return records.sort((left, right) => {
        const comparison = String(left[field] ?? '').localeCompare(String(right[field] ?? ''));
        return descending ? -comparison : comparison;
      });
    },

    async update(id, data) {
      const current = unwrap(await getSupabase().from(table).select('*').eq('id', id).single());
      const updated = unwrap(
        await getSupabase()
          .from(table)
          .update({ data: { ...current.data, ...data } })
          .eq('id', id)
          .select('*')
          .single(),
      );
      return flattenRecord(updated);
    },
  };
};

const businessSurveys = {
  async create(data) {
    const id = globalThis.crypto.randomUUID();
    const record = unwrap(
      await getSupabase().from('business_surveys').insert({ id, data }).select('*').single(),
    );
    return flattenRecord(record);
  },

  async filter({ id }) {
    if (!id) return [];
    const records = unwrap(await getSupabase().from('business_surveys').select('*').eq('id', id));
    return records.map(flattenRecord);
  },

  async update(id, data) {
    const current = unwrap(await getSupabase().from('business_surveys').select('*').eq('id', id).single());
    const updated = unwrap(
      await getSupabase()
        .from('business_surveys')
        .update({ data: { ...current.data, ...data } })
        .eq('id', id)
        .select('*')
        .single(),
    );
    return flattenRecord(updated);
  },

  async listMine() {
    const records = unwrap(
      await getSupabase().from('business_surveys').select('*').order('updated_date', { ascending: false }),
    );
    return records.map(flattenRecord);
  },
};

export const launchpadClient = {
  auth: {
    async register({ email, password, fullName, accountType = 'customer', businessName = '' }) {
      const { data: current } = await getSupabase().auth.getUser();
      if (current.user?.is_anonymous) {
        const { error } = await getSupabase().auth.signOut();
        if (error) throw error;
      }
      return unwrapAuth(await getSupabase().auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName || '',
            account_type: accountType,
            business_name: businessName,
          },
        },
      }));
    },

    async loginViaEmailPassword(email, password) {
      const result = unwrapAuth(await getSupabase().auth.signInWithPassword({ email: email.trim(), password }));
      return result.user;
    },

    async me() {
      const result = unwrap(await getSupabase().auth.getUser());
      if (!result.user) throw new Error('Not authenticated');
      const { data: profile } = await getSupabase()
        .from('account_profiles')
        .select('account_type, full_name, business_name')
        .eq('id', result.user.id)
        .maybeSingle();
      const fallbackType = ['staff', 'admin'].includes(result.user.app_metadata?.role)
        ? 'consultant'
        : result.user.user_metadata?.account_type === 'provider' ? 'provider' : 'customer';
      return {
        ...result.user,
        role: result.user.app_metadata?.role || 'user',
        account_type: profile?.account_type || fallbackType,
        profile,
      };
    },

    async logout() {
      const { error } = await getSupabase().auth.signOut();
      if (error) throw error;
    },
  },

  admin: {
    async inviteConsultant({ email, fullName }) {
      const { data: sessionData } = await getSupabase().auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-consultant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ email, fullName }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not invite consultant');
      return result;
    },

    async listConsultants() {
      return unwrap(await getSupabase().rpc('list_consultants')) || [];
    },
  },

  entities: {
    BusinessSurvey: businessSurveys,
    ConciergeRequest: createEntity('concierge_requests'),
    DirectoryListing: {
      ...createEntity('directory_listings', { publicRead: true }),
      async listMine(ownerId) {
        const records = unwrap(
          await getSupabase()
            .from('directory_listings')
            .select('*')
            .eq('owner_id', ownerId)
            .order('updated_date', { ascending: false }),
        );
        return records.map(flattenRecord);
      },
      async listPending() {
        const records = unwrap(
          await getSupabase().from('directory_listings').select('*').order('created_date', { ascending: false }),
        );
        return records.map(flattenRecord).filter((listing) => !listing.is_approved);
      },
      async approve(id) {
        return this.update(id, { is_approved: true });
      },
    },
    Event: createEntity('events', { publicRead: true }),
    ProviderLead: {
      async create(listingId, data, surveyId = null) {
        const id = globalThis.crypto.randomUUID();
        const record = unwrap(await getSupabase().rpc('create_provider_lead', {
          p_id: id,
          p_listing_id: listingId,
          p_data: data,
          p_survey_id: surveyId,
        }));
        return flattenPortalRecord(record);
      },
      async listForProvider() {
        const records = unwrap(await getSupabase().rpc('list_my_provider_leads')) || [];
        return records.map(flattenPortalRecord);
      },
      async updateStatus(id, status) {
        const record = unwrap(await getSupabase().rpc('update_provider_lead_status', { p_id: id, p_status: status }));
        return flattenPortalRecord(record);
      },
    },
  },
  portal: {
    async listMyConciergeRequests() {
      const records = unwrap(await getSupabase().rpc('list_my_concierge_requests')) || [];
      return records.map(flattenRecord);
    },
    async listMyProviderRequests() {
      const records = unwrap(await getSupabase().rpc('list_my_provider_requests')) || [];
      return records.map(flattenPortalRecord);
    },
  },
};
