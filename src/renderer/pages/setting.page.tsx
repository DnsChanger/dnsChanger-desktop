import { useState, useEffect } from 'react';
import { Form, Select, Toggle } from 'react-daisyui';

import { PageWrapper } from '../Wrappers/pages.wrapper';
import { useI18nContext } from '../../i18n/i18n-react';
import { loadLocaleAsync } from "../../i18n/i18n-util.async";
import { settingStore } from '../app';
import { Locales } from '../../i18n/i18n-types';

export function SettingPage() {
    const [startUp, setStartUp] = useState<boolean>(false);
    const { LL } = useI18nContext()

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
        <div className="hero flex flex-col justify-center items-center">
            <div className="max-w-[400px] text-center mb-8">
                <h1 className="text-3xl font-bold">{LL.pages.settings.title()}</h1>
            </div>
            <div className="flex flex-col items-start gap-4" dir={"auto"}>
                <Form className="bg-base-200 p-4 rounded-lg shadow w-96">
                    <Form.Label title={LL.pages.settings.autoRunningTitle()}>
                        <Toggle
                            className="m-2"
                            color="success"
                            defaultChecked={startUp}
                            checked={startUp}
                            onClick={() => toggleStartUp()}
                        />
                    </Form.Label>
                </Form>
                <LanguageSwitcher cb={() => saveSetting()} />
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

    return (
        <div className="flex items-center">
            <div className="mr-2">{LL.pages.settings.langChanger()}</div>
            <div className="border-t border-gray-300 flex-grow"></div>
            <div className="mx-2">|</div>
            <div className="ml-2">
                <Select
                    className="w-32 px-3 py-1 border border-gray-300 rounded-md shadow-sm"
                    value={language}
                    onChange={(event) => handleLanguageChange(event.target.value)}
                >
                    <Select.Option value={'fa'}>
                        فارسی
                    </Select.Option>
                    <Select.Option value={'eng'}>
                        English
                    </Select.Option>
                </Select>
            </div>
        </div>
    );
};
