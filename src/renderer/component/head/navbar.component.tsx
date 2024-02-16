import { IoClose } from 'react-icons/io5'
import { VscChromeMinimize } from 'react-icons/vsc'
import { BsDiscord, BsGithub } from 'react-icons/bs'

import { Button, Navbar, Tooltip } from 'react-daisyui'
import { useEffect, useState } from 'react'
import { FiWifiOff } from 'react-icons/fi'

export function NavbarComponent() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)
  useEffect(() => {
    window.addEventListener('offline', function (e) {
      setIsOnline(false)
    })
    window.addEventListener('online', function (e) {
      setIsOnline(true)
    })
  }, [])
  return (
    <div>
      <Navbar className="dark:bg-[#262626] bg-base-200 navbar">
        <Navbar.Start className={'pl-5'}>
          <h1 className={'text-2xl mt-1 font-[balooTamma] text-[#75767c]'}>DNS Changer</h1>
        </Navbar.Start>
        <Navbar.End>
          <div className=" rounded-3xl flex  gap-1 flex-row-reverse">
            <Button
              color="ghost"
              size="sm"
              className="hover:bg-red-600 hover:text-gray-100"
              onClick={() => {
                window.ipc.close()
              }}>
              <IoClose />
            </Button>
            <Button
              color="ghost"
              size="sm"
              onClick={() => {
                window.ipc.minimize()
              }}>
              <VscChromeMinimize />
            </Button>

            <Button
              color="ghost"
              size="sm"
              className="text-[#616161] hover:text-current"
              onClick={() => window.ipc.openBrowser('https://discord.gg/p9TZzEV39e')}>
              <BsDiscord />
            </Button>
            <Button
              color="ghost"
              size="sm"
              className="text-[#616161] hover:text-current"
              onClick={() => window.ipc.openBrowser('https://github.com/DnsChanger/dnsChanger-desktop')}>
              <BsGithub />
            </Button>

            {!isOnline && (
              <Button color="ghost" size="sm" className="text-[#c54444]">
                <Tooltip message={'check your network connection status'} position={'bottom'} className="normal-case">
                  <FiWifiOff />
                </Tooltip>
              </Button>
            )}
          </div>
        </Navbar.End>
      </Navbar>
    </div>
  )
}
