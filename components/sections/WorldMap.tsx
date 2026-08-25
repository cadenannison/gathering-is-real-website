"use client";

import { useRef, useState } from "react";
import { clsx } from "clsx";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const GEO_URL = "/data/world-110m.json";

const MAP_WIDTH = 880;
const MAP_HEIGHT = 420;

/** Zoom is clamped equally hard in both directions — 1 is the full world. */
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const ZOOM_STEP = 1.6;

const DEFAULT_CENTER: [number, number] = [0, 12];

/**
 * Five-pointed star, outer radius 5.5 / inner 2.1, centred on the origin.
 * Kept small so it still fits over a tiny island without swallowing it.
 * Exported so the map legend draws the exact same mark.
 */
export const STAR_PATH =
  "M 0 -5.5 L 1.24 -1.7 L 5.23 -1.7 L 2 0.65 L 3.23 4.45 L 0 2.1 L -3.23 4.45 L -2 0.65 L -5.23 -1.7 L -1.24 -1.7 Z";

export interface MapStar {
  id: string;
  /** [longitude, latitude] */
  coordinates: [number, number];
  label: string;
}

interface WorldMapProps {
  stars?: MapStar[];
  /** Fires with the country name when a landmass is clicked. */
  onCountrySelect?: (countryName: string) => void;
  onStarSelect?: (star: MapStar) => void;
  className?: string;
}

interface Hovered {
  label: string;
  x: number;
  y: number;
  isStar: boolean;
}

/** Wheel events are left alone so the map never hijacks page scrolling. */
const allowNonWheelZoom = ((event: Event) =>
  event.type !== "wheel") as unknown as (element: SVGElement) => boolean;

export default function WorldMap({
  stars = [],
  onCountrySelect,
  onStarSelect,
  className,
}: WorldMapProps) {
  const [hovered, setHovered] = useState<Hovered | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);

  /** Pointer position at press, used to tell a click apart from a drag. */
  const pressedAt = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  const atDefault =
    Math.abs(zoom - MIN_ZOOM) < 0.001 &&
    Math.abs(center[0] - DEFAULT_CENTER[0]) < 0.001 &&
    Math.abs(center[1] - DEFAULT_CENTER[1]) < 0.001;

  function relativePosition(e: React.MouseEvent, currentIsStar: boolean) {
    const box = e.currentTarget
      .closest("[data-map-root]")
      ?.getBoundingClientRect();
    if (!box) return null;
    return {
      x: e.clientX - box.left,
      y: e.clientY - box.top,
      isStar: currentIsStar,
    };
  }

  function handlePointerDown(e: React.PointerEvent) {
    pressedAt.current = { x: e.clientX, y: e.clientY };
    dragged.current = false;
  }

  function handlePointerUp(e: React.PointerEvent) {
    const start = pressedAt.current;
    if (!start) return;
    const distance = Math.hypot(e.clientX - start.x, e.clientY - start.y);
    dragged.current = distance > 6;
    pressedAt.current = null;
  }

  function stepZoom(direction: 1 | -1) {
    setZoom((current) => {
      const next =
        direction === 1 ? current * ZOOM_STEP : current / ZOOM_STEP;
      return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    });
  }

  function resetView() {
    setZoom(MIN_ZOOM);
    setCenter(DEFAULT_CENTER);
  }

  const controlClass =
    "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/95 text-heading shadow-sm backdrop-blur transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface/95";

  return (
    <div
      data-map-root
      className={clsx(
        "relative w-full overflow-hidden rounded-3xl border border-border",
        "aspect-[3/2] sm:aspect-[2/1] lg:aspect-[22/10]",
        className
      )}
      style={{ background: "var(--map-ocean)" }}
      onMouseLeave={() => setHovered(null)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 160 }}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          translateExtent={[
            [0, 0],
            [MAP_WIDTH, MAP_HEIGHT],
          ]}
          filterZoomEvent={allowNonWheelZoom}
          // Track zoom live so pinch-zoom keeps the stars counter-scaled.
          // Panning leaves zoom untouched, so this is a no-op mid-drag.
          onMove={({ zoom: nextZoom }) =>
            setZoom((prev) =>
              Math.abs(prev - nextZoom) > 0.001 ? nextZoom : prev
            )
          }
          onMoveEnd={({ coordinates, zoom: nextZoom }) => {
            setCenter(coordinates);
            setZoom(nextZoom);
          }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties?.name as string | undefined;
                const interactive = Boolean(onCountrySelect && name);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={-1}
                    onMouseEnter={(e: React.MouseEvent) => {
                      if (!name) return;
                      const pos = relativePosition(e, false);
                      if (pos) setHovered({ label: name, ...pos });
                    }}
                    onMouseMove={(e: React.MouseEvent) => {
                      if (!name) return;
                      const pos = relativePosition(e, false);
                      // Never let a country tooltip replace a star tooltip.
                      setHovered((prev) =>
                        prev?.isStar || !pos ? prev : { label: name, ...pos }
                      );
                    }}
                    onClick={() => {
                      if (dragged.current) return;
                      if (name && onCountrySelect) onCountrySelect(name);
                    }}
                    style={{
                      default: {
                        fill: "var(--map-land)",
                        stroke: "var(--map-line)",
                        strokeWidth: 0.5 / zoom,
                        outline: "none",
                        cursor: interactive ? "pointer" : "default",
                        transition: "fill 160ms ease",
                      },
                      hover: {
                        fill: interactive
                          ? "var(--map-land-hover)"
                          : "var(--map-land)",
                        stroke: interactive
                          ? "var(--map-line-hover)"
                          : "var(--map-line)",
                        strokeWidth: (interactive ? 0.75 : 0.5) / zoom,
                        outline: "none",
                        cursor: interactive ? "pointer" : "default",
                      },
                      pressed: {
                        fill: "var(--map-land-hover)",
                        stroke: "var(--map-line-hover)",
                        strokeWidth: 0.75 / zoom,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {stars.map((star) => (
            <Marker key={star.id} coordinates={star.coordinates}>
              {/* Counter-scaled so the star keeps a constant size on screen */}
              <g
                transform={`scale(${1 / zoom})`}
                role={onStarSelect ? "button" : undefined}
                aria-label={
                  onStarSelect ? `${star.label} — view project` : undefined
                }
                className={onStarSelect ? "cursor-pointer" : undefined}
                onMouseEnter={(e: React.MouseEvent) => {
                  const pos = relativePosition(e, true);
                  if (pos) setHovered({ label: star.label, ...pos });
                }}
                onMouseLeave={() => setHovered(null)}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (dragged.current) return;
                  onStarSelect?.(star);
                }}
              >
                {/* Halo — reads as light landing on the place */}
                <circle r={9} fill="var(--map-star)" opacity={0.16} />
                {/* Invisible, comfortably sized hit area for hover/click */}
                <circle r={11} fill="transparent" />
                <path
                  d={STAR_PATH}
                  fill="var(--map-star)"
                  stroke="var(--map-star-line)"
                  strokeWidth={0.9}
                  strokeLinejoin="round"
                />
              </g>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom controls */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => stepZoom(1)}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
          className={controlClass}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M7 1.5v11M1.5 7h11"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => stepZoom(-1)}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
          className={controlClass}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path
              d="M1.5 7h11"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={resetView}
          disabled={atDefault}
          aria-label="Reset the map view"
          className={controlClass}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M13 8a5 5 0 1 1-1.6-3.66"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M13.2 2v3h-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {hovered && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-full border border-border bg-surface px-3.5 py-1.5 font-sans text-xs font-medium text-heading shadow-md"
          style={{ left: hovered.x, top: hovered.y }}
        >
          {hovered.label}
          {hovered.isStar && (
            <span className="ml-1.5 text-secondary">View project →</span>
          )}
        </div>
      )}
    </div>
  );
}
