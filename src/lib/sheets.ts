// Google Apps Script web-app bridge (see google-apps-script/code.gs).
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string | undefined;

export const isSheetsConfigured = Boolean(SCRIPT_URL);

export interface WishRow {
  name: string;
  message: string;
  createdAt: string;
}

/**
 * Apps Script cannot answer CORS preflights, so we POST a "simple" form-encoded
 * request with no-cors. The response is opaque, but the row is written.
 */
async function post(sheet: 'RSVP' | 'WISHES', fields: Record<string, string>): Promise<void> {
  if (!SCRIPT_URL) throw new Error('VITE_GOOGLE_APPS_SCRIPT_URL is not configured.');
  const body = new URLSearchParams({ sheet, ...fields });
  await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body });
}

export const submitRsvp = (data: {
  name: string;
  phone: string;
  attendance: string;
  guests: string;
  message: string;
  invitedAs: string;
}) => post('RSVP', data);

export const submitWish = (data: { name: string; message: string; invitedAs: string }) =>
  post('WISHES', data);

export async function fetchWishes(): Promise<WishRow[]> {
  if (!SCRIPT_URL) return [];
  const res = await fetch(`${SCRIPT_URL}?action=wishes`);
  const json = await res.json();
  return Array.isArray(json?.wishes) ? json.wishes : [];
}
