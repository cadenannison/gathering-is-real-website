# Notes Service - Implementation Summary

A robust, redundant note/form submission service has been built to ensure no submissions are lost, even when the network is unreliable.

## What Was Built

### Files Modified
- **[app/api/submit/route.ts](../app/api/submit/route.ts)** — Enhanced to store submissions and handle failures gracefully
- **[components/sections/ContactForm.tsx](../components/sections/ContactForm.tsx)** — Now uses fallback hook for offline support
- **.gitignore** — Added `.submissions/*` to keep local logs out of git

### Files Created

**API Endpoints:**
- **[app/api/retry-submissions/route.ts](../app/api/retry-submissions/route.ts)** — Retry failed submissions + GET status

**Client-side:**
- **[lib/useSubmissionWithFallback.ts](../lib/useSubmissionWithFallback.ts)** — React hook with localStorage fallback

**Utilities:**
- **[scripts/check-submissions.ts](../scripts/check-submissions.ts)** — CLI tool to inspect submission logs

**Documentation:**
- **[docs/SUBMISSIONS.md](../SUBMISSIONS.md)** — Technical deep-dive
- **[docs/SETUP-NOTES-SERVICE.md](../SETUP-NOTES-SERVICE.md)** — Quick setup guide

## Redundancy Layers

### 1. Email (Primary)
- Sends via Resend API to `CONTACT_EMAIL`
- No retry if fails immediately (but see layers below)

### 2. Server-side Storage
- Every submission logged to `.submissions/submissions.jsonl`
- Happens before email send attempt (durability first)
- Survives server crashes, process restarts
- Can be inspected/debugged post-mortem

### 3. Retry Mechanism
- Failed submissions auto-retry up to 3 times via `/api/retry-submissions`
- Can be triggered:
  - Manually: `curl -X POST /api/retry-submissions`
  - Via cron: Vercel cron jobs every 6 hours (optional)
  - Programmatically: Call the API with your auth token

### 4. Client-side Fallback
- If submission request fails, saved to localStorage
- User sees clear "offline" message
- UI shows count of pending submissions
- When back online, user can manually retry OR it retries on page reload

## Key Behaviors

✅ **Status Code 202 on Email Failure**
If email send fails but submission is stored, returns `202 Accepted` instead of `500` error. The client knows the data is safe.

✅ **Offline Detection**
Checks `navigator.onLine` before attempting request. If offline, saves to localStorage immediately without trying.

✅ **HTML Escaping**
All user input properly escaped in email bodies to prevent injection attacks.

✅ **Audit Trail**
Complete log of every submission with:
- Unique ID + timestamp
- Full payload
- Email send status + error message (if any)
- Retry count

## Usage Examples

### For End Users (No Configuration Needed)

1. Fill out contact/note form
2. Click submit
3. If online, email is sent immediately
4. If offline or email fails:
   - Page shows "saved locally" message
   - Submission stored in browser storage
   - When online again, can manually retry

### For Developers

**Check submission status:**
```bash
npx ts-node scripts/check-submissions.ts
```

**Inspect raw log:**
```bash
tail -20 .submissions/submissions.jsonl | jq .
```

**Manually retry failed submissions:**
```bash
curl -X POST http://localhost:3000/api/retry-submissions
```

**View pending submissions (JSON):**
```bash
curl http://localhost:3000/api/retry-submissions | jq .
```

### For Team Leads

**Set up automated retries** (in `vercel.ts`):
```typescript
export const config: VercelConfig = {
  crons: [
    { path: '/api/retry-submissions', schedule: '0 */6 * * *' }
  ]
};
```

This automatically retries any failed submissions every 6 hours.

## Environment Setup

Ensure `.env.local` has:
```bash
RESEND_API_KEY=re_...              # Your Resend API key
CONTACT_EMAIL=team@example.com     # Email to receive submissions
RETRY_ADMIN_TOKEN=secret-key       # Optional: protect retry endpoint
```

## What's NOT Included (Optional Upgrades)

These would add even more durability for production:
- Database integration (PostgreSQL, MongoDB) for persistent submission history
- Webhook notifications (Slack, Discord) for incoming submissions
- Admin dashboard to manage submissions
- Rate limiting per IP
- SMS alerts for critical failures

See `docs/SUBMISSIONS.md` for future improvements section.

## Testing

**Local dev:**
```bash
npm run dev
# Go to http://localhost:3000/contact
# Submit a test form
# Check email arrives
# Check submission in `.submissions/submissions.jsonl`
```

**Offline simulation:**
```javascript
// In browser DevTools Console
navigator.onLine = false;
// Now submit a form — it should save to localStorage
localStorage.getItem('gir_failed_submissions')
```

## Deployment Notes

**Vercel (stateless):**
- `.submissions/` is ephemeral (not persisted across redeploys)
- For production, you'll want database integration
- Email delivery is guaranteed by Resend (check their dashboard)

**Self-hosted:**
- `.submissions/` persists across restarts
- You can inspect the log directly
- Set up cron job to call `/api/retry-submissions` periodically

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Something went wrong" message | Normal for network issues; submission is stored |
| Email never arrives | Check `RESEND_API_KEY` validity + sender verification in Resend |
| Submissions stuck pending | Check `.submissions/submissions.jsonl` for error details |
| localStorage full | Browser quota exceeded (rare); manually clear if needed |

---

**Status:** ✅ Ready to use  
**Last Updated:** 2026-09-02  
**Setup Time:** ~5 minutes  
**Maintenance:** Check submission log monthly
