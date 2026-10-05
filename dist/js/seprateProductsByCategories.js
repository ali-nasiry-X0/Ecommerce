import { getCategories } from "./getCategories.js";
import { listProducts } from "./products.js";
let listProductByCategory = {};
export async function listPcategories() {
  const allCategories = await getCategories();

  allCategories.forEach((category) => {
    listProductByCategory[category.slug] = [];
  });

  listProducts.forEach((product) => {
    listProductByCategory[product.category].push(product);
  });
  return listProductByCategory;
}
