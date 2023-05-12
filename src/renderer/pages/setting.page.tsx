import React, { useState, useEffect } from 'react';
import { Form } from 'react-daisyui';

import { useI18nContext } from '../../i18n/i18n-react';
import { loadLocaleAsync } from "../../i18n/i18n-util.async";
import { settingStore } from '../app';
import { Select, Option, Switch } from "@material-tailwind/react";
import { getThemeSystem, themeChanger } from '../utils/theme.util';




export function SettingPage() {
    const [startUp, setStartUp] = useState<boolean>(false);
    const { LL, locale } = useI18nContext()

    useEffect(() => {
        setStartUp(settingStore.startUp);
    }, []);

    function toggleStartUp() {
        window.ipc.toggleStartUP()
            .then((res) => setStartUp(res));
    }

    async function saveSetting() {
        await window.ipc.saveSettings(settingStore)
    }



    return (
        <div className="hero flex flex-col justify-center items-center" dir={locale == "fa" ? "rtl" : "ltr"}>
            <div className="max-w-[400px] text-center mb-8">
                <h1 className="text-3xl font-bold">{LL.pages.settings.title()}</h1>
            </div>
            <div className="flex flex-col items-start gap-4">
                <div className="bg-base-200 p-4 rounded-lg shadow w-96">

                    <div className='flex flex-col justify-center gap-3'>

                        <LanguageSwitcher cb={() => saveSetting()} />

                        <ThemeChanger />

                        <div className=''>
                            <Form.Label title={LL.pages.settings.autoRunningTitle()}>
                                <Switch defaultChecked={startUp} checked={startUp} onClick={() => toggleStartUp()} />
                            </Form.Label>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

interface Prop {
    cb: any
}
const LanguageSwitcher = (prop: Prop) => {
    const { LL, locale, setLocale } = useI18nContext()
    const [language, setLanguage] = useState(locale);

    const handleLanguageChange = async (lng: any) => {
        setLanguage(lng);

        await loadLocaleAsync(lng)
        // @ts-ignore
        setLocale(lng)
        settingStore.lng = lng
        prop.cb()
    };
    const languages = [{
        name: "فارسی",
        value: "fa",
        svg: `../assets/flags/iran.svg`

    }, {
        name: "English",
        value: "eng",
        svg: `../assets/flags/usa.svg`
    }]
    return (

        <div>
            <Select
                size="lg"
                label={LL.pages.settings.langChanger()}
                selected={(element) =>
                    element &&
                    React.cloneElement(element, {
                        className: "flex items-center px-0 gap-2 pointer-events-none",
                    })
                }
                value={language}
                onChange={(target) => handleLanguageChange(target)}
            >
                {languages.map(({ name, svg, value }) => (
                    <Option key={name} value={value} className={`flex items-center gap-2 hover:bg-slate-400 hover:text-gray-600 ${language == value && "bg-slate-400 text-gray-600 "}`}>
                        <img
                            src={svg}
                            alt={name}
                            className="h-5 w-5 rounded-full object-cover"
                        />
                        {name}
                    </Option>
                ))}
            </Select>
        </div>

    );
};


const ThemeChanger = () => {
    const [currentTheme, setCurrentTheme] = useState(
        localStorage.getItem('theme') || getThemeSystem()
    );
    const { LL } = useI18nContext()

    useEffect(() => {
        if (currentTheme === 'system')
            themeChanger(getThemeSystem());
        else
            themeChanger(currentTheme);
        localStorage.setItem('theme', currentTheme);
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
            >
                <Option value='dark' className={`hover:bg-slate-400 hover:text-gray-600 ${currentTheme == "dark" && "bg-slate-400 text-gray-600 "}`}>{LL.themeChanger.dark()}</Option>
                <Option value="light" className={`hover:bg-slate-400 hover:text-gray-600 ${currentTheme == "light" && "bg-slate-400 text-gray-600 "}`}>{LL.themeChanger.light()}</Option>
            </Select>
        </div>
    )
}

