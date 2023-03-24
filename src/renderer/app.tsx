import { useState, useEffect } from 'react';
import { BottomNavigation } from 'react-daisyui';
import { TbCloudDataConnection, TbSettings2 } from 'react-icons/tb';
import { HomePage } from './pages/home.page';
import { SettingPage } from './pages/setting.page';

interface Page {
    key: string
    element: JSX.Element
}

export function App() {
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

    return (
        <div>
            {currentPage.element}
            <BottomNavigation size='xs' className='mb-2'>
                <div className={`${currentPath == '/' ? 'active' : ''}`} onClick={() => setCurrentPath('/')}><TbCloudDataConnection size={30} /></div>
                <div className={`${currentPath == '/setting' ? 'active' : ''}`} onClick={() => setCurrentPath('/setting')}> <TbSettings2 size={30} /></div>
            </BottomNavigation>
        </div>
    )
}

