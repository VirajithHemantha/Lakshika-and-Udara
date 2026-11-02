/**
 * Lakshika & Udara — RSVP + Wishes backend
 *
 * Paste this whole file into Extensions > Apps Script of the spreadsheet,
 * then Deploy > New deployment > Web app (Execute as: Me, Access: Anyone).
 * The "RSVP" and "Wishes" sheets are created automatically with headers.
 */
const SPREADSHEET_ID = '1eUzAA3R2zIOW0X2LXmdC2bnpsYcf6w6XWpfzZsCI63g';

const SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Name', 'Phone', 'Attendance', 'Guests', 'Message', 'Invited As'],
    widths: [170, 200, 130, 130, 70, 320, 200],
    color: '#0b3323',
  },
  WISHES: {
    name: 'Wishes',
    headers: ['Timestamp', 'Name', 'Message', 'Invited As'],
    widths: [170, 200, 420, 200],
    color: '#c5a059',
  },
};

const MAX_LEN = 1000;
const WISHES_LIMIT = 100;

/* ---------------- Web app endpoints ---------------- */

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const p = parsePayload_(e);
    const key = String(p.sheet || '').toUpperCase();
    const config = key === 'WISH' ? SHEETS.WISHES : SHEETS[key];
    if (!config) return json_({ ok: false, error: 'Invalid sheet. Use RSVP or WISHES.' });

    const sheet = getSheet_(config);

    if (config === SHEETS.RSVP) {
      if (!clean_(p.name)) return json_({ ok: false, error: 'Name is required.' });
      sheet.appendRow([
        new Date(),
        clean_(p.name),
        clean_(p.phone),
        clean_(p.attendance),
        clean_(p.guests),
        clean_(p.message),
        clean_(p.invitedAs),
      ]);
    } else {
      if (!clean_(p.name) || !clean_(p.message)) {
        return json_({ ok: false, error: 'Name and message are required.' });
      }
      sheet.appendRow([new Date(), clean_(p.name), clean_(p.message), clean_(p.invitedAs)]);
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : '';
  if (action === 'wishes') {
    return json_({ ok: true, wishes: readWishes_() });
  }
  return json_({ ok: true, message: 'Lakshika & Udara wedding endpoint is running.' });
}

/** Run once from the editor (optional) to create both sheets immediately. */
function setup() {
  getSheet_(SHEETS.RSVP);
  getSheet_(SHEETS.WISHES);
}

/* ---------------- Helpers ---------------- */

function readWishes_() {
  const sheet = getSheet_(SHEETS.WISHES);
  const last = sheet.getLastRow();
  if (last < 2) return [];
  const start = Math.max(2, last - WISHES_LIMIT + 1);
  const rows = sheet.getRange(start, 1, last - start + 1, 3).getValues();
  return rows
    .filter(function (r) { return r[1] && r[2]; })
    .map(function (r) {
      return {
        createdAt: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
        name: String(r[1]),
        message: String(r[2]),
      };
    })
    .reverse();
}

/** Gets a sheet by name, creating it with styled headers if it does not exist or is empty. */
function getSheet_(config) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(config.name);
  if (!sheet) sheet = ss.insertSheet(config.name);

  if (sheet.getLastRow() === 0) {
    const n = config.headers.length;
    sheet.getRange(1, 1, 1, n)
      .setValues([config.headers])
      .setFontWeight('bold')
      .setFontColor('#ffffff')
      .setBackground(config.color)
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    config.widths.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
    // Keep phone numbers like 0717232621 as text so the leading zero survives.
    if (config === SHEETS.RSVP) sheet.getRange('C:C').setNumberFormat('@');
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  }
  return sheet;
}

/** Trims, limits length and neutralises spreadsheet formula injection. */
function clean_(value) {
  let s = String(value == null ? '' : value).trim().slice(0, MAX_LEN);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function parsePayload_(e) {
  if (e && e.parameter && Object.keys(e.parameter).length > 0) return e.parameter;
  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) return {};
  try {
    return JSON.parse(contents);
  } catch (_err) {
    return {};
  }
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
