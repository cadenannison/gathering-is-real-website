// Uptime check. Must stay dependency-free: no email, no filesystem, no external calls.
// A monitor hitting this should fail only when the site itself is down.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { ok: true, commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? "dev").slice(0, 7) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
