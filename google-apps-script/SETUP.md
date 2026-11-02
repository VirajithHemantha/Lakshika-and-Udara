# Google Sheets setup (RSVP + Wishes)

Spreadsheet: https://docs.google.com/spreadsheets/d/1eUzAA3R2zIOW0X2LXmdC2bnpsYcf6w6XWpfzZsCI63g/edit

1. Open the spreadsheet → **Extensions → Apps Script**.
2. Delete everything in `Code.gs` and paste the full contents of `google-apps-script/code.gs`.
3. (Optional) Select the `setup` function and click **Run** to create the `RSVP` and `Wishes`
   sheets right away. Approve the permissions prompt. Otherwise they are created on the first submission.
4. **Deploy → New deployment** → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web app URL (ends with `/exec`).
6. Set it as an environment variable:
   - Local: create `.env` in the project root with
     `VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec`
   - Vercel / Netlify: add the same variable in the project settings, then redeploy.

Sheets created automatically:

| Sheet  | Columns |
| ------ | ------- |
| RSVP   | Timestamp, Name, Phone, Attendance, Guests, Message, Invited As |
| Wishes | Timestamp, Name, Message, Invited As |

If you change `code.gs` later, use **Deploy → Manage deployments → Edit → New version**
so the same URL keeps working.
