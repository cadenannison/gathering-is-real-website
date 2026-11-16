/**
 * Flyers and posters shown at the top of /trending until they expire.
 * After `expiresAt` an item moves, on its own, to the sideways-scrolling "Past events"
 * archive at the bottom of the page (the page refreshes hourly, so allow up to an hour).
 *
 * To add one: upload a .jpg (under 2 MB) to public/images/, then copy a block below.
 * `expiresAt` needs a time zone offset, e.g. "2026-11-20T12:00:00-07:00" (Utah, winter).
 */
export interface TrendingItem {
  id: string;
  title: string;
  /** Short description of the flyer for screen readers. */
  alt: string;
  /** .jpg under public/images/, e.g. "/images/silent-disco-fundraiser.jpg". */
  image: string;
  expiresAt: string;
  link?: { label: string; href: string };
}

export const trendingItems: TrendingItem[] = [
  {
    id: "silent-disco-2026-11",
    title: "Silent Disco Fundraiser",
    alt: "Flyer: Nifty Sixty x Gathering Is Real Silent Disco Fundraiser, Thursday Nov 19, 9 to 11 PM at The Beehive in Provo. $6 at the door, cash or Venmo.",
    image: "/images/silent-disco-fundraiser.jpg",
    expiresAt: "2026-11-20T12:00:00-07:00", // Friday midday
  },
];
