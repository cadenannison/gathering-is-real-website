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
let stopping = false;
if (!external) {
  server = spawn(path.join(root, "node_modules/.bin/next"), ["start", "-p", PORT, "-H", "127.0.0.1"], { cwd: root, stdio: "ignore" });
  server.on("exit", (code) => { if (code && !stopping) { console.error(`smoke: next start exited with ${code} (did you run npm run build?)`); process.exit(1); } });
}
const stop = () => { stopping = true; server?.kill(); };
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
