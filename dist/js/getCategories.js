const API_URL = `http://${window.location.hostname}:3000`;
export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);

  const categories = await res.json();
  return categories;
}
