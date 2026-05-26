// src/sanityClient.js
import { createClient } from "@sanity/client";
// Ganti import lama dengan yang baru ini:
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "xisin4yd",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-04-02",
  token: "skGWgmtKjFkUNE91ql586q0P9mxzkx4bM0fsscjaWq1ClG5bujpzVWHbgIbrbX7EeJ7bwDebrQXJ5XHsI7XJCWyxgKaMQn7pCRZNao3jSSxqHOPoqPsA5qhL549eSJOCwZs2wl5Oi4cLaSYEE4WWfNGpHA57jDd9iHYBDrxlvfzxki84fW17",
});

// Tetap sama
const builder = imageUrlBuilder(client);
export const urlFor = (source) => {
  if (!source) return { url: () => "" };
  return builder.image(source);
};