"use client";

import { useRouter } from "next/navigation";
import WorldMap, { type MapStar } from "@/components/sections/WorldMap";
import type { PastProject } from "@/data/pastProjects";

interface PastProjectsMapProps {
  projects: PastProject[];
}

export default function PastProjectsMap({ projects }: PastProjectsMapProps) {
  const router = useRouter();

  const stars: MapStar[] = projects.map((project) => ({
    id: project.slug,
    coordinates: project.coordinates,
    label: project.location,
  }));

  return (
    <WorldMap
      stars={stars}
      onStarSelect={(star) => router.push(`/past-projects/${star.id}`)}
    />
  );
}
