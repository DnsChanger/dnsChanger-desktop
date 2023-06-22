import { BsDiscord, BsGithub } from "react-icons/bs";
import { FiWifi, FiWifiOff } from "react-icons/fi";

import { Button, Navbar, Toast, Tooltip } from "react-daisyui";
import { useEffect, useState } from "react";

export function NavbarComponent() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  useEffect(() => {
    window.addEventListener("offline", function (e) {
      setIsOnline(false);
    });
    window.addEventListener("online", function (e) {
      setIsOnline(true);
    });
  }, []);
  return (
    <div>
      <Navbar>
        <Navbar.Start className={"pl-5"}>
          {!isOnline && (
            <Tooltip
              message={"check your network connection status"}
              position={"right"}
            >
              <FiWifiOff />
            </Tooltip>
          )}
        </Navbar.Start>
        <Navbar.End>
          <Button
            className={"btn gap-2 normal-case btn-ghost"}
            onClick={() =>
              window.ipc.openBrowser("https://discord.gg/p9TZzEV39e")
            }
          >
            <BsDiscord />
          </Button>
          <Button
            className={"btn gap-2 normal-case btn-ghost"}
            onClick={() =>
              window.ipc.openBrowser(
                "https://github.com/DnsChanger/dnsChanger-desktop"
              )
            }
          >
            <BsGithub />
          </Button>
        </Navbar.End>
      </Navbar>
    </div>
  );
}
