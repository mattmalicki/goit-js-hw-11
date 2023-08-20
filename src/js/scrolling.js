export function scroll(func) {
  const height = document.querySelector('body').offsetHeight;
  const scrollTop = window.scrollY;
  const windowH = window.innerHeight;
  const scrolled = Math.round(windowH + scrollTop);

  if (height === scrolled) {
    func();
  }
}
