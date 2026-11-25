import { productsById } from "./products.js";

export function redirectToProductDetail() {
  let domProducts = document.querySelectorAll(".product");
  domProducts.forEach((domProduct) => {
    domProduct.addEventListener("click", () => {
      const baseUrl = "product.html";
      window.location.href = `${baseUrl}?category=${productsById.get(Number(domProduct.id)).category}&product=${productsById.get(Number(domProduct.id)).title}&id=${productsById.get(Number(domProduct.id)).id}`;
    });
  });
}
