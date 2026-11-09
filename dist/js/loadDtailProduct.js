// import { getCategories } from "./getCategories.js";
import { productsById } from "./products.js";
import { stock } from "./stockProduct.js";
import { operateQuantity } from "./productQuantity.js";
import {
  formatTextDetaSet,
  formatNumber,
  formatSize,
} from "./tools/formater.js";
import { slider } from "./sliders.js";
import { diffTime } from "./tools/diffTime.js";
import { sort } from "./tools/sortByTime.js";

const purchaseContainer = document.querySelector(".product-detail__purchase");
const optionsContainer = purchaseContainer.querySelector(
  ".product-detail__optional",
);
let sku;

function init() {
  const id = Number(new URLSearchParams(location.search).get("id"));
  const product = productsById.get(id);
  const gallery = document.querySelector(".product-detail__gallery");
  const viewport = gallery.querySelector(".product-detail__pictures");
  const track = gallery.querySelector(".product-detail__track");
  let controlsBox = gallery.querySelector(".product-detail__controls");
  slider(gallery, viewport, track, controlsBox);
  if (!product) return console.warn("Product not found");
  loadAllDetail(product);
  createSku(product);
  sku = createSku(product);
  details(product.description, product.features);
  sorting(product);
}
function loadAllDetail(product) {
  const { dynamicOptions, sizes, colors } = getProductOptions(product);
  loadBaseDetail(product);
  renderPictureProduct(product.image);
  if (dynamicOptions.includes("color")) {
    renderColorOption(product, colors, optionsContainer);
  }
  if (dynamicOptions.includes("size")) {
    renderSizeOption(product, sizes, optionsContainer);
  }
  numOfProductBuy();
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
  const title = purchaseContainer.querySelector(".product-detail__title");
  title.dataset.category = formatTextDetaSet(product.category);
  title.dataset.id = formatNumber(product.id);
  nameProduct.textContent = product.title;
  rankP.innerHTML = `${product.rating}&#8212;${product.review} Reviews`;
  if (stock(product) > 0) {
    statusP.textContent = "IN STOCK";
  } else {
    statusP.textContent = "Sold Out";
  }
  costP.textContent = `$ ${product.price}.00`;
}
function renderPictureProduct(images) {
  images.forEach((img) => {
    const containerSliders = document.querySelector(".product-detail__track");
    const elemImg = document.createElement("img");
    elemImg.classList.add("product-detail__media");
    elemImg.src = img;
    containerSliders.append(elemImg);
  });
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
      createSku(product);
    });
    btnElem.dataset.color = formatTextDetaSet(colors[i]);

    btnElem.classList.add(`${colors[i].replaceAll(" ", "_")}_color`);

    if (i == 0) {
      btnElem.classList.add("is-selected");
    }

    btnDiv.appendChild(btnElem);
  }
  container.appendChild(colorElement);
}
function renderSizeOption(product, sizes, container) {
  const template = document.querySelector(".selectSize-template");
  const sizeElement = template.content.cloneNode(true);
  const btnDiv = sizeElement.querySelector(".product-detail__size");
  for (let i = 0; i < sizes.length; i++) {
    const btnElem = document.createElement("button");
    btnElem.textContent = sizes[i];
    btnElem.dataset.size = formatSize(sizes[i]);
    btnElem.classList.add(`${sizes[i]}_size`);
    if (i == 0) {
      btnElem.classList.add("is-selected");
    }
    btnDiv.appendChild(btnElem);
    btnElem.addEventListener("click", () => {
      selectable(btnElem, btnDiv);
      createSku(product);
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
function numOfProductBuy() {
  const counterContaienr = document.querySelector(
    ".product-detail__quantityBox",
  );
  const input = counterContaienr.querySelector(".productQuantity");
  const inbtn = counterContaienr.querySelector(".inButton");
  const debtn = counterContaienr.querySelector(".deButton");
  operateQuantity(input, inbtn, debtn);
}
function createSku(product) {
  const cat = formatTextDetaSet(product.category);
  const id = formatNumber(product.id);
  let color;
  let size;
  const elemColor = optionsContainer.querySelector(".product-detail__colors");
  const elemSize = optionsContainer.querySelector(".product-detail__size");
  if (elemColor) {
    elemColor.childNodes.forEach((option) => {
      if (option.classList.contains("is-selected")) {
        color = option.dataset.color;
      }
    });
  }
  if (elemSize) {
    elemSize.childNodes.forEach((option) => {
      if (option.classList.contains("is-selected")) {
        size = option.dataset.size;
      }
    });
  }

  return [cat, id, color, size].filter(Boolean).join("_");
}
function details(description, features) {
  const container_detail = document.querySelector(".product-detail__detail");
  const text_detail = container_detail.querySelector(
    ".product-detail__detail-text",
  );
  const features_detail = container_detail.querySelector(
    ".product-detail__detail-features",
  );
  text_detail.textContent = "";
  features_detail.textContent = "";

  text_detail.textContent = description;

  features.forEach((feature) => {
    const li = document.createElement("li");
    li.textContent = feature;
    features_detail.append(li);
  });
}
function reviews(product, option) {
  const containerReviews = document.querySelector(".product-detail__comments");
  containerReviews.innerHTML = "";
  sort(product.reviews, option).forEach((review) => {
    createComment(review, containerReviews);
  });
  const tabContainer = document.querySelector(".product-detail__tabs");
  const tabs = tabContainer.querySelectorAll("button");
  const detailSection = document.querySelector(".product-detail__detail");
  const reviewSection = document.querySelector(".product-detail__reviews");
  tabs.forEach((tab) => {
    if (tab.classList.contains("is-selected")) {
      if (tab.dataset.option == "detail") {
        detailSection.style.display = "flex";
        reviewSection.style.display = "none";
      } else if (tab.dataset.option == "review") {
        reviewSection.style.display = "flex";
        detailSection.style.display = "none";
      }
    }
    tab.addEventListener("click", (e) => {
      tabs.forEach((tab) => tab.classList.remove("is-selected"));
      tab.classList.add("is-selected");
      if (e.target.dataset.option == "detail") {
        detailSection.style.display = "flex";
        reviewSection.style.display = "none";
      }
      if (e.target.dataset.option == "review") {
        reviewSection.style.display = "flex";
        detailSection.style.display = "none";
      }
    });
  });

  const totalRankReviewProduct = document.querySelector(
    ".product-detail__reviews-total-rank",
  );
  const totalRank = totalRankReviewProduct.querySelector("h2");
  totalRank.textContent = product.rating;
  const totalReviewe = totalRankReviewProduct.querySelector("p");
  totalReviewe.textContent = `-${product.review} reviews`;
}
function createComment(review, container) {
  // create elements
  const comment = document.createElement("div");
  comment.classList.add("comment");
  const comment_info = document.createElement("div");
  comment_info.classList.add("comment__info");
  const person_info = document.createElement("div");
  person_info.classList.add("person__info");
  const person_profile = document.createElement("div");
  person_profile.classList.add("person__profile");
  const person_detail = document.createElement("div");
  person_detail.classList.add("person__detail");
  const person_name = document.createElement("div");
  person_name.classList.add("person__name");
  const person_date = document.createElement("div");
  person_date.classList.add("person__date");
  const comment_rank = document.createElement("div");
  comment_rank.classList.add("comment__rank");
  const comment_text = document.createElement("div");
  comment_text.classList.add("comment__text");

  // asign value and text
  person_profile.textContent = review.name.slice(0, 2).toUpperCase();
  person_name.textContent = review.name;
  const date1 = new Date(review.date);
  const date2 = new Date();
  const { diffMinute, diffClock, diffDay, diffWeek, diffMonth, diffYear } =
    diffTime(date1, date2);
  const timeUnits = [
    { value: diffMinute, max: 60, unit: "minute" },
    { value: diffClock, max: 24, unit: "hour" },
    { value: diffDay, max: 7, unit: "day" },
    { value: diffWeek, max: 5, unit: "week" },
    { value: diffMonth, max: 12, unit: "month" },
    { value: diffYear, max: Infinity, unit: "year" },
  ];

  const time = timeUnits.find(({ value, max }) => value >= 1 && value < max);

  if (time) {
    person_date.textContent = `${time.value} ${time.unit}${time.value > 1 ? "s" : ""} ago`;
  }

  ////

  for (let i = 0; i < review.rating; i++) {
    const fullStart = document.createElement("img");
    fullStart.src = "../icons/ui/Star.svg";
    comment_rank.append(fullStart);
  }
  for (let i = 0; i < 5 - review.rating; i++) {
    const emptyStar = document.createElement("img");
    emptyStar.src = "../icons/ui/Empty Star.svg";
    comment_rank.append(emptyStar);
  }

  ///////////
  comment_text.textContent = review.comment;

  //////// appending

  person_detail.append(person_name, person_date);
  person_info.append(person_profile, person_detail);
  comment_info.append(person_info, comment_rank);
  comment.append(comment_info, comment_text);
  container.append(comment);
}
function sorting(product) {
  const sortSelect = document.querySelector("#sort");
  sortSelect.addEventListener("change", (e) => {
    reviews(product, e.target.value);
  });
  reviews(product, sortSelect.value);
}
init();
console.log(sku);
