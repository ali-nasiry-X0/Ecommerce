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
