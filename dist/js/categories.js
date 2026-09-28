import { getCategories } from "./getCategories.js";
const btnCategories = document.querySelector(".menu-categories");
let productList;
const categoriesContainer = document.querySelector(
  ".navbar__popup__categories",
);
const categoriesItems = document.querySelector(".categories__items");
const btnCategoriesPopup = document.querySelector(".menu-categories__popup");
const itemsCategoriesPopup = document.querySelector(".menu-categories-items");
async function initCategory() {
  const categories = await getCategories();
  productList = categories;
}
await initCategory();

function animateCategories(buttons) {
  categoriesItems.classList.add("is-stacked");

  const middleIndex = Math.floor(buttons.length / 2);

  buttons.forEach((button, index) => {
    button.style.zIndex = index === middleIndex ? 10 : 1;
  });
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
    }, 400);
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
  }, 400);

  isCategoriesOpen = false;
}
async function openCategoriesPopup() {
  productList.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add("category-btn");
    button.textContent = category.name;
    itemsCategoriesPopup.append(button);
  });
}
export function closePopupCategories() {
  if (btnCategoriesPopup.classList.contains("is-open")) {
    btnCategoriesPopup.classList.remove("is-open");
    itemsCategoriesPopup.classList.remove("is-open");
  }
}
if (screen.width < 1200) {
  openCategoriesPopup();
}
btnCategoriesPopup.addEventListener("click", () => {
  itemsCategoriesPopup.classList.toggle("is-open");
  btnCategoriesPopup.classList.toggle("is-open");
});
