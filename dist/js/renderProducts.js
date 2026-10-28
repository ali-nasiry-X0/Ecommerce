import { listProducts } from "./products.js";
import { sortProductRank } from "./sortProduts.js";
import { listPcategories } from "./seprateProductsByCategories.js";
import { listPfeatured } from "./featuredProducts.js";
import { productsById } from "./products.js";
import { stock } from "./stockProduct.js";
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
    if (stock(product) > 0) {
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

const contianerProductsFeatured = document.querySelector(".featured__content");
let allproductContainer;

function createFeatureProductElements() {
  const aPorduct = document.createElement("a");

  aPorduct.classList.add("featured__product", "product", "shortList__product");

  const divImg = document.createElement("div");

  divImg.classList.add(
    "featured__product__img",
    "product__img",
    "shortList__product__img",
  );

  const imgProduct = document.createElement("img");

  const divInfo = document.createElement("div");

  divInfo.classList.add(
    "featured__product__info",
    "product__info",
    "shortList__product__info",
  );

  const pName = document.createElement("p");

  pName.classList.add("product__name");

  const divPDetail = document.createElement("div");

  divPDetail.classList.add("product__detail");

  const pStatus = document.createElement("P");

  pStatus.classList.add("product__status");

  const pPrice = document.createElement("P");

  pPrice.classList.add("product__price");

  // appending

  divPDetail.appendChild(pStatus);
  divPDetail.appendChild(pPrice);
  divInfo.appendChild(pName);
  divInfo.appendChild(divPDetail);
  divImg.appendChild(imgProduct);
  aPorduct.appendChild(divImg);
  aPorduct.appendChild(divInfo);
  contianerProductsFeatured.appendChild(aPorduct);
}
async function featuredProducts() {
  const allProductsFeature = await listPfeatured();

  contianerProductsFeatured.innerHTML = "";

  if (btnFeature.classList.contains("active")) {
    allProductsFeature.forEach(() => {
      createFeatureProductElements();
    });
    allproductContainer = document.querySelectorAll(".featured__product");
    renderFP(allProductsFeature);
  }
  if (btnLatest.classList.contains("active")) {
    let latest_products = sortProductRank(listProducts).slice(0, 4);

    latest_products.forEach(() => {
      createFeatureProductElements();
    });
    allproductContainer = document.querySelectorAll(".featured__product");

    renderFP(latest_products);
  }

  function renderFP(listProducts) {
    allproductContainer.forEach((productElement, index) => {
      const product = listProducts[index];
      const img = productElement.querySelector("img");
      const productName = productElement.querySelector(".product__name");
      const productStatus = productElement.querySelector(".product__status");
      const productPrice = productElement.querySelector(".product__price");

      productName.textContent = product.title;
      img.src = product.image;
      productElement.id = product.id;
      if (product.stock != 0) {
        productStatus.textContent = "IN STOCK";
      } else {
        productStatus.textContent = " SOLD OUT";
      }
      productPrice.textContent = `${product.price} $`;
    });
  }
  redirectToproductDetail();
}
btnFeature.addEventListener("click", () => {
  if (!btnFeature.classList.contains("active")) {
    featuredOptions.forEach((option) => {
      option.classList.remove("active");
    });
    btnFeature.classList.add("active");
    featuredProducts();
    redirectToproductDetail();
  }
});
btnLatest.addEventListener("click", () => {
  if (!btnLatest.classList.contains("active")) {
    featuredOptions.forEach((option) => {
      option.classList.remove("active");
    });
    btnLatest.classList.add("active");
    featuredProducts();
    redirectToproductDetail();
  }
});

function redirectToproductDetail() {
  let domProducts = document.querySelectorAll(".product");
  domProducts.forEach((domProduct) => {
    domProduct.addEventListener("click", () => {
      const baseUrl = "product.html";
      window.location.href = `${baseUrl}?category=${productsById.get(Number(domProduct.id)).category}&product=${productsById.get(Number(domProduct.id)).title}&id=${productsById.get(Number(domProduct.id)).id}`;
    });
  });
}
bestSelling();
ctaImg();
featuredProducts();
