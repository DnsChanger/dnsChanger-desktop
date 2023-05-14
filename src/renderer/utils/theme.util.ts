export function themeChanger(theme: string): void {
  const doc = document.querySelector("html");
  doc.classList.forEach((c) => doc.classList.remove(c));
  document.querySelector("html").classList.add(theme);
  window.ui.toggleTheme(theme);
}

type returnTheme = "dark" | "light";

export function getThemeSystem(): returnTheme {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )
    return "dark";
  else return "light";
}
