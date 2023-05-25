import { useState, useEffect } from "react";
import { Badge, BottomNavigation } from "react-daisyui";
import { TbSettings, TbSmartHome } from "react-icons/tb";
import { HomePage } from "./pages/home.page";
import { SettingPage } from "./pages/setting.page";
// eslint-disable-next-line import/no-unresolved
import { loadLocaleAsync } from "@/i18n/i18n-util.async";
import TypesafeI18n from "../i18n/i18n-react";
// eslint-disable-next-line import/no-unresolved
import { Settings } from "@/shared/interfaces/settings.interface";
import { PageWrapper } from "./Wrappers/pages.wrapper";
import { themeChanger } from "./utils/theme.util";

export let settingStore: Settings = {
  lng: "fa",
  startUp: false,
};

interface Page {
  key: string;
  element: JSX.Element;
}

export function App() {
  const [wasLoaded, setWasLoaded] = useState(false);

  const pages: Array<Page> = [
    { key: "/", element: <HomePage /> },
    { key: "/setting", element: <SettingPage /> },
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

    themeChanger(localStorage.getItem("theme") || "system");
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
          className="mb-2 -bottom-2 h-14"
          dir={settingStore.lng == "fa" ? "rtl" : "ltr"}
        >
          <div onClick={() => setCurrentPath("/")}>
            <TbSmartHome
              size={30}
              className={`${InPath("/") ? "text-[#658DCA]" : ""}`}
            />
            {InPath("/") && (
              <Badge size={"xs"} className={"bg-[#658DCA]"}></Badge>
            )}
          </div>
          <div onClick={() => setCurrentPath("/setting")}>
            <TbSettings
              size={30}
              className={`${InPath("/setting") ? "text-[#658DCA]" : ""}`}
            />
            {InPath("/setting") && (
              <Badge size={"xs"} className={"bg-[#658DCA]"}></Badge>
            )}
          </div>
        </BottomNavigation>
      </TypesafeI18n>
    </div>
  );
}
