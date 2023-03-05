import React, { useState } from "react";
import { Button, Input, Modal } from "react-daisyui";
import { setState } from "../../interfaces/react.interface";
import { Label } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    isOpen: boolean
    setIsOpen: setState<boolean>
    cb: (val: any) => void
}

export function AddDnsModalComponent(props: Props) {
    const [serverName, setServerName] = useState<string>("");
    const [nameServer1, setNameServer1] = useState<string>("");
    const [nameServer2, setNameServer2] = useState<string>("");

    async function addHandler() {
        if (!serverName || !nameServer1)
            return;
        const resp = await window.ipc.addDns({
            name: serverName,
            nameServers: [nameServer1, nameServer2]
        })

        if (resp.success) {
            window.ipc.notif(`سرور  ${serverName} با موفقیت اضافه شد.`)
            setNameServer1("")
            setNameServer2("")
            setServerName("")
            props.setIsOpen(false)
            props.cb(resp.server)
        } else
            window.ipc.notif(resp.message)
    }

    return (
        <React.Fragment>
            <Modal open={props.isOpen}>
                <Modal.Header className="font-bold">
                    افزودن سرور (DNS) دلخواه
                </Modal.Header>
                <Modal.Body>
                    <div className={"grid"}>
                        <div>
                            <Label className="label">
                                <span className="label-text">نام سرور</span>
                            </Label>
                            <Input type={"text"} className={"w-full max-w-xs"} placeholder={"custom server..."}
                                dir={"auto"} name={"dns_name"}
                                value={serverName}
                                onChange={(e) => setServerName(e.target.value)}
                            />
                        </div>
                        <div className={""}>
                            <Label className="label">
                                <span className="label-text">آدرس سرور</span>
                            </Label>
                            <div className={"gap-2 grid grid-cols-4"} dir={"ltr"}>
                                <div>
                                    <Input type={"text"} className={""} placeholder={"name server 1 ..."}
                                        name={"first_server"}
                                        value={nameServer1}
                                        onChange={(e) => setNameServer1(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Input type={"text"} className={""} placeholder={"name server 2 ..."}
                                        name={"sec_server"}
                                        value={nameServer2}
                                        onChange={(e) => setNameServer2(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Actions>
                    <Button onClick={() => addHandler()} shape={"circle"} color={"success"}>
                        <FontAwesomeIcon icon={"plus"} />
                    </Button>
                    <Button onClick={() => props.setIsOpen(false)} shape={"circle"} color={"error"}>
                        <FontAwesomeIcon icon={"window-close"} />
                    </Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    )
}
