# Setting Up the Notes Service

The redundant notes/submission service is now built in. Here's what you need to do to activate it:

## Step 1: Set Your Contact Email

Update `.env.local`:

```bash
CONTACT_EMAIL=your-gathering-email@gmail.com
```

This is where all submissions (notes, contact forms, recommendations) will be sent.

## Step 2: Verify Resend API Key

Ensure your `RESEND_API_KEY` is set in `.env.local`:

```bash
RESEND_API_KEY=re_your_key_here
```

If you don't have one:
1. Go to [resend.com](https://resend.com)
2. Create an account
3. Generate an API key in your dashboard
4. Add it to `.env.local`

**Important:** In Resend, verify the sender email address (`contact@gatheringisreal.org`) in the dashboard before it will actually send.

## Step 3: (Optional) Set Up Admin Token for Retries

If you want to protect the retry endpoint, set:

```bash
RETRY_ADMIN_TOKEN=your-secret-token
```

Then only requests with `Authorization: Bearer your-secret-token` can trigger retries.

## Step 4: Test It

Start the dev server:

```bash
npm run dev
```

Then go to http://localhost:3000/contact and submit a test message.

You should receive an email at your `CONTACT_EMAIL` address.

## What Happens Behind the Scenes

1. **Form submission** → POST `/api/submit`
2. **Server stores** → Saves to `.submissions/submissions.jsonl` (durability layer)
3. **Server sends email** → Via Resend API
4. **Fallback triggers** → If email fails, client sees "offline" message and stores in localStorage
5. **Auto-retry** → Failed submissions retry up to 3 times via `/api/retry-submissions`

## Checking Status

To see all stored submissions:

```bash
curl http://localhost:3000/api/retry-submissions
```

To manually retry failed submissions:

```bash
curl -X POST http://localhost:3000/api/retry-submissions \
  -H "Authorization: Bearer YOUR_RETRY_ADMIN_TOKEN"
```

Or use the CLI:

```bash
npx ts-node scripts/check-submissions.ts
```

## Production Deployment (Vercel)

When you deploy to Vercel:

1. Add environment variables in the Vercel dashboard:
   - `RESEND_API_KEY`
   - `CONTACT_EMAIL`
   - `RETRY_ADMIN_TOKEN` (optional)

2. Note: `.submissions/` is in `.gitignore`, so submissions won't persist across redeploys on Vercel. For production-grade persistence, consider:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [MongoDB](https://www.mongodb.com)
   - [Supabase](https://supabase.com)

   See `docs/SUBMISSIONS.md` for database integration notes.

3. Set up automated retries (optional) in `vercel.ts`:
   ```typescript
   export const config: VercelConfig = {
     crons: [
       { path: '/api/retry-submissions', schedule: '0 */6 * * *' }
     ]
   };
   ```

## Monitoring in Production

Since `.submissions/` won't persist on Vercel's ephemeral filesystem, monitor emails:

1. Check Resend dashboard for bounce/delivery rates
2. Set up email forwarding on your account to a team channel
3. Watch for repeated failures in Resend logs

For persistent monitoring, integrate with a database (see above).

## Common Issues

### "Failed to send" appears but email arrives anyway

The email did send, but the API response was slow. Resend eventually delivers it. The UI shows this as a fallback to be safe.

### Email never arrives

1. Check `RESEND_API_KEY` is valid
2. Verify sender address (`contact@gatheringisreal.org`) in Resend dashboard
3. Check spam folder
4. View error logs: `curl http://localhost:3000/api/retry-submissions | jq`

### Submissions stuck in pending

Local dev: Check `.submissions/submissions.jsonl` for error details
Production: Check Resend dashboard for bounce reasons

## Next Steps

- [ ] Set `CONTACT_EMAIL` and `RESEND_API_KEY` in `.env.local`
- [ ] Test a form submission locally
- [ ] (Optional) Set `RETRY_ADMIN_TOKEN` for retry endpoint protection
- [ ] Deploy to Vercel
- [ ] Add production env vars in Vercel dashboard
- [ ] (Optional) Integrate database for persistent submission history

Questions? See `docs/SUBMISSIONS.md` for detailed technical documentation.
