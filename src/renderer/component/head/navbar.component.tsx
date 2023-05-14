import { BsDiscord, BsGithub } from "react-icons/bs";

import { Button, Navbar } from "react-daisyui";

export function NavbarComponent() {
  return (
    <div>
      <Navbar>
        <Navbar.Start></Navbar.Start>
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
