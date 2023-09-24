import React, { useEffect, useState } from "react";

import { useI18nContext } from "../../i18n/i18n-react";
import { Option, Select, Switch, Typography } from "@material-tailwind/react";
import { getThemeSystem, themeChanger } from "../utils/theme.util";
import { CgDarkMode } from "react-icons/cg";
import { HiMoon, HiSun } from "react-icons/hi";
import { SettingInStore } from "../../shared/interfaces/settings.interface";

export function SettingPage() {
  const [startUp, setStartUp] = useState<boolean>(false);
  const { LL, locale } = useI18nContext();
  const [settingState, setSettingState] = useState<SettingInStore>(
    window.storePreload.get("settings")
  );

  function toggleStartUp() {
    window.ipc.toggleStartUP().then((res) => setStartUp(res));
  }
  function toggleAutoUpdate() {
    setSettingState((prevState) => ({
      ...prevState,
      autoUpdate: !prevState.autoUpdate,
    }));
  }

  function toggleMinimize_tray() {
    setSettingState((prevState) => ({
      ...prevState,
      minimize_tray: !prevState.minimize_tray,
    }));
  }

  function toggleAnalytic() {
    setSettingState((prevState) => ({
      ...prevState,
      use_analytic: !prevState.use_analytic,
    }));
  }

  useEffect(() => {
    window.ipc.saveSettings(settingState).catch();
  }, [settingState]);

  return (
    <div
      className="hero flex flex-col justify-center items-center p-5"
      dir={locale == "fa" ? "rtl" : "ltr"}
    >
      <div className="flex flex-col items-start gap-4 ">
        <div className="dark:bg-[#262626] bg-base-200 p-4 rounded-lg shadow w-[600px] h-[300px]">
          <div className="flex flex-col justify-center  gap-2  p-4">
            {/*<LanguageSwitcher cb={() => saveSetting()} />*/}
            <div className={"grid grid-cols-2 gap-5 "}>
              <ThemeChanger />
              <div></div>
              <Switch
                id={"startUp"}
                crossOrigin={"true"}
                color={"green"}
                label={
                  <div>
                    <Typography
                      color="blue-gray"
                      className="font-medium  dark:text-white font-[Inter] "
                    >
                      Start up
                    </Typography>
                    <Typography
                      variant="paragraph"
                      color="gray"
                      className="font-normal  dark:text-gray-600 font-[Inter] text-sm "
                    >
                      {LL.pages.settings.autoRunningTitle()}
                    </Typography>
                  </div>
                }
                containerProps={{
                  className: "-mt-5 mr-5",
                }}
                onChange={toggleStartUp}
                defaultChecked={startUp}
              />
              <Switch
                id={"autoUP"}
                crossOrigin={"true"}
                color={"green"}
                label={
                  <div className={"mb-4"}>
                    <Typography
                      color="blue-gray"
                      className="font-medium  dark:text-white font-[Inter]"
                    >
                      Automatic Update
                    </Typography>
                    <Typography
                      variant="paragraph"
                      color="gray"
                      className="font-normal  dark:text-gray-600 font-[Inter] text-sm "
                    >
                      Get updates automatically
                    </Typography>
                  </div>
                }
                containerProps={{
                  className: "-mt-5 mr-2",
                }}
                onChange={toggleAutoUpdate}
                defaultChecked={settingState.autoUpdate}
              />
              <Switch
                id={"Minimize"}
                crossOrigin={"true"}
                color={"green"}
                label={
                  <div>
                    <Typography
                      color="blue-gray"
                      className="font-medium  dark:text-white font-[Inter]"
                    >
                      Minimize to Tray
                    </Typography>
                    <Typography
                      variant="paragraph"
                      color="gray"
                      className="font-medium  dark:text-gray-600 font-[Inter] text-sm "
                    >
                      The app move to try in background
                    </Typography>
                  </div>
                }
                containerProps={{
                  className: "-mt-5 mr-2",
                }}
                onChange={toggleMinimize_tray}
                defaultChecked={settingState.minimize_tray}
              />
              <Switch
                id={"Analytic"}
                crossOrigin={"true"}
                color={"green"}
                label={
                  <div className="ml-2">
                    <Typography
                      color="blue-gray"
                      className="font-medium  dark:text-white font-[Inter]"
                    >
                      Analytic
                    </Typography>
                    <Typography
                      variant="paragraph"
                      color="gray"
                      className="font-medium  dark:text-gray-600 font-[Inter] text-sm"
                    >
                      Enable/disable sending servers for analysis[name,address]
                    </Typography>
                  </div>
                }
                containerProps={{
                  className: "-mt-5 mr-2",
                }}
                onChange={toggleAnalytic}
                defaultChecked={settingState.use_analytic}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Prop {
  cb: any;
}

// const LanguageSwitcher = (prop: Prop) => {
//   const { LL, locale, setLocale } = useI18nContext();
//   const [language, setLanguage] = useState(locale);
//
//   const handleLanguageChange = async (lng: any) => {
//     setLanguage(lng);
//
//     await loadLocaleAsync(lng);
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     setLocale(lng);
//     settingStore.lng = lng;
//     prop.cb();
//   };
//
//   return (
//     <div>
//       <Select
//         size="lg"
//         label={LL.pages.settings.langChanger()}
//         selected={(element) =>
//           element &&
//           React.cloneElement(element, {
//             className: "flex items-center px-0 gap-2 pointer-events-none",
//           })
//         }
//         value={language}
//         onChange={(target) => handleLanguageChange(target)}
//       >
//         {languages.map(({ name, svg, value }) => (
//           <Option
//             key={name}
//             value={value}
//             className={`flex items-center gap-2 hover:bg-slate-400 hover:text-gray-600 ${
//               language == value && "bg-slate-400 text-gray-600 "
//             }`}
//           >
//             <img
//               src={svg}
//               alt={name}
//               className="h-5 w-5 rounded-full object-cover"
//             />
//             {name}
//           </Option>
//         ))}
//       </Select>
//     </div>
//   );
// };

const ThemeChanger = () => {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") || getThemeSystem()
  );
  const { LL } = useI18nContext();

  useEffect(() => {
    themeChanger(currentTheme as any);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  return (
    <div className="select-material">
      <Select
        label={LL.pages.settings.themeChanger()}
        animate={{
          mount: { y: 0 },
          unmount: { y: 25 },
        }}
        value={currentTheme}
        color="indigo"
        selected={(element) =>
          element &&
          React.cloneElement(element, {
            className: "flex items-center px-0 gap-2 pointer-events-none",
          })
        }
        onChange={(value) => setCurrentTheme(value)}
        className={"dark:bg-[#262626] bg-base-200 text-[#6B6A6A] font-[Inter]"}
      >
        <Option value="system" className="flex items-center gap-2 font-[Inter]">
          <CgDarkMode />
          System
        </Option>
        <Option value="dark" className="flex items-center gap-2 font-[Inter]">
          <HiMoon />
          {LL.themeChanger.dark()}
        </Option>
        <Option value="light" className="flex items-center gap-2 font-[Inter]">
          <HiSun />
          {LL.themeChanger.light()}
        </Option>
      </Select>
    </div>
  );
};
