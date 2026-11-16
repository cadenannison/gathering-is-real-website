import { VENMO_URL } from "./links.ts";

/**
 * Events and news shown on the home page and at the top of /current-project.
 *
 * - An event stays up until `endsAt`; news stays up until `expiresAt`.
 *   With neither date, it stays until you remove it.
 * - Dates need a time zone offset, e.g. "2026-11-19T21:00:00-07:00".
 * - Expired items disappear on their own, no redeploy needed.
 * - `image` is optional: a .jpg under public/images/announcements/, e.g.
 *   "/images/announcements/silent-disco.jpg".
 */
export interface Announcement {
  id: string;
  kind: "event" | "news";
  title: string;
  body?: string;
  startsAt?: string;
  endsAt?: string;
  expiresAt?: string;
  link?: { label: string; href: string };
  details?: string[];
  image?: string;
}

export const announcements: Announcement[] = [
  {
    id: "silent-disco-2026-11",
    kind: "event",
    title: "Silent Disco Fundraiser",
    body: "Nifty Sixty x Gathering Is Real. All proceeds help deaf students in Puerto Rico.",
    startsAt: "2026-11-19T21:00:00-07:00",
    endsAt: "2026-11-19T23:00:00-07:00",
    details: [
      "Thursday, Nov 19, 9-11 PM",
      "The Beehive, 1595 N Freedom Blvd, Provo, UT 84604",
      "$6 at the door, cash or Venmo",
      "First 50 people get a free Bundt cake (Runty Bundts)",
    ],
    link: { label: "Pay with Venmo", href: VENMO_URL },
  },
];
