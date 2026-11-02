// import { getCategories } from "./getCategories.js";
import { productsById } from "./products.js";
import { stock } from "./stockProduct.js";
const purchaseContainer = document.querySelector(".product-detail__purchase");
const optionsContainer = purchaseContainer.querySelector(
  ".product-detail__optional",
);
function init() {
  const id = Number(new URLSearchParams(location.search).get("id"));
  const product = productsById.get(id);
  if (!product) return console.warn("Product not found");
  loadAllDetail(product);
}
function loadAllDetail(product) {
  const { dynamicOptions, sizes, colors } = getProductOptions(product);
  loadBaseDetail(product);
  if (dynamicOptions.includes("color")) {
    renderColorOption(product, colors, optionsContainer);
  }
  if (dynamicOptions.includes("size")) {
    renderSizeOption(sizes, optionsContainer);
  }
}

function loadBaseDetail(product) {
  const nameProduct = purchaseContainer.querySelector(
    ".product-detail__nameProduct",
  );
  const rankP = purchaseContainer.querySelector(
    ".product-detail__rank__content",
  );
  const statusP = purchaseContainer.querySelector(".product-detail__status");
  const costP = purchaseContainer.querySelector(".product-detail__price");
  nameProduct.textContent = product.title;
  rankP.innerHTML = `${product.rating}&#8212;${product.review} Reviews`;
  if (stock(product) > 0) {
    statusP.textContent = "IN STOCK";
  } else {
    statusP.textContent = "Sold Out";
  }
  costP.textContent = `$ ${product.price}.00`;
}
function renderColorOption(product, colors, container) {
  const template = document.querySelector(".selectColors-template");
  const colorElement = template.content.cloneNode(true);
  const btnDiv = colorElement.querySelector(".product-detail__colors");
  const colorOption = product.options.find(
    (option) => option.values?.[0]?.hex !== undefined,
  );
  for (let i = 0; i < colors.length; i++) {
    const btnElem = document.createElement("button");
    colorOption.values.forEach((color) => {
      if (color["name"] == colors[i]) {
        const hexValue = color.hex;

        if (hexValue.length === 1) {
          btnElem.style.setProperty("--swatch-color", hexValue[0]);
        } else {
          btnElem.style.setProperty(
            "--swatch-color",
            `linear-gradient(to right, ${hexValue.join(", ")})`,
          );
        }
      }
    });
    btnElem.addEventListener("click", () => {
      selectable(btnElem, btnDiv);
    });
    btnElem.dataset.color = colors[i];
    btnElem.classList.add(`${colors[i].replaceAll(" ", "_")}_color`);
    btnDiv.appendChild(btnElem);
  }
  container.appendChild(colorElement);
}
function renderSizeOption(sizes, container) {
  const template = document.querySelector(".selectSize-template");
  const sizeElement = template.content.cloneNode(true);
  const btnDiv = sizeElement.querySelector(".product-detail__size");
  for (let i = 0; i < sizes.length; i++) {
    const btnElem = document.createElement("button");
    btnElem.textContent = sizes[i];
    btnElem.dataset.size = sizes[i];
    btnElem.classList.add(`${sizes[i]}_size`);
    btnDiv.appendChild(btnElem);
    btnElem.addEventListener("click", () => {
      selectable(btnElem, btnDiv);
    });
  }
  container.appendChild(sizeElement);
}

function getProductOptions(product) {
  const dynamicOptions = new Set();
  const sizes = new Set();
  const colors = new Set();

  product.options.forEach((option) => {
    dynamicOptions.add(Object.values(option)[0]);
  });

  product.variants.forEach((variant) => {
    if (variant.color) colors.add(variant.color);
    if (variant.size) sizes.add(variant.size);
  });

  return {
    dynamicOptions: [...dynamicOptions],
    sizes: [...sizes],
    colors: [...colors],
  };
}
function selectable(btnElem, container) {
  container.querySelector(".is-selected")?.classList.remove("is-selected");

  btnElem.classList.add("is-selected");
}

init();
