import { listProducts } from "./products.js";

export async function listPfeatured() {
  let listProductsFeatured = [];
  listProducts.forEach((product) => {
    if (product.isFeatured) {
      listProductsFeatured.push(product);
    }
  });
  return listProductsFeatured;
}
