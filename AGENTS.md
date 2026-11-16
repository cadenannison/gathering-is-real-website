<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project rules (lite kit)

- Stack: Next.js 16 (App Router), React 19, Tailwind 4, TypeScript, npm. Hosting: Vercel (working assumption from `.gitignore` and `docs/`; confirm with the project manager).
- Site content lives in `data/*.ts` and `public/`. Change data, not components, for copy, photos, projects, links.
- Commands: `npm run check:fast` (typecheck + content check) while working; `npm run check` (adds build + smoke test) before reporting done.
- Do not commit or push. Do not add, upgrade or remove packages. Do not edit `.github/`, `scripts/hooks/`, `.claude/settings.json`, `package-lock.json`, `.nvmrc`. Ask the project manager.
- Do not edit or delete an existing check to make it pass. If a check is wrong, stop and report why.
- Third parties (email, fonts, analytics) must fail soft: save the user's data first, notify second, never let a missing key or outage break a page or lose a submission.
- Files in `public/` are referenced with exact-case paths. Photos `.jpg` < 2 MB, videos `.mp4` (H.264) < 8 MB.
- Before editing Next.js code, read the matching guide in `node_modules/next/dist/docs/` (see the block above).
- Report: files changed, and the last lines of `npm run check`.
