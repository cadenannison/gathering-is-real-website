export interface PastProject {
  slug: string;
  /** Shown on the map pin and as the page title. */
  location: string;
  /** [longitude, latitude] of the city the project took place in. */
  coordinates: [number, number];
  amountRaised: number;
  /** Who the project reached, e.g. "Guam Memorial Hospital". */
  impacted: string;
  /** What was done and when. */
  description: string;
  /** Files in /public/images/pastProjects/. */
  photos: string[];
  /** File in /public/videos/. */
  video?: string | null;
}

export const pastProjects: PastProject[] = [
  {
    slug: "guam",
    location: "Guam",
    coordinates: [144.7937, 13.4443],
    amountRaised: 302,
    impacted: "Guam Memorial Hospital",
    description:
      "Towels and Linens were donated to help aid the sick during a major typhoon held back in April of 2026.",
    photos: [
      "/images/pastProjects/Guam/IMG_2374.jpg",
      "/images/pastProjects/Guam/IMG_2377.jpg",
      "/images/pastProjects/Guam/IMG_2375.jpg",
      "/images/pastProjects/Guam/IMG_2380.jpg",
      "/images/pastProjects/Guam/IMG_2383.jpg",
      "/images/pastProjects/Guam/IMG_2385.jpg",
      "/images/pastProjects/Guam/IMG_2384.jpg",
      "/images/pastProjects/Guam/IMG_2387.jpg",
      "/images/pastProjects/Guam/IMG_2388.jpg",
      "/images/pastProjects/Guam/IMG_2389.jpg",
      "/images/pastProjects/Guam/IMG_2391.jpg",
      "/images/pastProjects/Guam/IMG_2392.jpg",
      "/images/pastProjects/Guam/IMG_2393.jpg",
      "/images/pastProjects/Guam/IMG_2395.jpg",
      "/images/pastProjects/Guam/IMG_1368.jpg",
    ],
    video: "/videos/guam.mp4",
  },
];
