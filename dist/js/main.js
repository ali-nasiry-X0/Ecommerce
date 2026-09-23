import { getProducts } from "./getProducts.js";
import { getCategories } from "./getCategories.js";
const popupMenu = document.querySelector(".navbar__popup__menu");
const popupBtn = document.querySelector(".navbar__popup__btn");
const offer = document.querySelector(".get-offer");
const body = document.querySelector("body");
const btnCategories = document.querySelector(".menu-categories");
let productList;

const categoriesContainer = document.querySelector(
  ".navbar__popup__categories",
);

const categoriesItems = document.querySelector(".categories__items");

popupBtn.addEventListener("click", () => {
  popupMenu.classList.toggle("is-open");
  popupBtn.classList.toggle("active");
  offer.classList.toggle("popup-open");
  body.classList.toggle("overflow-hidden");
});
async function initCategory() {
  const products = await getProducts();
  // console.log(products);

  const categories = await getCategories();
  // console.log(categories);
  // consle.log(categories);
  productList = categories;
}
await initCategory();

function animateCategories(buttons) {
  categoriesItems.classList.add("is-stacked");

  const middleIndex = Math.floor(buttons.length / 2);

  buttons.forEach((button, index) => {
    button.style.zIndex = index === middleIndex ? 10 : 1;
  });

  /*
   * =====================================
   * STEP 2
   * کل stack پایین می‌آید
   * =====================================
   */

  requestAnimationFrame(() => {
    categoriesContainer.classList.add("drop");
    setTimeout(() => {
      const firstPositions = buttons.map((button) =>
        button.getBoundingClientRect(),
      );
      categoriesItems.classList.remove("is-stacked");
      requestAnimationFrame(() => {
        const lastPositions = buttons.map((button) =>
          button.getBoundingClientRect(),
        );
        buttons.forEach((button, index) => {
          const first = firstPositions[index];
          const last = lastPositions[index];

          const x = first.left - last.left;
          const y = first.top - last.top;

          button.animate(
            [
              {
                transform: `translate(${x}px, ${y}px)`,
              },
              {
                transform: "translate(0, 0)",
              },
            ],
            {
              duration: 700,
              easing: "ease",
              fill: "both",
            },
          );
        });
      });
    }, 700);
  });
}
let isCategoriesOpen = false;

btnCategories.addEventListener("click", async () => {
  if (isCategoriesOpen) {
    closeCategories();
  } else {
    await openCategories();
  }
});

async function openCategories() {
  categoriesItems.innerHTML = "";
  const buttons = productList.map((category) => {
    const button = document.createElement("button");
    button.classList.add("category-btn");
    button.textContent = category.name;
    categoriesItems.append(button);
    return button;
  });
  animateCategories(buttons);
  isCategoriesOpen = true;
}

function closeCategories() {
  categoriesContainer.classList.remove("drop");

  setTimeout(() => {
    categoriesItems.innerHTML = "";
    categoriesItems.classList.remove("is-stacked");
  }, 500);

  isCategoriesOpen = false;
}
