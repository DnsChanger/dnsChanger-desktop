import React, { useState, useEffect } from "react";
import { Badge, BottomNavigation } from "react-daisyui";
import { TbSettings, TbSmartHome } from "react-icons/tb";
import { MdOutlineExplore } from "react-icons/md";
import { HomePage } from "./pages/home.page";
import { SettingPage } from "./pages/setting.page";
import { loadLocaleAsync } from "../i18n/i18n-util.async";
import TypesafeI18n from "../i18n/i18n-react";
import { Settings } from "../shared/interfaces/settings.interface";
import { PageWrapper } from "./Wrappers/pages.wrapper";
import { getThemeSystem, themeChanger } from "./utils/theme.util";
import { IconType } from "react-icons";
import { ExplorePage } from "./pages/explore.page";
import { Toaster } from "react-hot-toast";
import { analytics } from "./utils/analytics";

export let settingStore: Settings = {
  lng: "eng",
  startUp: false,
  autoUpdate: false,
  minimize_tray: false,
};

interface Page {
  key: string;
  element: JSX.Element;
  icon: IconType;
}

export function App() {
  const [wasLoaded, setWasLoaded] = useState(false);

  const pages: Array<Page> = [
    { key: "/", element: <HomePage />, icon: TbSmartHome },
    { key: "/explore", element: <ExplorePage />, icon: MdOutlineExplore },
    { key: "/setting", element: <SettingPage />, icon: TbSettings },
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

    analytics.event({
      category: "APP_VS",
      label: import.meta.env.PACKAGE_VERSION,
      action: `version ${import.meta.env.PACKAGE_VERSION}`,
    });

    themeChanger(theme);
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", () => {});
    };
  }, []);

  useEffect(() => {
    if (currentPage)
      analytics.send({
        hitType: "pageview",
        page: currentPage.key,
        title: currentPage.key,
      });
  }, [currentPage]);

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
                {React.createElement(page.icon, {
                  className: `${
                    InPath(page.key) ? "text-[#658DCA]" : "text-[#8D8D8D]"
                  }`,
                  size: 30,
                })}
                {InPath(page.key) && (
                  <Badge
                    size={"xs"}
                    className={"bg-[#658DCA] border-[#658DCA]"}
                  ></Badge>
                )}
              </div>
            );
          })}
        </BottomNavigation>
        <Toaster />
      </TypesafeI18n>
    </div>
  );
}
