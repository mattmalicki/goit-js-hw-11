export function scroll() {
  const height = document.documentElement.clientHeight;
  const scrollY = window.scrollY;
  return { height, scrollY };
}
