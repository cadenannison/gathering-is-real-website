import { instagram } from "@/data/instagram";

const OEMBED = "https://graph.facebook.com/v27.0/instagram_oembed";
const TIMEOUT_MS = 5000;

/**
 * Fetches embed HTML for each configured post on the server. Fail-soft: any post that
 * errors, times out or returns something unexpected is skipped. Never throws.
 * Cached for an hour so Instagram is not contacted per visit.
 */
export async function getEmbeds(): Promise<{ url: string; html: string }[]> {
  const results = await Promise.all(
    instagram.posts.map(async (url) => {
      try {
        const res = await fetch(`${OEMBED}?${new URLSearchParams({ url, omitscript: "true" })}`, {
          signal: AbortSignal.timeout(TIMEOUT_MS),
          next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const data: unknown = await res.json();
        const html = (data as { html?: unknown })?.html;
        if (typeof html !== "string" || !html.includes("instagram-media")) return null;
        return { url, html };
      } catch {
        return null;
      }
    }),
  );
  return results.filter((r): r is { url: string; html: string } => r !== null);
}
