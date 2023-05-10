import { CgSun } from 'react-icons/cg';
import { BsDiscord, BsGithub } from 'react-icons/bs';
import { TbMoonStars } from 'react-icons/tb';
import { useEffect, useState } from 'react';
import { Button, Navbar } from 'react-daisyui';

export function NavbarComponent() {
    const [currentTheme, setCurrentTheme] = useState(
        localStorage.getItem('theme') || 'system'
    );

    useEffect(() => {
        if (currentTheme === 'system')
            themeChanger(getThemeSystem());
        else
            themeChanger(currentTheme);
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme]);

    return (
        <div>
            <Navbar >
                <Navbar.Start></Navbar.Start>
                <Navbar.End>
                    <Button className={'btn gap-2 normal-case btn-ghost'}
                        onClick={() => window.ipc.openBrowser('https://discord.gg/p9TZzEV39e')}>
                        <BsDiscord />
                    </Button>
                    <Button className={'btn gap-2 normal-case btn-ghost'}
                        onClick={() => window.ipc.openBrowser('https://github.com/DnsChanger/dnsChanger-desktop')}>
                        <BsGithub />
                    </Button>
                    <Button className={'btn gap-2 normal-case btn-ghost'}
                        onClick={() => setCurrentTheme(currentTheme == 'dark' ? 'light' : 'dark')}>
                        {currentTheme == 'dark' ? <CgSun /> : <TbMoonStars />}
                    </Button>
                </Navbar.End>
            </Navbar>
        </div>
    )
}


function themeChanger(theme: string) {
    const doc = document.querySelector('html')
    doc.classList.forEach((c) => doc.classList.remove(c))
    document.querySelector('html').classList.add(theme);
    window.ui.toggleTheme(theme);
}

function getThemeSystem() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        return 'dark';
    else
        return 'light';
}