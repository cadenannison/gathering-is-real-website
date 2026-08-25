export interface Founder {
  id: string;
  name: string;
  role: string;
  /** Add a file to /public/images/founders/ and point here. */
  photo?: string;
}

export const founders: Founder[] = [
  {
    id: "brooklyn-daly",
    name: "Brooklyn Daly",
    role: "Director",
    photo: "/images/founders/brooklyn.jpg",
  },
  {
    id: "maddisyn-jolley",
    name: "Maddisyn Jolley",
    role: "Director",
    photo: "/images/founders/maddie.jpg",
  },
];
