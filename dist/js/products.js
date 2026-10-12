import { getProducts } from "./getProducts.js";
export const listProducts = await getProducts();
export const productsById = new Map(
  listProducts.map((product) => [product.id, product]),
);
