import { supabase } from '@/utils/supabase';

const PENDING_SURVEY_KEY = 'b4irc_pending_survey';

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
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }
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

const flattenRecord = ({ data, ...record }) => ({ ...data, ...record });

const flattenPortalRecord = ({ data, ...record }) => ({ ...data, ...record });

export const resolveAccountType = (user, profile = null) => {
  const role = user?.app_metadata?.role;
  const metadataType = user?.user_metadata?.account_type;
  const profileType = profile?.account_type;

  if (['staff', 'admin'].includes(role)) return 'consultant';
  if (profileType && ['customer', 'provider', 'consultant'].includes(profileType)) return profileType;
  if (metadataType && ['customer', 'provider', 'consultant'].includes(metadataType)) return metadataType;
  return 'customer';
};

export const canAccessAccountType = (user, accountType) =>
  user?.account_type === accountType || user?.account_type === 'consultant';

const createEntity = (table) => {
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
    async register({ email, password, fullName, accountType = 'customer', businessName = '', ein = '' }) {
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
            ein,
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
      const profile = unwrap(
        await getSupabase()
          .from('account_profiles')
          .select('account_type, full_name, business_name, ein')
          .eq('id', result.user.id)
          .maybeSingle(),
      );
      const accountType = resolveAccountType(result.user, profile);
      return {
        ...result.user,
        role: result.user.app_metadata?.role || 'user',
        account_type: accountType,
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
      return unwrap(await getSupabase().functions.invoke('create-consultant', {
        body: { email, fullName },
      }));
    },

    async listConsultants() {
      return unwrap(await getSupabase().rpc('list_consultants')) || [];
    },
  },

  entities: {
    BusinessSurvey: businessSurveys,
    ConciergeRequest: createEntity('concierge_requests'),
    DirectoryListing: {
      ...createEntity('directory_listings'),
      async listMine(ownerId, includeAll = false) {
        let query = getSupabase()
          .from('directory_listings')
          .select('*')
          .order('updated_date', { ascending: false });
        if (!includeAll) query = query.eq('owner_id', ownerId);
        const records = unwrap(await query);
        return records.map(flattenRecord);
      },
      async listPending() {
        const records = unwrap(await getSupabase().rpc('list_pending_directory_listings'));
        if (!Array.isArray(records)) {
          throw new Error(records?.error || 'Could not load pending directory listings');
        }
        return records.map(flattenRecord);
      },
      async listAccepted() {
        const records = unwrap(
          await getSupabase().from('directory_listings').select('*').order('created_date', { ascending: false }),
        );
        return records.map(flattenRecord).filter((listing) => listing.is_approved || listing.status === 'accepted');
      },
      async approve(id) {
        const record = unwrap(await getSupabase().rpc('accept_directory_listing', { p_id: id }));
        return flattenRecord(record);
      },
      async accept(id) {
        return this.approve(id);
      },
      async reject(id) {
        const record = unwrap(await getSupabase().rpc('reject_directory_listing', { p_id: id }));
        return flattenRecord(record);
      },
      async remove(id) {
        return unwrap(await getSupabase().rpc('remove_directory_listing', { p_id: id }));
      },
    },
    AcceptedBusiness: {
      async list() {
        return unwrap(await getSupabase().rpc('list_accepted_businesses')) || [];
      },
      async filter(category = 'all') {
        const list = await this.list();
        if (category === 'all') return list;
        return list.filter((b) => b.category === category);
      },
      async search(term = '') {
        const list = await this.list();
        if (!term.trim()) return list;
        const query = term.toLowerCase();
        return list.filter(
          (b) =>
            b.company_name?.toLowerCase().includes(query) ||
            b.description?.toLowerCase().includes(query) ||
            b.category?.toLowerCase().includes(query),
        );
      },
    },
    Event: createEntity('events'),
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
    ExpertRequest: {
      async list() {
        const records = unwrap(await getSupabase().rpc('list_expert_requests')) || [];
        return records;
      },
      async updateStatus(id, status) {
        return unwrap(await getSupabase().rpc('update_expert_request_status', { p_id: id, p_status: status }));
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
