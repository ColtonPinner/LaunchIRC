const STORAGE_PREFIX = 'launch_irc';
const SESSION_KEY = `${STORAGE_PREFIX}_session`;
const USERS_KEY = `${STORAGE_PREFIX}_users`;

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const createId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const hashPassword = async (password) => {
  const bytes = new TextEncoder().encode(password);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const publicUser = ({ passwordHash: _passwordHash, ...user }) => user;

const createEntity = (name) => {
  const storageKey = `${STORAGE_PREFIX}_${name}`;

  return {
    async create(data) {
      const records = readStorage(storageKey, []);
      const now = new Date().toISOString();
      const record = { ...data, id: createId(), created_date: now, updated_date: now };
      writeStorage(storageKey, [...records, record]);
      return record;
    },

    async filter(criteria) {
      const records = readStorage(storageKey, []);
      return records.filter((record) =>
        Object.entries(criteria).every(([key, value]) => record[key] === value),
      );
    },

    async list(orderBy) {
      const records = [...readStorage(storageKey, [])];
      if (!orderBy) return records;

      const descending = orderBy.startsWith('-');
      const field = descending ? orderBy.slice(1) : orderBy;
      return records.sort((left, right) => {
        const comparison = String(left[field] ?? '').localeCompare(String(right[field] ?? ''));
        return descending ? -comparison : comparison;
      });
    },

    async update(id, data) {
      const records = readStorage(storageKey, []);
      const index = records.findIndex((record) => record.id === id);
      if (index === -1) throw new Error(`${name} record not found`);

      records[index] = { ...records[index], ...data, updated_date: new Date().toISOString() };
      writeStorage(storageKey, records);
      return records[index];
    },
  };
};

export const launchpadClient = {
  auth: {
    async register({ email, password }) {
      const normalizedEmail = email.trim().toLowerCase();
      const users = readStorage(USERS_KEY, []);
      if (users.some((user) => user.email === normalizedEmail)) {
        throw new Error('An account with this email already exists');
      }

      const user = {
        id: createId(),
        email: normalizedEmail,
        role: 'user',
        passwordHash: await hashPassword(password),
      };
      writeStorage(USERS_KEY, [...users, user]);
      writeStorage(SESSION_KEY, { userId: user.id });
      return publicUser(user);
    },

    async loginViaEmailPassword(email, password) {
      const users = readStorage(USERS_KEY, []);
      const passwordHash = await hashPassword(password);
      const user = users.find(
        (candidate) => candidate.email === email.trim().toLowerCase() && candidate.passwordHash === passwordHash,
      );
      if (!user) throw new Error('Invalid email or password');

      writeStorage(SESSION_KEY, { userId: user.id });
      return publicUser(user);
    },

    async me() {
      const session = readStorage(SESSION_KEY, null);
      const user = readStorage(USERS_KEY, []).find((candidate) => candidate.id === session?.userId);
      if (!user) throw new Error('Not authenticated');
      return publicUser(user);
    },

    logout() {
      window.localStorage.removeItem(SESSION_KEY);
    },
  },

  entities: {
    BusinessSurvey: createEntity('business_surveys'),
    ConciergeRequest: createEntity('concierge_requests'),
    DirectoryListing: createEntity('directory_listings'),
    Event: createEntity('events'),
  },
};
