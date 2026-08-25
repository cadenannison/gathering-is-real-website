"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WorldMap, {
  STAR_PATH,
  type MapStar,
} from "@/components/sections/WorldMap";
import RecommendPlaceForm from "@/components/sections/RecommendPlaceForm";
import type { PastProject } from "@/data/pastProjects";

interface RecommendPlaceSectionProps {
  /** Past projects are marked with a star and link through to their page. */
  pastProjects?: PastProject[];
}

export default function RecommendPlaceSection({
  pastProjects = [],
}: RecommendPlaceSectionProps) {
  const router = useRouter();
  const [place, setPlace] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const stars: MapStar[] = pastProjects.map((project) => ({
    id: project.slug,
    coordinates: project.coordinates,
    label: project.location,
  }));

  function openWithCountry(countryName: string) {
    setPlace(countryName);
    setFormOpen(true);
  }

  function openBlank() {
    setPlace("");
    setFormOpen(true);
  }

  return (
    <>
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <button
          type="button"
          onClick={openBlank}
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-sans text-sm font-medium text-cream transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Recommend a place
        </button>
        <p className="font-sans text-sm text-muted">
          Or click any country on the map and we&apos;ll fill it in for you.
        </p>
      </div>

      <WorldMap
        stars={stars}
        onCountrySelect={openWithCountry}
        onStarSelect={(star) => router.push(`/past-projects/${star.id}`)}
      />

      {stars.length > 0 && (
        <p className="mt-4 flex items-center justify-center gap-2 font-sans text-sm text-muted">
          <svg width="13" height="13" viewBox="-6.5 -6.5 13 13" aria-hidden>
            <path
              d={STAR_PATH}
              fill="var(--map-star)"
              stroke="var(--map-star-line)"
              strokeWidth={0.9}
              strokeLinejoin="round"
            />
          </svg>
          A star marks a place we&apos;ve already served.
        </p>
      )}

      <RecommendPlaceForm
        open={formOpen}
        initialPlace={place}
        onClose={() => setFormOpen(false)}
      />
    </>
  );
}
