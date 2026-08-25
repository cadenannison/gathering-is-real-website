export type SocialPlatform = "instagram" | "facebook" | "youtube";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  handle: string;
  url: string;
  /** QR image in /public/images/qr/, generated from `url`. */
  qr: string;
}

export const socials: SocialLink[] = [
  {
    platform: "instagram",
    label: "Instagram",
    handle: "@gathering.is.real",
    url: "https://www.instagram.com/gathering.is.real?igsi=MW94YTR2MDhlMHBvdA%3D%3D&utm_source=qr",
    qr: "/images/qr/instagram.svg",
  },
  {
    platform: "facebook",
    label: "Facebook",
    handle: "Gathering Is Real",
    url: "https://www.facebook.com/share/1C3JTEJrcz/?mibextid=wwXIfr",
    qr: "/images/qr/facebook.svg",
  },
  {
    platform: "youtube",
    label: "YouTube",
    handle: "@gatheringisreal",
    url: "https://www.youtube.com/@Gatheringisreal",
    qr: "/images/qr/youtube.svg",
  },
];
