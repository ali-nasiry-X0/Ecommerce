export function sort(params, option) {
  if (option == "newest") {
    let array = params.sort((a, b) => new Date(b.date) - new Date(a.date));
    return array;
  }
  if (option == "oldest") {
    let array = params.sort((a, b) => new Date(a.date) - new Date(b.date));
    return array;
  }
}
