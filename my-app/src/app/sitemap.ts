import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://yourdomain.com",
      lastModified: new Date(),
    },
    {
      url: "https://yourdomain.com/login",
      lastModified: new Date(),
    },
    {
      url: "https://yourdomain.com/register",
      lastModified: new Date(),
    },
  ]
}