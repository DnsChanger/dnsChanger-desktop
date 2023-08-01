export async function themeChanger(theme: "dark" | "light" | "system"): Promise<void> {
  const res = await window.ui.toggleTheme(theme);
  theme = res ? "dark" : "light"

  const doc = document.querySelector("html");
  doc.classList.forEach((c) => doc.classList.remove(c));
  document.querySelector("html").classList.add(theme);
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
