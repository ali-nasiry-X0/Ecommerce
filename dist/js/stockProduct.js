export function stock(product) {
  let sumStock = 0;
  product.variants.forEach((variant) => {
    const stock = variant.stock;
    sumStock += stock;
  });
  return sumStock;
}
