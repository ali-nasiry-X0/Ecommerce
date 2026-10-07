export function sortProductRank(listProducts) {
  let productSortRating = [];
  let ratsProduct = [];
  listProducts.forEach((product) => {
    ratsProduct.push(product.rating);
  });
  ratsProduct.sort(function (a, b) {
    return b - a;
  });
  let s = new Set(ratsProduct);
  ratsProduct = [...s];
  ratsProduct.forEach((rate) => {
    listProducts.forEach((product) => {
      if (rate === product.rating) {
        productSortRating.push(product);
        return;
      }
    });
  });
  return productSortRating;
}
export function sortProductDate(listProducts) {
  let latest_products = listProducts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  return latest_products;
}
