# Gathering Is Real: Lite Bootstrap Kit (Next.js 16 + npm)

A small version of the Universal Repo Bootstrap Kit / Command Center scaffolding, cut down for a nonprofit website that non-developers need to edit safely. Two goals:

1. **Easy to edit.** Content stays in `data/*.ts` and `public/`. A plain-language editing guide, and a content check that explains mistakes in words a non-developer can act on.
2. **No downtime.** Nothing reaches the live site without passing one required check and being previewed. Rollback is a documented one-click step. A health endpoint and an uptime monitor tell you within minutes if the site goes down.

What was left out on purpose: mise, pnpm policy, import-linter, decision records, mutation tests, the multi-agent roster. Add them only if the site grows into an app.

Everything in section 4 was run against a copy of the repo (clean pass, deliberately broken data fails with readable messages, guard and stop-gate behavior tested). **Not run:** `next build` and the CI workflow (the test sandbox cannot reach Google Fonts and has no repo write access), so the first CI run is the real test of those two.

---

## 0. Prompt to give Claude Code (run in the repo root, on a new branch)

```
From the project manager. Don't commit or push. Execute directly; skip the plan summary.

Task: apply the Lite Bootstrap Kit in this file to this repo. Sections 3, 4 and 6 are yours; 1, 2, 5, 7 are context and human steps. Tailor per section 3, keep the diff to the files listed, and fix nothing from section 2 in this task.

Done when: `npm run check` passes and you've sent the section 6 report.
```

## 1. What it adds

| Goal | Mechanism | Files |
|---|---|---|
| Edit without code | One guide for the founders; data-first layout; PR template | `docs/EDITING.md`, `.github/pull_request_template.md` |
| Catch bad edits before they ship | Content check: slugs, coordinates, required fields, missing or wrong-case files, oversized photos/videos | `scripts/check-content.ts` |
| Catch broken builds and pages | Typecheck + build + smoke test (every page returns 200, unknown URL returns 404) | `scripts/smoke.mjs`, `.github/workflows/ci.yml` |
| Nothing unchecked reaches live | One required check named `gate`, PR required on `main` | CI + branch protection (section 5) |
| Fast recovery | Health endpoint, uptime monitor, rollback runbook | `app/api/health/route.ts`, `docs/RUNBOOK.md` |
| Safe dependency drift | Weekly grouped Dependabot, majors of next/react left to a human, `npm ci` only | `.github/dependabot.yml` |
| Keep AI agents inside the lines | No commit/push, no package changes, no editing the guardrails, fast gates once per turn | `.claude/settings.json`, `scripts/hooks/*`, `AGENTS.md` |

## 2. Findings in this repo (separate follow-up tasks, in this order)

1. **A missing email key loses the submission.** `app/api/submit/route.ts` builds `new Resend(process.env.RESEND_API_KEY)` as the first line of `POST`, and the constructor throws "Missing API key" (verified). That happens before `storeSubmission`, so on any environment without the key (a preview deploy, a typo in the dashboard) a note or contact message is lost. Same pattern in `retry-submissions/route.ts`. Fix: store first, construct the client inside the email step, return 202 when it can't send.
2. **The retry endpoint fails open.** `retry-submissions` only checks the token `if (adminToken && ...)`, so with `RETRY_ADMIN_TOKEN` unset anyone can trigger sends. Fix: fail closed (401 when the token is unset or wrong).
3. **The "durable" submission log may not be durable.** Submissions are appended to `.submissions/` on the local filesystem. Serverless hosts (Vercel included) have an ephemeral or read-only filesystem, so this likely does not survive between requests. Not verified because hosting is not confirmed. If serverless, rely on email plus the client-side fallback, or move to a real store; update `docs/SUBMISSIONS*.md` either way.
4. **`.claude/settings.json` is risky.** It is tracked even though `.claude` is gitignored, contains personal absolute paths, and allows `git push *` and `git commit`. The kit replaces it.
5. **Builds download Google Fonts** (`next/font/google` in `app/layout.tsx`). A Google blip fails a deploy but cannot take the live site down; CI retries once. Optional: self-host with `next/font/local`.
6. **Housekeeping:** two empty stray files at the repo root (`next`, `gathering-is-real-temp@0.1.0`), and the package is still named `gathering-is-real-temp`.
7. **No lint and no tests.** The content check and smoke test are the safety net. ESLint is optional and needs a human-approved dependency.

## 3. Tailoring rules for Claude

- Confirm hosting from evidence before writing host-specific text. `.gitignore` has `.vercel` and the docs mention Vercel cron, so Vercel is the working assumption. If anything contradicts that, ask the project manager, and replace every `<TAILOR>` marker in `AGENTS.md` and `docs/RUNBOOK.md`.
- Add the `scripts` and `engines` entries to the existing `package.json`; touch nothing else in it. Do not install anything.
- Adapt `check-content.ts` to the current `data/` shapes if they have changed since this kit was written (it reads `pastProjects`, `currentProject`, `founders`, `media`, `images`, `socials`). Keep error messages in plain language and name the file and field.
- Keep the existing Next.js block at the top of `AGENTS.md`; append the rules from section 4 below it. `CLAUDE.md` already imports `AGENTS.md`.
- Replace `.claude/settings.json` with the one below, and remove the bare `.claude` line from `.gitignore` in favor of `.claude/settings.local.json` so the shared settings are actually tracked.
- Before writing `app/api/health/route.ts`, read the route handler guide in `node_modules/next/dist/docs/01-app/` (Next 16 differs from older versions).
- Do not restructure components, add a CMS, change styling, or touch the API routes. Those are separate tasks.
- If the CI action versions can be resolved to commit SHAs (`gh api repos/actions/checkout/releases/latest`), pin them and keep the version in a trailing comment. If not, leave the major tags.

## 4. Files

### `package.json` (merge these keys into the existing file)
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "content:check": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-content.ts",
    "smoke": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/smoke.mjs",
    "check:fast": "npm run typecheck && npm run content:check",
    "check": "npm run check:fast && npm run build && npm run smoke"
  },
  "engines": { "node": ">=22.18" }
}
```

### `.nvmrc`
```text
22
```

### `app/api/health/route.ts`
```ts
// Uptime check. Must stay dependency-free: no email, no filesystem, no external calls.
// A monitor hitting this should fail only when the site itself is down.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { ok: true, commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? "dev").slice(0, 7) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
```

### `scripts/check-content.ts`
Needs Node 22.18+ (runs TypeScript directly, no new packages). Reads `data/*.ts`, so rerun it after any change to those files' shape.

```ts
// Content check: fails the build on mistakes that would break or blank a page.
// Run: npm run content:check   (Node 22.18+ runs .ts directly; no extra packages)
// Messages are written for non-developers: say what is wrong and where to fix it.
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const pub = path.join(root, "public");
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // photos: resize before uploading
const MAX_VIDEO_BYTES = 8 * 1024 * 1024; // videos: compress to H.264 .mp4
const errors: string[] = [];
const fail = (where: string, msg: string) => errors.push(`${where}: ${msg}`);

/** Exact-case existence check. Macs ignore case, the live server does not: "Guam/img.JPG" vs "guam/img.jpg". */
function existsExact(publicPath: string): boolean {
  if (!publicPath.startsWith("/")) return false;
  let dir = pub;
  for (const part of publicPath.split("/").filter(Boolean)) {
    let names: string[];
    try { names = readdirSync(dir); } catch { return false; }
    if (!names.includes(part)) return false;
    dir = path.join(dir, part);
  }
  return statSync(dir).isFile();
}

function checkFile(where: string, p: unknown, kind: "image" | "video") {
  if (typeof p !== "string" || p === "") return fail(where, "path is empty");
  if (!existsExact(p)) return fail(where, `file not found at public${p} (check the folder, spelling and upper/lower case)`);
  const size = statSync(path.join(pub, p)).size;
  if (kind === "video" && !/\.mp4$/i.test(p)) fail(where, "videos must be .mp4 (H.264); phone .MOV files will not play in most browsers");
  if (kind === "image" && size > MAX_IMAGE_BYTES) fail(where, `image is ${(size / 1048576).toFixed(1)} MB; resize it below 2 MB`);
  if (kind === "video" && size > MAX_VIDEO_BYTES) fail(where, `video is ${(size / 1048576).toFixed(1)} MB; compress it below 8 MB`);
}

const load = async (name: string) => import(pathToFileURL(path.join(root, "data", `${name}.ts`)).href);
const nonEmpty = (v: unknown) => typeof v === "string" && v.trim() !== "";

// --- past projects ---------------------------------------------------------
const { pastProjects } = await load("pastProjects");
const slugs = new Set<string>();
for (const [i, p] of pastProjects.entries()) {
  const w = `data/pastProjects.ts #${i + 1} (${p.location ?? "no location"})`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug ?? "")) fail(w, "slug must be lowercase letters, numbers and dashes, e.g. \"guam\"");
  if (slugs.has(p.slug)) fail(w, `slug "${p.slug}" is used twice`);
  slugs.add(p.slug);
  for (const f of ["location", "impacted", "description"]) if (!nonEmpty(p[f])) fail(w, `"${f}" is empty`);
  const [lng, lat] = p.coordinates ?? [];
  if (!(Number.isFinite(lng) && Number.isFinite(lat) && Math.abs(lng) <= 180 && Math.abs(lat) <= 90))
    fail(w, "coordinates must be [longitude, latitude], e.g. [144.79, 13.44]");
  if (!(Number.isFinite(p.amountRaised) && p.amountRaised >= 0)) fail(w, "amountRaised must be a number, 0 or more");
  if (!Array.isArray(p.photos) || p.photos.length === 0) fail(w, "add at least one photo");
  else p.photos.forEach((ph: string, j: number) => checkFile(`${w} photo ${j + 1}`, ph, "image"));
  if (p.video) checkFile(`${w} video`, p.video, "video");
}

// --- current project -------------------------------------------------------
const { currentProject: c } = await load("currentProject");
if (c.active) {
  for (const f of ["name", "location", "need", "who", "when"]) {
    if (!nonEmpty(c[f])) fail("data/currentProject.ts", `active is true but "${f}" is empty`);
  }
  if (/to be announced|our current project/i.test(`${c.name} ${c.location}`))
    fail("data/currentProject.ts", "active is true but name/location still say the placeholder text");
}
if (c.image) checkFile("data/currentProject.ts image", c.image, "image");

// --- founders, media, socials ----------------------------------------------
const { founders } = await load("founders");
const ids = new Set<string>();
for (const f of founders) {
  const w = `data/founders.ts (${f.name})`;
  if (ids.has(f.id)) fail(w, `id "${f.id}" is used twice`);
  ids.add(f.id);
  if (!nonEmpty(f.name) || !nonEmpty(f.role)) fail(w, "name and role are required");
  if (f.photo) checkFile(`${w} photo`, f.photo, "image");
}
const { media, images } = await load("media");
for (const [k, v] of Object.entries<string | null>(media.help)) if (v) checkFile(`data/media.ts help.${k}`, v, "video");
for (const [k, v] of Object.entries<string | null>(images)) if (v) checkFile(`data/media.ts images.${k}`, v, "image");
const { socials } = await load("socials");
const platforms = new Set<string>();
for (const s of socials) {
  const w = `data/socials.ts (${s.platform})`;
  if (platforms.has(s.platform)) fail(w, "platform listed twice");
  platforms.add(s.platform);
  if (!/^https:\/\//.test(s.url ?? "")) fail(w, "url must start with https://");
  if (!existsExact(s.qr ?? "")) fail(w, `QR image not found at public${s.qr}`);
}

if (errors.length) {
  console.error(`\nContent check failed (${errors.length}):\n` + errors.map((e) => `  - ${e}`).join("\n") + "\n");
  process.exit(1);
}
console.log(`content: ok (${pastProjects.length} past project(s), ${founders.length} founder(s), ${socials.length} social link(s))`);
```

### `scripts/smoke.mjs`
Used by CI after the build. Also works against a preview: `BASE_URL=https://<preview-url> npm run smoke`.

```js
// Post-build smoke test: starts the built site and requests every page.
// Run: npm run smoke   (after `npm run build`). Set BASE_URL to test a running site instead
// (e.g. a preview URL): BASE_URL=https://example.vercel.app npm run smoke
import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const PORT = process.env.SMOKE_PORT ?? "3123";
const external = process.env.BASE_URL;
const base = external ?? `http://127.0.0.1:${PORT}`;

// Every static page under app/ (skips dynamic [segments] and route groups' parentheses), plus data-driven pages.
function pages(dir, url = "") {
  let out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory() && !e.name.startsWith("[") && e.name !== "api") {
      const seg = e.name.startsWith("(") ? "" : `/${e.name}`;
      out = out.concat(pages(path.join(dir, e.name), url + seg));
    } else if (e.isFile() && /^page\.(tsx|jsx|ts|js)$/.test(e.name)) out.push(url || "/");
  }
  return out;
}
const { pastProjects } = await import(pathToFileURL(path.join(root, "data", "pastProjects.ts")).href);
const routes = [...new Set([...pages(path.join(root, "app")), ...pastProjects.map((p) => `/past-projects/${p.slug}`)])];

let server;
if (!external) {
  server = spawn(path.join(root, "node_modules/.bin/next"), ["start", "-p", PORT, "-H", "127.0.0.1"], { cwd: root, stdio: "ignore" });
  server.on("exit", (code) => { if (code) { console.error(`smoke: next start exited with ${code} (did you run npm run build?)`); process.exit(1); } });
}
const stop = () => server?.kill();
process.on("exit", stop);

const get = (p) => fetch(base + p, { redirect: "manual", signal: AbortSignal.timeout(20000) });
async function waitUp() {
  for (let i = 0; i < 60; i++) {
    try { if ((await get("/api/health")).ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("site did not start within 30s");
}

const problems = [];
try {
  await waitUp();
  for (const r of routes) {
    try {
      const res = await get(r);
      const body = await res.text();
      if (res.status !== 200) problems.push(`${r}: HTTP ${res.status}`);
      else if (!body.includes("</html>")) problems.push(`${r}: response is not a complete page`);
      else if (/Application error|Internal Server Error/.test(body)) problems.push(`${r}: page shows an error`);
    } catch (e) { problems.push(`${r}: ${e.message}`); }
  }
  const health = await (await get("/api/health")).json().catch(() => ({}));
  if (health.ok !== true) problems.push("/api/health: did not return {ok:true}");
  const missing = await get("/this-page-does-not-exist");
  if (missing.status !== 404) problems.push(`unknown URL should be 404, got ${missing.status}`);
} catch (e) { problems.push(e.message); }
stop();
if (problems.length) { console.error("smoke failed:\n" + problems.map((p) => `  - ${p}`).join("\n")); process.exit(1); }
console.log(`smoke: ok (${routes.length} pages + health + 404)`);
```

### `scripts/hooks/guard-bash.sh`
Claude Code hook. Blocks git commit/push/destructive git (even wrapped in `sh -c`) and dependency changes.

```bash
#!/bin/bash
# Claude Code PreToolUse hook (Bash). Blocks what only the human may do:
#   1. git commit/push and destructive git, even wrapped (sh -c, git -C, absolute path) or with --no-verify
#   2. changing dependencies: npm install/add/update/remove, npx and other package runners
# Allowed: npm ci, npm run, npm test, npm ls, npm outdated, npm audit (without fix).
# Known false positives: read-only commands that merely contain these words (grep "npm install" docs).
command -v jq >/dev/null 2>&1 || { echo "guard-bash: jq is required; install it." >&2; exit 2; }
cmd=$(jq -r '.tool_input.command // empty')
[ -z "$cmd" ] && exit 0
if echo "$cmd" | grep -Eq 'git[^|;&]*[[:space:]](commit|push|stash|clean|rebase|restore)([^[:alnum:]_-]|$)|git[^|;&]*reset[[:space:]]+--hard|git[^|;&]*checkout[[:space:]]+(--[[:space:]]|\.)|git[^|;&]*branch[[:space:]]+(-D|--delete)|--no-verify'; then
  echo "Blocked: commit, push, destructive git and --no-verify are reserved for the human. Report your changes and stop." >&2
  exit 2
fi
b='(^|[^[:alnum:]_.-])'; e='([^[:alnum:]_.-]|$)'
while IFS= read -r seg; do
  echo "$seg" | grep -Eq "${b}(npm|pnpm|yarn|bun|corepack|npx|pnpx|bunx)${e}" || continue
  if echo "$seg" | grep -Eq "${b}(npx|pnpx|bunx|pnpm|yarn|bun|corepack)${e}|${b}npm[[:space:]]+(-[^[:space:]]+[[:space:]]+)*(install|i|add|update|up|upgrade|uninstall|remove|rm|link|exec|x|dedupe|prune|rebuild|install-test|it|in|ins|inst|insta|instal|isnt|isnta|isntal|isntall)${e}|${b}npm[[:space:]]+audit[[:space:]]+fix${e}"; then
    echo "Blocked: changing dependencies or running one-off packages is reserved for the human. Use npm ci / npm run, or ask the project manager to approve the package." >&2
    exit 2
  fi
done < <(printf '%s\n' "$cmd" | tr ';&|' '\n\n\n')
exit 0
```

### `scripts/hooks/stop-gate.sh`
Claude Code hook. Runs `npm run check:fast` once per turn and keeps Claude working if it fails.

```bash
#!/bin/bash
# Claude Code Stop hook: runs the fast gates once per turn (not after every edit).
# Exit 2 keeps Claude working and shows it stderr. Skips if the tree is unchanged since the last run.
# A missing tool turns the gate off, so it says so on stderr (still exit 0).
missing=""
command -v jq >/dev/null 2>&1 || missing="jq"
command -v npm >/dev/null 2>&1 || missing="${missing:+$missing and }npm"
if [ -n "$missing" ]; then echo "stop-gate: skipped, $missing not found on PATH, so the fast gates did not run" >&2; exit 0; fi
root="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$root" || exit 0
# Loop guard: if this hook already blocked this stop once, let it through (CI is the backstop).
[ "$(jq -r '.stop_hook_active // false')" = "true" ] && exit 0
[ -z "$(git status --porcelain 2>/dev/null)" ] && exit 0
[ -d node_modules ] || { echo "stop-gate: skipped, node_modules missing (run npm ci)" >&2; exit 0; }

fingerprint() {
  {
    git diff HEAD --binary 2>/dev/null || { git diff --cached --binary; git diff --binary; } 2>/dev/null
    while IFS= read -r -d '' f; do shasum "$f"; done < <(git ls-files -o --exclude-standard -z 2>/dev/null)
  } | shasum | cut -d' ' -f1
}
stamp="$(git rev-parse --git-path stop-gate.sha 2>/dev/null)"
now="$(fingerprint)"
if [ -n "$stamp" ] && [ -n "$now" ] && [ "$(cat "$stamp" 2>/dev/null)" = "$now" ]; then exit 0; fi
status=0
out=$(npm run --silent check:fast 2>&1) || status=$?
[ -n "$stamp" ] && [ -n "$now" ] && printf '%s\n' "$now" >"$stamp" 2>/dev/null
if [ "$status" -ne 0 ]; then echo "$out" | tail -60 >&2; exit 2; fi
exit 0
```

### `scripts/hooks/pre-push`
Runs for the human's pushes, same as CI.

```bash
#!/bin/bash
# Mirrors CI so a broken push is caught locally. Installed by scripts/install-git-hooks.sh.
set -e
npm run check
```

### `scripts/install-git-hooks.sh`
```bash
#!/bin/bash
set -e
chmod +x scripts/hooks/* scripts/*.sh
git config core.hooksPath scripts/hooks
echo "Git hooks installed (core.hooksPath=scripts/hooks)."
```

### `.claude/settings.json`
```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npm ci)",
      "Bash(npm ls *)",
      "Bash(node scripts/*)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)",
      "Read(./*.pem)",
      "Edit(./.github/**)",
      "Edit(./scripts/hooks/**)",
      "Edit(./.claude/settings.json)",
      "Edit(./package-lock.json)",
      "Edit(./.nvmrc)",
      "Bash(git commit)",
      "Bash(git commit *)",
      "Bash(git * commit)",
      "Bash(git * commit *)",
      "Bash(git push)",
      "Bash(git push *)",
      "Bash(git * push)",
      "Bash(git * push *)",
      "Bash(git reset --hard *)",
      "Bash(git stash *)",
      "Bash(git clean *)",
      "Bash(git rebase *)",
      "Bash(git restore *)",
      "Bash(git checkout -- *)",
      "Bash(git branch -D *)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/scripts/hooks/guard-bash.sh" }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/scripts/hooks/stop-gate.sh", "timeout": 300 }] }
    ]
  }
}
```

### `.github/workflows/ci.yml`
```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  # One required check. Branch protection requires exactly this job name: "gate".
  gate:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci --ignore-scripts
      - run: npm run typecheck
      - run: npm run content:check
      # next/font downloads Google Fonts at build time; one retry absorbs a network blip.
      - run: npm run build || (sleep 20 && npm run build)
      - run: npm run smoke
```

### `.github/dependabot.yml`
```yaml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule: { interval: weekly, day: monday }
    open-pull-requests-limit: 5
    groups:
      minor-and-patch:
        update-types: [minor, patch]
    ignore:
      # Majors are a human decision (read the migration guide, test the preview).
      - dependency-name: next
        update-types: [version-update:semver-major]
      - dependency-name: react
        update-types: [version-update:semver-major]
      - dependency-name: react-dom
        update-types: [version-update:semver-major]
  - package-ecosystem: github-actions
    directory: /
    schedule: { interval: weekly, day: monday }
```

### `.github/pull_request_template.md`
```markdown
## What changed
<!-- One line, plain language. Example: "Added the Fiji project to Past Projects." -->

## Before merging
- [ ] The **gate** check is green (if red, click Details and read the message; it says what to fix)
- [ ] I opened the **Preview** link and looked at the page I changed
- [ ] If I added photos/videos: they show up in the preview
```


### `AGENTS.md` (append below the existing Next.js block)
```markdown
## Project rules (lite kit)

- Stack: Next.js 16 (App Router), React 19, Tailwind 4, TypeScript, npm. Hosting: <TAILOR>.
- Site content lives in `data/*.ts` and `public/`. Change data, not components, for copy, photos, projects, links.
- Commands: `npm run check:fast` (typecheck + content check) while working; `npm run check` (adds build + smoke test) before reporting done.
- Do not commit or push. Do not add, upgrade or remove packages. Do not edit `.github/`, `scripts/hooks/`, `.claude/settings.json`, `package-lock.json`, `.nvmrc`. Ask the project manager.
- Do not edit or delete an existing check to make it pass. If a check is wrong, stop and report why.
- Third parties (email, fonts, analytics) must fail soft: save the user's data first, notify second, never let a missing key or outage break a page or lose a submission.
- Files in `public/` are referenced with exact-case paths. Photos `.jpg` < 2 MB, videos `.mp4` (H.264) < 8 MB.
- Before editing Next.js code, read the matching guide in `node_modules/next/dist/docs/` (see the block above).
- Report: files changed, and the last lines of `npm run check`.
```

### `docs/EDITING.md`
For the founders. Change the file table if `data/` changes.

```markdown
# Editing the website (no coding needed)

The site's words, photos and project list all live in a few small files. You change a file, GitHub checks your change for mistakes, you look at a preview, and only then does it go live. A mistake can't reach the live site because the check blocks it.

## What to edit

| I want to… | Edit this file | What to change |
|---|---|---|
| Announce the next project | `data/currentProject.ts` | Fill in `name`, `location`, `need`, `who`, `when`, then change `active: false` to `active: true` |
| Add a finished project | `data/pastProjects.ts` | Copy the whole `{ ... }` block for Guam, paste it below with a comma, change every value |
| Change a founder's name/photo | `data/founders.ts` | Edit the text or photo path |
| Swap a video or the About photo | `data/media.ts` | Change the path (upload the file first, see below) |
| Change Instagram/Facebook/YouTube links | `data/socials.ts` | Edit `url` and `handle` |
| Change wording on a page | `app/<page>/page.tsx` | Edit the text between the tags; leave everything with `<` `>` and `{ }` alone |

## How to publish a change (from the GitHub website)

1. Open the file on GitHub and click the **pencil** icon.
2. Make your edit.
3. Click **Commit changes…**, choose **Create a new branch and start a pull request**, then **Propose changes** and **Create pull request**.
4. Wait about two minutes for the checks. A green **gate** check means no mistakes were found. If it is red, click **Details**: the message names the file and what to fix. Edit the same file again on the same branch.
5. Open the **Preview** link in the pull request (posted by the hosting service) and look at your change on a phone-sized window too.
6. Click **Merge pull request**. The live site updates in a couple of minutes.

## Adding photos and videos

- Upload through **Add file → Upload files** into the right folder under `public/` (for example `public/images/pastProjects/Fiji/`), in the same pull request.
- Photos: `.jpg`, under 2 MB (resize first). Videos: `.mp4` (H.264), under 8 MB. Phone `.MOV` files do not play in most browsers.
- Spell the file name exactly, including capital letters. `IMG_1.JPG` and `img_1.jpg` are different files on the live site, even though your computer treats them as the same. The check catches this.

## If something looks wrong on the live site

See `docs/RUNBOOK.md`. The short version: don't edit more. Roll back to the last good version first, fix after.
```

### `docs/RUNBOOK.md`
Fill the `<TAILOR>` markers once hosting is confirmed.

```markdown
# If the site is down or wrong

Goal: get back to the last good version in under 5 minutes. Fix the cause afterwards.

1. **Is it really down?** Open `https://<TAILOR: production domain>/api/health`. It should show `{"ok":true,...}`. If this loads but a page looks wrong, it's a content or code problem (step 3). If it doesn't load, check the host's status page and the domain/DNS (step 4).
2. **Did we just publish something?** If yes, go to step 3.
3. **Roll back.** <TAILOR: hosting> Vercel: dashboard → project → Deployments → pick the last deployment that was healthy → **⋯ → Instant Rollback**. (Rollback pauses automatic deploys until you promote a new one; that is intended.) Then, on GitHub, open the bad pull request and click **Revert** so `main` matches what is live.
4. **Not a deploy problem?** Check that the domain hasn't expired and the DNS records still point at the host.
5. **Forms (notes, contact, recommend a place) failing?** The site keeps working; submissions are the thing to protect. Check the email service dashboard (Resend) for the API key and the sending domain, and the contact inbox's spam folder. <TAILOR: describe where saved submissions can be found once that is verified>
6. **Write down what happened** in one line in the pull request or `docs/` so the same mistake gets a new check.
```


## 5. Human steps (paste in the repo root after the kit is reviewed and merged)

```bash
# 1. Local setup: install deps and the pre-push hook
npm ci && bash scripts/install-git-hooks.sh

# 2. Remove the two stray empty files (finding 6)
git rm -f next "gathering-is-real-temp@0.1.0"

# 3. Protect main: PR required (0 approvals so two founders aren't blocked), `gate` must pass, no force-push.
#    Run AFTER the first CI run so the `gate` check exists. enforce_admins=false leaves you an emergency bypass.
gh api -X PUT repos/cadenannison/gathering-is-real-website/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": { "strict": false, "contexts": ["gate"] },
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

# 4. Secret scanning + push protection (public repo), Dependabot alerts and security updates
gh api -X PATCH repos/cadenannison/gathering-is-real-website --input - <<'JSON'
{ "security_and_analysis": { "secret_scanning": { "status": "enabled" }, "secret_scanning_push_protection": { "status": "enabled" } } }
JSON
gh api -X PUT repos/cadenannison/gathering-is-real-website/vulnerability-alerts
gh api -X PUT repos/cadenannison/gathering-is-real-website/automated-security-fixes
```

Dashboard steps (not scriptable):

- [ ] Hosting: production branch is `main`; every pull request gets a Preview deployment.
- [ ] Hosting env vars `RESEND_API_KEY`, `CONTACT_EMAIL`, `RETRY_ADMIN_TOKEN` are set for Production (decide deliberately whether Preview gets them; see finding 1).
- [ ] Uptime monitor (UptimeRobot or Better Stack free tier) on `https://<domain>/api/health`, 5-minute interval, alerts to both founders' emails.
- [ ] Domain auto-renew is on, and renewal reminders go to a shared inbox.
- [ ] Try the rollback once on a quiet day so it isn't the first time during an outage.

## 6. Claude's verification and report

Run each and include the result in the report:

| Check | Expected |
|---|---|
| `npm ci --ignore-scripts && npm run check` | exit 0 (needs network for Google Fonts) |
| Temporarily set a past project's `slug` to `"Guam Trip"`, run `npm run content:check`, then revert | exit 1, message names `data/pastProjects.ts` |
| Rename one photo path's case in `data/pastProjects.ts`, run the check, revert | exit 1, "file not found ... upper/lower case" |
| Pipe sample commands into `scripts/hooks/guard-bash.sh` (`{"tool_input":{"command":"..."}}`): `git commit`, `git push`, `sh -c 'git push'`, `npm i x`, `npx x` | exit 2 |
| Same for `git status`, `git diff`, `npm ci`, `npm run check` | exit 0 |
| `git status` after verification | only kit files changed; no leftover test edits |

Report: files added or changed, any TAILOR markers still open, anything that failed and why, and the last lines of `npm run check`. Then stop; the human commits.

## 7. Later, if it earns its place

- Fix findings 1 to 3 as their own reviewed tasks.
- A browser-based editor (Decap CMS or TinaCMS) if the founders outgrow editing files on GitHub. Needs a dependency and an auth setup, so it is a project, not a patch.
- ESLint (`eslint-config-next`) once a human approves the dependency.
- Self-host fonts with `next/font/local` to remove the build-time Google dependency.
