const body = document.querySelector("body");
async function getProducts() {
  const response = await fetch("http://127.0.0.1:3000");
  const data = await response.json();
  return data;
}
