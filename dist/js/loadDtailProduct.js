import { getCategories } from "./getCategories.js";
import { productsById } from "./products.js";

const params = new URLSearchParams(window.location.search);
const product = productsById.get(Number(params.get("id")));

const purchaseContainer = document.querySelector(".product-detail__purchase");

function loadDetail(product) {
  const nameProduct = purchaseContainer.querySelector(
    ".product-detail__nameProduct",
  );
  const rankP = purchaseContainer.querySelector(
    ".product-detail__rank__content",
  );
  const statusP = purchaseContainer.querySelector(".product-detail__status");
  const costP = purchaseContainer.querySelector(".product-detail__price");
  nameProduct.textContent = product.title;
  rankP.innerHTML = `${product.rating}&#8212;${product.review} Reviews`;
  if (product.stock > 0) {
    statusP.textContent = "IN STOCK";
  } else {
    statusP.textContent = "Sold Out";
  }
  costP.textContent = `$ ${product.price}`;
}

loadDetail(product);
