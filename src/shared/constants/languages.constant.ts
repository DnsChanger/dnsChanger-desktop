export interface Language {
  name: string;
  value: string;
  svg: string;
}
export const languages: Array<Language> = [
  {
    name: "فارسی",
    value: "fa",
    svg: `../assets/flags/iran.svg`,
  },
  {
    name: "English",
    value: "eng",
    svg: `../assets/flags/usa.svg`,
  },
  {
    name: "Russian",
    value: "ru",
    svg: "../assets/flags/russia.svg",
  },
];
