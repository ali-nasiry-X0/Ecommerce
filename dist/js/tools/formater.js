export function formatTextDetaSet(text) {
  return text
    .split("/")
    .map((word) => word.trim().slice(0, 3))
    .join("")
    .toUpperCase();
}
export function formatNumber(number) {
  return String(number).padStart(4, "0");
}
