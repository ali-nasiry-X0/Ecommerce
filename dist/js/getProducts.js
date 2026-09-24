const API_URL = `http://${window.location.hostname}:3000`;
export async function getProducts() {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
}
