import { getCategories } from "./getCategories.js";
import { listProducts } from "./products.js";
let listProductByCategory = {};
async function categories() {
  const allCategories = await getCategories();

  allCategories.forEach((category) => {
    listProductByCategory[category.slug] = [];
  });

  listProducts.forEach((product) => {
    console.log(product.category);
    listProductByCategory[product.category].push(product);
  });
}
categories();
