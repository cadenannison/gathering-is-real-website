# Note & Submission Service with Redundancy

This document describes the note/form submission service and how it ensures no submissions are lost.

## Overview

The submission service provides three layers of redundancy:

1. **Email (Primary):** Resend API sends emails to the configured `CONTACT_EMAIL`
2. **Server-side Storage:** All submissions logged to `.submissions/submissions.jsonl` for durability
3. **Client-side Fallback:** Failed submissions stored in localStorage for retry when online

## Architecture

### Frontend (Client)

**File:** `components/sections/ContactForm.tsx` and `lib/useSubmissionWithFallback.ts`

When a user submits a form:
1. Form submission is sent to `/api/submit`
2. If the request succeeds, form resets
3. If the request fails (network error or server error):
   - Submission is saved to localStorage
   - User sees a message indicating offline status
   - User badge shows count of pending submissions

When the user comes back online:
- Pending submissions can be retried
- The hook provides a `retryPending()` method

### Backend (Server)

#### `/api/submit` - Main submission endpoint

**POST /api/submit**

Accepts submissions in the following types:

```typescript
// Contact form
{ type: "contact", name, email, subject, message }

// Note/message to someone
{ type: "note", name, fromPlace, to, note }

// Recommend a place
{ type: "recommend", name, email, place, reason, planningToTravel, phone? }

// Notify me
{ type: "notify", email }
```

**Behavior:**
1. Validates payload
2. Stores submission to `.submissions/submissions.jsonl` (durability)
3. Attempts to send via Resend email API
4. Updates storage with send status
5. Returns `202 Accepted` on any failure (submission is stored)
6. Returns `200 OK` on success

**Why 202 on failure?**
The submission is safely stored server-side, so the client should be satisfied that it won't be lost. This allows the frontend to show success UI even if the email send temporarily failed.

#### `/api/retry-submissions` - Retry failed submissions

**POST /api/retry-submissions**

Attempts to resend all stored submissions that haven't been successfully sent (up to 3 retries each).

Optional auth: Pass `Authorization: Bearer <RETRY_ADMIN_TOKEN>` if `RETRY_ADMIN_TOKEN` env var is set.

**Response:**
```json
{
  "attempted": 5,
  "succeeded": 3,
  "failed": 2,
  "ids": ["id1", "id2", "id3"]
}
```

**GET /api/retry-submissions**

Returns status of all pending submissions.

**Response:**
```json
{
  "total": 47,
  "pending": 5,
  "failed": 2,
  "submissions": [
    {
      "id": "1234567-abc",
      "timestamp": "2024-01-15T10:30:00Z",
      "type": "contact",
      "retryCount": 2,
      "error": "SMTP timeout"
    }
  ]
}
```

### Storage Format

File: `.submissions/submissions.jsonl`

Each line is a JSON object representing one submission:

```json
{
  "id": "1234567-abc",
  "timestamp": "2024-01-15T10:30:00Z",
  "payload": { "type": "contact", "name": "John", ... },
  "emailSent": false,
  "emailError": "Failed to connect to mail server",
  "retryCount": 2
}
```

## Configuration

### Environment Variables

```bash
# Resend API key (required)
RESEND_API_KEY=re_xxx...

# Email to receive submissions
CONTACT_EMAIL=team@gatheringisreal.org

# Optional: token to protect retry endpoint
RETRY_ADMIN_TOKEN=secret-key-123
```

## Usage

### From Frontend

```typescript
import { useSubmissionWithFallback } from "@/lib/useSubmissionWithFallback";

function MyForm() {
  const { status, submit, retryPending, pendingCount } = useSubmissionWithFallback();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submit({
      type: "contact",
      name: "Alice",
      email: "alice@example.com",
      subject: "Hello",
      message: "I have a question...",
    });

    if (result.success) {
      console.log("Submitted!");
    }
  };

  return (
    <div>
      {pendingCount > 0 && (
        <button onClick={retryPending}>
          Retry {pendingCount} pending submission(s)
        </button>
      )}
      {/* form fields */}
    </div>
  );
}
```

### From Backend

To manually retry submissions (e.g., via cron job):

```bash
curl -X POST http://localhost:3000/api/retry-submissions \
  -H "Authorization: Bearer YOUR_RETRY_ADMIN_TOKEN"
```

Or check status:

```bash
curl http://localhost:3000/api/retry-submissions
```

### CLI Tool

Check submission status locally:

```bash
npx ts-node scripts/check-submissions.ts
```

Output:
```
📊 Submission Status Report

Total submissions: 47
✅ Successfully sent: 45
⏳ Pending: 2
❌ Failed (max retries): 0

Pending Submissions:
  - [1704090600000-abc] contact (1/15/2024, 10:30:00 AM) - Retries: 1
    Error: SMTP timeout
```

## Guarantees

✅ **No data loss:** Every submission is persisted before attempting to send
✅ **Automatic recovery:** Failed submissions are retried up to 3 times
✅ **Offline support:** Submissions queued locally if network is unavailable
✅ **Redundant storage:** Both server-side and client-side fallback
✅ **Audit trail:** Complete log of all submissions with timestamps and statuses
✅ **HTML email escape:** User input is properly escaped to prevent injection

## Monitoring

### Daily Check

To see if there are any stuck submissions, run:

```bash
npx ts-node scripts/check-submissions.ts
```

### Automated Retry (Optional)

To set up automated retries, add a cron job via Vercel:

In `vercel.ts`:
```typescript
export const config: VercelConfig = {
  crons: [
    { path: '/api/retry-submissions', schedule: '0 */6 * * *' } // Every 6 hours
  ]
};
```

## Troubleshooting

### "Something went wrong" message appears

This is expected for temporary network issues. The submission is stored and will be retried.

### Submissions stuck in pending state

Check `.submissions/submissions.jsonl` to see error details:

```bash
tail -5 .submissions/submissions.jsonl | jq .
```

### Resend API failures

Common issues:
- **Invalid API key:** Check `RESEND_API_KEY` is correct
- **Unverified email:** The sending email must be verified in Resend dashboard
- **Rate limits:** Resend has rate limiting; check account status

### localStorage full

If a user has many pending submissions (rare), localStorage quota may be exceeded. The hook silently fails in this case. Manually delete old submissions:

```javascript
// In browser console
localStorage.removeItem('gir_failed_submissions');
```

## Future Improvements

- [ ] Database integration (Vercel Postgres, MongoDB) for persistence beyond `.jsonl`
- [ ] Webhook delivery for external systems (Slack, Discord alerts)
- [ ] Admin dashboard to view and resend submissions
- [ ] SMS notifications for critical submission failures
- [ ] Rate limiting per IP to prevent spam
- [ ] Signed submission IDs to prevent tampering
