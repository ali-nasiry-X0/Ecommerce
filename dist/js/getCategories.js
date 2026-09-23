export async function getCategories() {
  const res = await fetch("http://localhost:3000/categories");
  const categories = await res.json();
  return categories;
}
