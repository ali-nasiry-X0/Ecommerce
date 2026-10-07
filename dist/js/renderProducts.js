import { listProducts } from "./products.js";
import { sortProductRank } from "./sortProduts.js";
import { listPcategories } from "./seprateProductsByCategories.js";
import { listPfeatured } from "./featuredProducts.js";

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

const featuredOptionsContainer = document.querySelector(".featured__options");
const featuredOptions =
  featuredOptionsContainer.querySelectorAll(".featured__option");
const btnFeature = featuredOptionsContainer.querySelector(".product-featured");
const btnLatest = featuredOptionsContainer.querySelector(".product-latest");

async function featuredProducts() {
  const contianerProductsFeatured =
    document.querySelectorAll(".featured__product");

  const allProductsFeature = await listPfeatured();

  let indexFeatureProducts = [];

  let featured_products = [];

  for (let i = 0; indexFeatureProducts.length < 4; i++) {
    let index = Math.floor(
      Math.random() / (allProductsFeature.length / 200 + 0.2),
    );
    if (!indexFeatureProducts.includes(index)) {
      indexFeatureProducts.push(index);
    }
  }

  if (btnFeature.classList.contains("active")) {
    indexFeatureProducts.forEach((index) => {
      featured_products.push(allProductsFeature[index]);
    });
    renderFP(featured_products);
  }

  if (btnLatest.classList.contains("active")) {
    let latest_products = sortProductRank(listProducts);
    renderFP(latest_products);
  }

  function renderFP(listProducts) {
    contianerProductsFeatured.forEach((productElement, index) => {
      console.log(listProducts[index]);

      const product = listProducts[index];
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
}
btnFeature.addEventListener("click", () => {
  if (!btnFeature.classList.contains("active")) {
    featuredOptions.forEach((option) => {
      option.classList.remove("active");
    });
    btnFeature.classList.add("active");
    featuredProducts();
  }
});
btnLatest.addEventListener("click", () => {
  if (!btnLatest.classList.contains("active")) {
    featuredOptions.forEach((option) => {
      option.classList.remove("active");
    });
    btnLatest.classList.add("active");
    featuredProducts();
  }
});

bestSelling();
ctaImg();
featuredProducts();
