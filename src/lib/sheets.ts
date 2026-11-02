// Google Apps Script web-app bridge (see google-apps-script/code.gs).
// The env var can override this, but the deployed URL is hard-coded so no hosting setup is needed.
const DEFAULT_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzA00QrtPWjKkgh3WUgnvmfPfRrpo8D6kcjWSxk33YLoUqB117kmLZP-qQxZ0bYxJ29AQ/exec';
const SCRIPT_URL = (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string | undefined) || DEFAULT_SCRIPT_URL;

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
