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
