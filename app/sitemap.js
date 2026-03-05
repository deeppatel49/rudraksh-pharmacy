export default function sitemap() {
  const baseUrl = "https://rudrakshapharmacy.com";
  const routes = ["", "/about", "/products", "/contact", "/login"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
