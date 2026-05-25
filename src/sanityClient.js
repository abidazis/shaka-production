// src/sanityClient.js
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "xisin4yd",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-04-02",
  token: "skRxFxB9AaFcBcZl7uNAeGK6JujbXNfNLuu4lNCR5dx7TEDRCmSjcFwxsbGrekLXpQhBJZtVmURFj0e442am4xI0mJCBVC2BZGr365bAGrRb5ofSEucxcEPGtB6fiS03gSzVdtKRnGSFkeAsCxn1dwg0LzIqAzanBQ2jnVTuH8ajkqpyZYXQ",
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => {
  if (!source) return { url: () => "" };
  return builder.image(source);
};