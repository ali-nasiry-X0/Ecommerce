// let quantityInput = document.querySelector(".productQuantity");
// const inButton = document.querySelector(".inButton");
// const deButton = document.querySelector(".deButton");

export function operateQuantity(input, inB, deB) {
  let counter = input.value;
  inB.addEventListener("click", () => {
    counter++;
    input.value = counter;
  });
  deB.addEventListener("click", () => {
    counter--;
    input.value = counter;
  });
}
// operateQuantity(quantityInput, inButton, deButton);
