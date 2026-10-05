import { listProducts } from "./products.js";
import { sortProductRank } from "./sortProduts.js";
import { listPcategories } from "./seprateProductsByCategories.js";

function bestSelling() {
  const bestProducts = sortProductRank(listProducts).slice(0, 4);

  const containersProductBestSelling = document.querySelectorAll(
    ".bestSelling__product",
  );

  containersProductBestSelling.forEach((productElement, index) => {
    const product = bestProducts[index];
    const img = productElement.querySelector("img");
    const productName = productElement.querySelector(".product__name");
    const productStatus = productElement.querySelector(".product__status");
    const productPrice = productElement.querySelector(".product__price");

    productName.textContent = product.title;
    img.src = product.image;
    productElement.id = product.id;
    if (!product.stock == 0) {
      productStatus.textContent = "IN STOCK";
    } else {
      productStatus.textContent = " SOLD OUT";
    }
    productPrice.textContent = `${product.price} $`;
  });
}

async function ctaImg() {
  const cta_img = document.querySelector(".cta__img");
  const img = cta_img.querySelector("img");
  const productHat = await listPcategories();
  const bestHat = sortProductRank(productHat.hat)[0];
  img.src = bestHat.image;
}

bestSelling();
ctaImg();
