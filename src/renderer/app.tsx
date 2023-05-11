import { useState, useEffect } from 'react';
import { BottomNavigation } from 'react-daisyui';
import { TbCloudDataConnection, TbSettings2 } from 'react-icons/tb';
import { HomePage } from './pages/home.page';
import { SettingPage } from './pages/setting.page';
import { loadLocaleAsync } from '../i18n/i18n-util.async';
import TypesafeI18n from '../i18n/i18n-react';
import { Settings } from '../shared/interfaces/settings.interface';
import { PageWrapper } from './Wrappers/pages.wrapper';
import { themeChanger } from './utils/theme.util';

export let settingStore: Settings = {
    lng: "fa",
    startUp: false
}

interface Page {
    key: string
    element: JSX.Element
}
export function App() {

    const detectedLocale = "fa"
    const [wasLoaded, setWasLoaded] = useState(false)



    const pages: Array<Page> = [
        { key: '/', element: <HomePage /> },
        { key: '/setting', element: <SettingPage /> }
    ]
    const [currentPage, setCurrentPage] = useState<Page>(pages[0]);
    const [currentPath, setCurrentPath] = useState<string>('/');

    useEffect(() => {
        let page = pages.find((p) => p.key == currentPath);
        if (!page) page = pages[0];

        setCurrentPage(page);
    }, [currentPath]);
    useEffect(() => {
        async function getSetting() {
            settingStore = await window.ipc.getSettings() as Settings;
        }
        getSetting().then(() => {
            loadLocaleAsync(settingStore.lng).then(() => setWasLoaded(true))
        })

        themeChanger(localStorage.getItem('theme') || 'system')
    }, [])

    if (!wasLoaded) return null

    return (
        <div>
            <TypesafeI18n locale={settingStore.lng}>
                <PageWrapper>
                    {currentPage.element}
                </PageWrapper>
                <BottomNavigation size='xs' className='mb-2' dir={settingStore.lng == "fa" ? "rtl" : "ltr"}>
                    <div className={`${currentPath == '/' ? 'active' : ''}`} onClick={() => setCurrentPath('/')}><TbCloudDataConnection size={30} /></div>
                    <div className={`${currentPath == '/setting' ? 'active' : ''}`} onClick={() => setCurrentPath('/setting')}> <TbSettings2 size={30} /></div>
                </BottomNavigation>
            </TypesafeI18n>
        </div>
    )
}

