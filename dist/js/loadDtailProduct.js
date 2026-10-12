import { productsById } from "./products.js";
const params = new URLSearchParams(window.location.search);
const product = productsById.get(Number(params.get("id")));
const breadCrumbSection = document.querySelector(".breadCrumb");

function createElemBreadCrumb(container, arg) {
  const link = document.createElement("a");
  link.textContent = arg.title;
  const seprator = document.createElement("img");
  seprator.src = "../icons/ui/Chevron Right.svg";
  container.appendChild(link);
  container.appendChild(seprator);
}
function breadCrumb() {
  const breadCrumbContainer = breadCrumbSection.querySelector(".container");
  createElemBreadCrumb(breadCrumbContainer, product);
}
breadCrumb();
