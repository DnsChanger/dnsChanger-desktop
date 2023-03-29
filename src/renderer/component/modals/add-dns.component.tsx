import React, { useState } from 'react';
import { MdAddModerator } from 'react-icons/md';
import { Button, Input, Modal } from 'react-daisyui';

import { setState } from '../../interfaces/react.interface';
import { useI18nContext } from '../../../i18n/i18n-react';

interface Props {
    isOpen: boolean
    setIsOpen: setState<boolean>
    cb: (val: any) => void
}

export function AddDnsModalComponent(props: Props) {
    const [serverName, setServerName] = useState<string>('');
    const [nameServer1, setNameServer1] = useState<string>('');
    const [nameServer2, setNameServer2] = useState<string>('');
    const { LL } = useI18nContext()

    async function addHandler() {
        if (!serverName || !nameServer1)
            return;

        const resp = await window.ipc.addDns({
            name: serverName,
            nameServers: [nameServer1, nameServer2]
        })

        if (resp.success) {
            window.ipc.notif(LL.dialogs.added_server({ serverName: serverName }));

            setNameServer1('');
            setNameServer2('');
            setServerName('');

            props.setIsOpen(false);
            props.cb(resp.server);
        } else {
            window.ipc.notif(resp.message)
        }
    }

    return (
        <React.Fragment>
            <Modal open={props.isOpen}>
                <Modal.Header className='font-bold'>
                    {LL.buttons.favDnsServer()}
                </Modal.Header>
                <Button
                    size='sm'
                    shape='circle'
                    className='absolute right-2 top-2'
                    onClick={() => props.setIsOpen(false)}
                >
                    ✕
                </Button>
                <Modal.Body>
                    <div className={'grid'}>
                        <div>
                            <div className='label'>
                                <span className='label-text text-lg'>{LL.pages.addCustomDns.NameOfServer()}</span>
                            </div>
                            <Input type={'text'} className={'w-full max-w-xs'} placeholder={'custom server...'}
                                dir={'auto'} name={'dns_name'}
                                value={serverName}
                                onChange={(e) => setServerName(e.target.value)}
                            />
                        </div>
                        <div className={''}>
                            <div className='label'>
                                <span className='label-text text-lg'>{LL.pages.addCustomDns.serverAddr()}</span>
                            </div>
                            <div className={'gap-2 grid grid-cols-1'} dir={'ltr'}>
                                <div>
                                    <Input type={'text'} className={''} placeholder={'name server 1 ...'}
                                        name={'first_server'}
                                        value={nameServer1}
                                        onChange={(e) => setNameServer1(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Input type={'text'} className={''} placeholder={'name server 2 ...'}
                                        name={'sec_server'}
                                        value={nameServer2}
                                        onChange={(e) => setNameServer2(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Actions className='float-right'>
                    <Button onClick={() => addHandler()} color={'success'}>
                        <MdAddModerator className='mr-2' />
                        {LL.buttons.add()}
                    </Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}
