import { WEDDING } from '../config/wedding';

export const PREFIXES = [
  { key: 'mr', label: 'Mr.' },
  { key: 'mrs', label: 'Mrs.' },
  { key: 'miss', label: 'Miss' },
  { key: 'mrmrs', label: 'Mr. & Mrs.' },
  { key: 'family', label: 'Family' },
  { key: 'dear', label: 'Dear' },
] as const;

export type PrefixKey = (typeof PREFIXES)[number]['key'];

const isPrefixKey = (value: string | null): value is PrefixKey =>
  PREFIXES.some((p) => p.key === value);

/**
 * Combines prefix + name. "Dear" is a greeting style, not a title,
 * so it returns the bare name (the greeting itself adds "Dear").
 */
export function buildDisplayName(prefix: PrefixKey, rawName: string): string {
  const name = rawName.trim().replace(/\s+/g, ' ');
  if (!name) return '';
  switch (prefix) {
    case 'mr': return `Mr. ${name}`;
    case 'mrs': return `Mrs. ${name}`;
    case 'miss': return `Miss ${name}`;
    case 'mrmrs': return `Mr. & Mrs. ${name}`;
    case 'family': return `${name} and Family`;
    case 'dear': return name;
  }
}

/** `{baseURL}/{guestName}` — prefix is carried in `?to=` so the site can show the full display name. */
export function buildInviteLink(baseUrl: string, prefix: PrefixKey, rawName: string): string {
  const name = rawName.trim().replace(/\s+/g, ' ');
  const base = baseUrl.replace(/\/+$/, '');
  const path = `${base}/${encodeURIComponent(name)}`;
  return prefix === 'dear' ? path : `${path}?to=${prefix}`;
}

export function buildInviteMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${WEDDING.groom.name} & ${WEDDING.bride.name}`;
}

/** Reads the guest from the current URL (`/Sanjaya?to=mr`). Returns '' when there is no guest. */
export function guestFromLocation(loc: Location = window.location): string {
  const segment = loc.pathname.split('/').filter(Boolean)[0];
  if (!segment) return '';
  let name = '';
  try {
    name = decodeURIComponent(segment);
  } catch {
    name = segment;
  }
  const to = new URLSearchParams(loc.search).get('to');
  return buildDisplayName(isPrefixKey(to) ? to : 'dear', name);
}
