import { Button, Navbar } from "react-daisyui";
import react, { useEffect, useState } from 'react';
import { CgSun } from "react-icons/cg"
import { GiMoonBats } from "react-icons/gi"
import { BsGithub } from "react-icons/bs"
export function NavbarComponent() {
    const [currentTheme, setCurrentTheme] = useState(
        localStorage.getItem("theme") || "system"
    );

    useEffect(() => {
        if (currentTheme === "system") {
            themeChanger(getThemeSystem());
        } else {
            themeChanger(currentTheme);
        }
        localStorage.setItem("theme", currentTheme);
    }, [currentTheme]);
    return (
        <div>
            <Navbar >
                <Navbar.Start></Navbar.Start>
                <Navbar.End>
                    <Button className={"btn gap-2 normal-case btn-ghost"}
                        onClick={() => setCurrentTheme(currentTheme == "dark" ? "light" : "dark")}>
                        {currentTheme == "dark" ? <CgSun /> : <GiMoonBats />}
                    </Button>
                    <Button className={"btn gap-2 normal-case btn-ghost"}
                        onClick={() => window.ipc.openBrowser("https://github.com/DnsChanger/dnsChanger-desktop")}>
                        <BsGithub />
                    </Button>
                </Navbar.End>
            </Navbar>
        </div>
    )
}


function themeChanger(theme: string) {
    // @ts-ignore
    document.querySelector("html").setAttribute("data-theme", theme);
    console.log(theme)
    window.ui.toggleTheme(theme)
}
function getThemeSystem() {
    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        return "dark";
    } else return "light";
}