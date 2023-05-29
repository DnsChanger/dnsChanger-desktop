import { createContext } from "react";

export const updateContext = createContext({
  downloading: false,
  setDownloading: () => {},
});
