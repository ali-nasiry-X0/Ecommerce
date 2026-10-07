import { listProducts } from "./products.js";

export async function listPfeatured() {
  let listProductsFeatured = listProducts.filter(
    (product) => product.isFeatured,
  );
  return listProductsFeatured;
}
