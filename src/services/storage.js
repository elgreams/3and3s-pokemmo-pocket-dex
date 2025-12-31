import { Preferences } from '@capacitor/preferences';

const LEGACY_STORAGE = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage || null;
  } catch (err) {
    return null;
  }
};

async function migrateLegacyKey(key) {
  const legacy = LEGACY_STORAGE();
  if (!legacy) return null;
  const legacyValue = legacy.getItem(key);
  if (legacyValue == null) return null;
  await Preferences.set({ key, value: legacyValue });
  legacy.removeItem(key);
  return legacyValue;
}

export async function getItem(key) {
  const { value } = await Preferences.get({ key });
  if (value != null) return value;
  return migrateLegacyKey(key);
}

export async function setItem(key, value) {
  await Preferences.set({ key, value: String(value) });
}

export async function removeItem(key) {
  await Preferences.remove({ key });
}

export async function getJson(key, fallback) {
  const raw = await getItem(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function setJson(key, value) {
  await setItem(key, JSON.stringify(value));
}

export async function getNumber(key, fallback) {
  const raw = await getItem(key);
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function getBoolean(key, fallback) {
  const raw = await getItem(key);
  if (raw == null) return fallback;
  if (raw === 'true' || raw === 'false') return raw === 'true';
  try {
    return Boolean(JSON.parse(raw));
  } catch {
    return fallback;
  }
}
