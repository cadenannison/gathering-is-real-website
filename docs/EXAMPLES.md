# Note Service Examples

Practical examples of using the redundant notes submission service.

## Example 1: Basic Form Submission (Frontend)

```typescript
import { useSubmissionWithFallback } from "@/lib/useSubmissionWithFallback";

export function ContactForm() {
  const { status, submit, pendingCount } = useSubmissionWithFallback();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = await submit({
      type: "contact",
      name: "Alice",
      email: "alice@example.com",
      subject: "Partnership inquiry",
      message: "I'd like to partner with Gathering Is Real...",
    });

    if (result.success) {
      alert("Message sent! Thank you.");
      e.currentTarget.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      {pendingCount > 0 && <p>⚠️ {pendingCount} pending messages</p>}
    </form>
  );
}
```

## Example 2: Note/Message Type

Someone wants to leave a note for a team member:

```typescript
const result = await submit({
  type: "note",
  name: "Bob",
  fromPlace: "San Francisco",
  to: "Alice",
  note: "Hi Alice! I attended your event last month and wanted to follow up about volunteering.",
});
```

**Email received by `CONTACT_EMAIL`:**
```
Subject: [Note] For Alice — from Bob

To: Alice
From: Bob — San Francisco
─────────────────────────────
Hi Alice! I attended your event last month and wanted to follow up about volunteering.
```

## Example 3: Recommend a Place

A user recommends a meaningful location:

```typescript
const result = await submit({
  type: "recommend",
  name: "Carol",
  email: "carol@example.com",
  place: "The Friendship Park at Sunset",
  reason: "This place brings communities together. Great for volunteer meetups.",
  planningToTravel: "yes",
  phone: "(415) 555-0123",
});
```

**Email received:**
```
Subject: [Recommend a Place] The Friendship Park at Sunset

Place: The Friendship Park at Sunset
Reason / significance: This place brings communities together. Great for volunteer meetups.
Travelling there within the upcoming year: yes
─────────────────────────────
Name: Carol
Email: carol@example.com
Phone: (415) 555-0123
```

## Example 4: Offline Scenario

User submits while offline:

```typescript
// Browser is offline (navigator.onLine === false)
const result = await submit({
  type: "contact",
  name: "David",
  email: "david@example.com",
  subject: "Quick question",
  message: "When is the next event?",
});

// result: { success: false }
// Message is saved to localStorage automatically
```

**User sees UI message:**
> ℹ️ You appear to be offline. Your message has been saved and will be sent when you're back online.

**When user comes back online:**
```typescript
const sentCount = await retryPending();
// sentCount: 1
// Message is resent and removed from localStorage
```

## Example 5: Network Failure Scenario

Resend API temporarily down:

```
POST /api/submit
Response: { error: "SMTP timeout" }
Status: 202 Accepted

Backend actions:
1. Submission stored to .submissions/submissions.jsonl ✓
2. Email send failed, but submission has emailSent=false
3. Retry count incremented
```

**User sees UI message:**
> ⚠️ Something went wrong. Your message has been saved and will be sent when the connection is restored.

**Message is now stored locally AND on server.**

**Later, via automated retry or manual trigger:**
```bash
curl -X POST http://localhost:3000/api/retry-submissions
# { attempted: 1, succeeded: 1, failed: 0 }
```

Message is resent and marked as successfully delivered.

## Example 6: Checking Submission Status

**Via CLI:**
```bash
$ npx ts-node scripts/check-submissions.ts

📊 Submission Status Report

Total submissions: 47
✅ Successfully sent: 45
⏳ Pending: 2
❌ Failed (max retries): 0

Pending Submissions:
  - [1704090600000-abc] contact (1/15/2024, 10:30:00 AM) - Retries: 1
    Error: SMTP timeout
```

**Via API:**
```bash
$ curl http://localhost:3000/api/retry-submissions | jq .

{
  "total": 47,
  "pending": 2,
  "failed": 0,
  "submissions": [
    {
      "id": "1704090600000-abc",
      "timestamp": "2024-01-15T10:30:00Z",
      "type": "contact",
      "retryCount": 1,
      "error": "SMTP timeout"
    }
  ]
}
```

## Example 7: Inspecting Raw Submission Log

```bash
$ tail -3 .submissions/submissions.jsonl | jq .

{
  "id": "1704090600000-abc",
  "timestamp": "2024-01-15T10:30:00.123Z",
  "payload": {
    "type": "contact",
    "name": "Eve",
    "email": "eve@example.com",
    "subject": "Hello",
    "message": "I love what you do!"
  },
  "emailSent": true,
  "retryCount": 0
}

{
  "id": "1704090605000-def",
  "timestamp": "2024-01-15T10:30:05.456Z",
  "payload": {
    "type": "note",
    "name": "Frank",
    "fromPlace": "LA",
    "to": "Eve",
    "note": "Let's connect!"
  },
  "emailSent": false,
  "emailError": "Failed to connect to mail server",
  "retryCount": 1
}
```

## Example 8: Programmatic Retry (Backend)

```typescript
// In a cron job or admin endpoint
async function retryFailedSubmissions() {
  const response = await fetch('http://localhost:3000/api/retry-submissions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RETRY_ADMIN_TOKEN}`
    }
  });
  
  const result = await response.json();
  console.log(`Retried ${result.attempted} submissions`);
  console.log(`Succeeded: ${result.succeeded}`);
  console.log(`Failed: ${result.failed}`);
  
  if (result.failed > 0) {
    // Send alert to team
    await notifyTeam(`${result.failed} submissions failed to send`);
  }
}
```

## Example 9: Handling Maximum Retries

After 3 failed retry attempts, a submission stops trying:

```bash
$ npx ts-node scripts/check-submissions.ts

Failed Submissions (exceeded max retries):
  - [1704090700000-xyz] contact (1/15/2024, 10:35:00 AM)
    Error: API key invalid
```

**Action required:** 
Either fix the issue (e.g., update `RESEND_API_KEY`) or manually resend via admin panel.

## Example 10: Multiple Submission Types in One Session

```typescript
const { submit } = useSubmissionWithFallback();

// User sends a contact form
await submit({ type: "contact", name: "Grace", ... });

// Later, user sends a note to someone
await submit({ type: "note", name: "Grace", to: "Bob", ... });

// User recommends a place
await submit({ type: "recommend", name: "Grace", place: "...", ... });
```

All three submissions are:
1. Stored to server log
2. Sent via email
3. Tracked individually
4. Can be retried independently if one fails

---

**See Also:** 
- [docs/SUBMISSIONS.md](SUBMISSIONS.md) — Technical details
- [docs/SETUP-NOTES-SERVICE.md](SETUP-NOTES-SERVICE.md) — Quick start
