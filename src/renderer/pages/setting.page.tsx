import React, { useState, useEffect } from "react";

import { useI18nContext } from "../../i18n/i18n-react";
import { settingStore } from "../app";
import { Select, Option, Switch, Typography } from "@material-tailwind/react";
import { getThemeSystem, themeChanger } from "../utils/theme.util";
import { UpdateBtnComponent } from "@/renderer/component/buttons/update-btn.component";

export function SettingPage() {
  const [startUp, setStartUp] = useState<boolean>(false);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(false);
  const [miniTry, setMiniTry] = useState<boolean>(false);
  const { LL, locale } = useI18nContext();

  useEffect(() => {
    setStartUp(settingStore.startUp);
    setAutoUpdate(settingStore.autoUpdate);
    setMiniTry(settingStore.minimize_tray);
  }, []);

  function toggleStartUp() {
    window.ipc.toggleStartUP().then((res) => setStartUp(res));
  }
  function toggleAutoUpdate() {
    const auto = !autoUpdate;
    settingStore.autoUpdate = auto;
    setAutoUpdate(auto);
    saveSetting();
  }

  function toggleMinimize_tray() {
    settingStore.minimize_tray = !miniTry;
    setMiniTry(settingStore.minimize_tray);
    saveSetting();
  }

  async function saveSetting() {
    await window.ipc.saveSettings(settingStore);
  }

  return (
    <div
      className="hero flex flex-col justify-center items-center "
      dir={locale == "fa" ? "rtl" : "ltr"}
    >
      <div className="flex flex-col items-start gap-4 ">
        <div className="dark:bg-[#262626] bg-base-200 p-4 rounded-lg shadow w-[600px] h-[300px] ">
          <div className="flex flex-col justify-center gap-2 ">
            {/*<LanguageSwitcher cb={() => saveSetting()} />*/}

            <div className={"grid grid-cols-2 gap-5 "}>
              <ThemeChanger />
              <div></div>
              <Switch
                id={"startUp"}
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
                checked={startUp}
              />
              <Switch
                id={"autoUP"}
                label={
                  <div>
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
                defaultChecked={autoUpdate}
                checked={autoUpdate}
              />
              <Switch
                id={"Minimize"}
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
                defaultChecked={miniTry}
                checked={miniTry}
              />
            </div>

            <hr className={"border-gray-500"} />
            <div className={"flex flex-row"}>
              <UpdateBtnComponent />
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
    if (currentTheme === "system") themeChanger(getThemeSystem());
    else themeChanger(currentTheme);
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  return (
    <div>
      <Select
        label={LL.pages.settings.themeChanger()}
        animate={{
          mount: { y: 0 },
          unmount: { y: 25 },
        }}
        value={currentTheme}
        onChange={(value) => setCurrentTheme(value)}
        className={"dark:bg-[#262626] bg-base-200 text-[#6B6A6A] font-[Inter]"}
      >
        <Option value="system">System</Option>
        <Option value="dark">{LL.themeChanger.dark()}</Option>
        <Option value="light">{LL.themeChanger.light()}</Option>
      </Select>
    </div>
  );
};
