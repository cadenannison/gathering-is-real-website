# If the site is down or wrong

Goal: get back to the last good version in under 5 minutes. Fix the cause afterwards.

1. **Is it really down?** Open `https://<TAILOR: production domain>/api/health`. It should show `{"ok":true,...}`. If this loads but a page looks wrong, it's a content or code problem (step 3). If it doesn't load, check the host's status page and the domain/DNS (step 4).
2. **Did we just publish something?** If yes, go to step 3.
3. **Roll back.** Hosting is Vercel: dashboard → project → Deployments → pick the last deployment that was healthy → **⋯ → Instant Rollback**. (Rollback pauses automatic deploys until you promote a new one; that is intended.) Then, on GitHub, open the bad pull request and click **Revert** so `main` matches what is live.
4. **Not a deploy problem?** Check that the domain hasn't expired and the DNS records still point at the host.
5. **Forms (notes, contact, recommend a place) failing?** The site keeps working; submissions are the thing to protect. Check the email service dashboard (Resend) for the API key and the sending domain, and the contact inbox's spam folder. <TAILOR: describe where saved submissions can be found once that is verified>
6. **Write down what happened** in one line in the pull request or `docs/` so the same mistake gets a new check.
