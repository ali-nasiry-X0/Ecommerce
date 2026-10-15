const params = new URLSearchParams(window.location.search);

const breadCrumbSection = document.querySelector(".breadCrumb");

function createElemBreadCrumb(container, arg) {
  const link = document.createElement("a");
  link.href = "#";
  link.textContent = arg;
  const seprator = document.createElement("img");
  seprator.src = "../icons/ui/Chevron Right.svg";
  container.appendChild(seprator);
  container.appendChild(link);
}

function breadCrumb() {
  const breadCrumbContainer = breadCrumbSection.querySelector(".container");
  for (const [key, value] of params) {
    if (key != "id") {
      createElemBreadCrumb(breadCrumbContainer, value);
    }
  }
}
breadCrumb();
