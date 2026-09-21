const popupMenu = document.querySelector(".navbar__popup__menu");
const popupBtn = document.querySelector(".navbar__popup__btn");
const offer = document.querySelector(".get-offer");
popupBtn.addEventListener("click", () => {
  popupMenu.classList.toggle("is-open");
  popupBtn.classList.toggle("active");
  offer.classList.toggle("popup-open");
});
const body = document.querySelector("body");
async function getProducts() {
  const response = await fetch("http://127.0.0.1:3000");
  const data = await response.json();
  return data;
}
