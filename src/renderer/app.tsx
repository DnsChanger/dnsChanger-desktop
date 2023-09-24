import React, { useState, useEffect } from "react";
import { BottomNavigation, Tooltip } from "react-daisyui";

import { TbSettings, TbSmartHome } from "react-icons/tb";
import { MdOutlineExplore } from "react-icons/md";
import { HomePage } from "./pages/home.page";
import { SettingPage } from "./pages/setting.page";
import { loadLocaleAsync } from "../i18n/i18n-util.async";
import TypesafeI18n from "../i18n/i18n-react";
import {
  SettingInStore,
  Settings,
} from "../shared/interfaces/settings.interface";
import { PageWrapper } from "./Wrappers/pages.wrapper";
import { getThemeSystem, themeChanger } from "./utils/theme.util";
import { IconType } from "react-icons";
import { ExplorePage } from "./pages/explore.page";
import { Toaster } from "react-hot-toast";
export let settingStore: SettingInStore = window.storePreload.get("settings");
interface Page {
  key: string;
  element: JSX.Element;
  icon: IconType;
  name: string;
}

export function App() {
  const [wasLoaded, setWasLoaded] = useState(false);

  const pages: Array<Page> = [
    { key: "/", element: <HomePage />, icon: TbSmartHome, name: "Home" },
    {
      key: "/explore",
      element: <ExplorePage />,
      icon: MdOutlineExplore,
      name: "Explore",
    },
    {
      key: "/setting",
      element: <SettingPage />,
      icon: TbSettings,
      name: "Setting",
    },
  ];
  const [currentPage, setCurrentPage] = useState<Page>(pages[0]);
  const [currentPath, setCurrentPath] = useState<string>("/");

  useEffect(() => {
    let page = pages.find((p) => p.key == currentPath);
    if (!page) page = pages[0];

    setCurrentPage(page);
  }, [currentPath]);
  useEffect(() => {
    async function getSetting() {
      settingStore = (await window.ipc.getSettings()) as Settings;
    }

    getSetting().then(() => {
      loadLocaleAsync(settingStore.lng).then(() => setWasLoaded(true));
    });

    let theme = localStorage.getItem("theme") || "dark";
    if (theme == "system") theme = getThemeSystem();

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", ({ matches }) => {
        if (theme == "system") {
          if (matches) {
            themeChanger("dark");
          } else {
            themeChanger("light");
          }
        }
      });

    themeChanger(theme as any);
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", () => {});
    };
  }, []);

  if (!wasLoaded) return null;
  function InPath(target: string): boolean {
    return currentPath == target;
  }

  return (
    <div>
      <TypesafeI18n locale={settingStore.lng}>
        <PageWrapper>{currentPage.element}</PageWrapper>
        <BottomNavigation
          size="xs"
          className="mb-2 -bottom-2 h-16 bg-[#CCCCCC]"
          dir={settingStore.lng == "fa" ? "rtl" : "ltr"}
        >
          {pages.map((page) => {
            return (
              <div onClick={() => setCurrentPath(page.key)} key={page.key}>
                <Tooltip message={page.name}>
                  <div
                    className={`rounded-full p-2 ${
                      InPath(page.key)
                        ? "bg-[#7487FF1C]"
                        : "hover:bg-[#7487ff09] hover:text-[#5B64A4]"
                    }`}
                  >
                    {React.createElement(page.icon, {
                      className: `${
                        InPath(page.key) ? "text-[#5B64A4]" : "text-[#8D8D8D] "
                      }`,
                      size: 30,
                    })}
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </BottomNavigation>
        <Toaster />
      </TypesafeI18n>
    </div>
  );
}
