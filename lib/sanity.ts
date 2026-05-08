import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export async function getPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, excerpt, publishedAt, category
    }
  `);
}

export async function getPost(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] { _id, title, body, publishedAt, category }`,
    { slug }
  );
}

export async function getPrograms() {
  return client.fetch(`
    *[_type == "program"] | order(_createdAt asc) {
      _id, title, description, icon, commitment, category
    }
  `);
}

export async function getEvents() {
  return client.fetch(`
    *[_type == "event"] | order(date asc) {
      _id, title, slug, date, time, location, description, category
    }
  `);
}

export async function getTeam() {
  return client.fetch(`
    *[_type == "teamMember"] | order(_createdAt asc) {
      _id, name, role, bio, photo
    }
  `);
}
