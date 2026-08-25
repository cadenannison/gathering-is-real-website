/**
 * Central place for video files. Drop the file into /public/videos/ and set the
 * path here — every surface that shows a video reads from this file, so nothing
 * else needs to change.
 *
 * Leave a value as `null` and the site renders a branded placeholder instead.
 * Use .mp4 (H.264); .MOV files from a phone will not play in most browsers.
 */
export const media = {
  /** "How can you help now?" cards — plays on hover. */
  help: {
    note: "/videos/note-taking.mp4" as string | null,
    currentProject: "/videos/learnAboutCurrentProject.mp4" as string | null,
    donate: "/videos/packingBox.mp4" as string | null,
  },
};

/**
 * Standalone photos. Same idea as `media` — drop the file in /public/images/
 * and set the path. `null` renders a placeholder.
 */
export const images = {
  /** About → Our Story, the portrait beside the story copy. */
  aboutStory: "/images/founders/founders-together.jpg" as string | null,
};
