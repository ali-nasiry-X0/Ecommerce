import { closePopupCategories } from "./renderCategories.js";
const popupMenu = document.querySelector(".navbar__popup__menu");
const popupBtn = document.querySelector(".navbar__popup__btn");
const offer = document.querySelector(".get-offer");
const body = document.querySelector("body");

popupBtn.addEventListener("click", () => {
  popupMenu.classList.toggle("is-open");
  popupBtn.classList.toggle("active");
  offer.classList.toggle("popup-open");
  body.classList.toggle("overflow-hidden");
  closePopupCategories();
});
