import { useEffect, useState } from 'react';
import { PageWrapper } from '../Wrappers/pages.wrapper';
import { serversContext } from '../context/servers.context';
import { activityContext } from '../context/activty.context';
import { ServersComponent } from '../component/servers/servers';
import { Server } from '../../shared/interfaces/server.interface';
import {
    ServerListOptionsDropDownComponent
} from '../component/dropdowns/serverlist-options/serverlist-options.component';
import { useI18nContext } from '../../i18n/i18n-react';
import { HiOutlineShieldCheck } from 'react-icons/hi';

export function HomePage() {
    const [currentActive, setCurrentActive] = useState<Server | null>(null);
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('');
    const [serversState, setServers] = useState<Server[]>([]);

    const { LL, locale } = useI18nContext()

    const values = {
        isWaiting,
        setIsWaiting,
        status,
        setStatus
    }

    useEffect(() => {
        async function fetchDnsList() {
            const response = await window.ipc.fetchDnsList();
            setServers(response.servers);
        }

        fetchDnsList();
    }, []);
    useEffect(() => {
        async function getCurrentActive() {
            const response = await window.ipc.getCurrentActive();
            if (response.success)
                setCurrentActive(response.server);
        }

        getCurrentActive()
    }, [])
    return (
        <PageWrapper>
            <activityContext.Provider value={values}>
                <div className='hero'>
                    <div
                        className='px-0 sm:p-4 hero-content text-center max-w-[400px]   mb-1 '>
                        <div className='max-w-full sm:pt-[100px] sm:pb-[100px] sm:pr-[30px] sm:pl-[30px] p-1'>
                            <div className={'grid justify-center mb-10'} dir='auto'>
                                <h1 className='text-3xl font-bold mb-2'>
                                    {LL.pages.home.homeTitle()}
                                </h1>

                                <div className='gap-2 items-center h-2'>
                                    {
                                        currentActive &&
                                        <div className='text-green-500 flex flex-row gap-1 justify-center'>
                                            <HiOutlineShieldCheck style={{ display: 'inline' }} className='mt-1' />
                                            {
                                                currentActive.key == 'unknown'
                                                    ? <span> {LL.pages.home.unknownServer()}</span>
                                                    :
                                                    <p dangerouslySetInnerHTML={{ __html: LL.pages.home.connectedHTML({ currentActive: currentActive.names.eng }) }}></p>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>

                            <serversContext.Provider value={{ servers: serversState, setServers }}>

                                <div className={'border border-y-gray-500 border-x-0 rounded-2xl  shadow-2xl px-1'}>
                                    <div className='mt-2 flex flex-grow gap-2 mb-0 top-1'
                                        dir={"auto"}>
                                        <ServerListOptionsDropDownComponent />
                                    </div>
                                    <div className={'card items-center card-body'}>
                                        <div className={'overflow-y-auto'}>
                                            <div className={'grid h-[200px] w-[350px] p-2 '}>
                                                <ServersComponent currentActive={currentActive}
                                                    setCurrentActive={setCurrentActive} />
                                            </div>
                                        </div>
                                        <div dir='auto'>
                                            {status && <p className='text-red-400 absolute bottom-[10px] right-2 animate-pulse'>
                                                {status}
                                            </p>
                                            }
                                        </div>
                                    </div>
                                </div>

                            </serversContext.Provider>
                        </div>
                    </div>
                </div>
            </activityContext.Provider>
        </PageWrapper>
    )
}
