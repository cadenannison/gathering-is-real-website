export interface CurrentProject {
  /**
   * Flip to `true` once there is a project to announce. `false` shows the
   * "Coming Soon" state; `true` shows the full project-details layout.
   */
  active: boolean;
  name: string;
  /** Where the project is running — also fills the "To:" line on notes. */
  location: string;
  /**
   * Image of the place: flag, map, or photo. Square crops look best.
   * e.g. "/images/currentProject/guam.png"
   */
  image: string | null;
  /** The three details shown beside the image. */
  need: string;
  who: string;
  when: string;
}

export const currentProject: CurrentProject = {
  active: false,
  name: "Our Current Project",
  location: "To be announced",
  image: "/images/currentProject/globe.png",
  need: "",
  who: "",
  when: "",
};
