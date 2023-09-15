import React, { useState } from "react";

import { setState } from "../../interfaces/react.interface";
import { useI18nContext } from "../../../i18n/i18n-react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  Input,
  Typography,
} from "@material-tailwind/react";

interface Props {
  isOpen: boolean;
  setIsOpen: setState<boolean>;
  cb: (val: any) => void;
}

export function AddDnsModalComponent(props: Props) {
  const [serverName, setServerName] = useState<string>("");
  const [nameServer1, setNameServer1] = useState<string>("");
  const [nameServer2, setNameServer2] = useState<string>("");
  const { LL } = useI18nContext();
  const handleOpen = () => props.setIsOpen((cur) => !cur);
  async function addHandler() {
    try {
      if (!serverName || !nameServer1) return;
      const resp = await window.ipc.addDns({
        name: serverName,
        servers: [nameServer1, nameServer2],
      });

      if (resp.success) {
        window.ipc.notif(LL.dialogs.added_server({ serverName: serverName }));

        setNameServer1("");
        setNameServer2("");
        setServerName("");

        props.setIsOpen(false);
        props.cb(resp.server);
      } else {
        window.ipc.notif(resp.message);
      }
    } catch (e) {}
  }
  return (
    <Dialog
      size="lg"
      open={props.isOpen}
      handler={handleOpen}
      className="bg-transparent shadow-none font-[balooTamma]"
    >
      <Card className="mx-auto w-80 dark:bg-[#282828]">
        <CardHeader className="bg-[#7487FF] mb-0 grid h-12 place-items-center ">
          <Typography
            variant="h3"
            color="white"
            className={"font-[balooTamma]"}
          >
            Custom Server
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className={"grid"}>
            <div>
              <div className="label">
                <span className="label-text text-lg">
                  {LL.pages.addCustomDns.NameOfServer()}
                </span>
              </div>
              <Input
                type={"text"}
                className={"w-full max-w-xs dark:text-gray-400"}
                dir={"auto"}
                label={"custom server..."}
                name={"dns_name"}
                value={serverName}
                maxLength={10}
                crossOrigin
                onChange={(e) => setServerName(e.target.value)}
              />
            </div>
            <div className={""}>
              <div className="label">
                <span className="label-text text-lg">
                  {LL.pages.addCustomDns.serverAddr()}
                </span>
              </div>
              <div className={"gap-2 grid grid-cols-1"} dir={"ltr"}>
                <div>
                  <Input
                    type={"text"}
                    className={"dark:text-gray-400"}
                    label={"name server 1 ..."}
                    name={"first_server"}
                    value={nameServer1}
                    crossOrigin
                    onChange={(e) => setNameServer1(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type={"text"}
                    className={"dark:text-gray-400"}
                    label={"name server 2 (optional)..."}
                    name={"sec_server"}
                    value={nameServer2}
                    crossOrigin
                    onChange={(e) => setNameServer2(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            className="normal-case bg-[#7487FF] font-[balooTamma] text-xl "
            onClick={addHandler}
            fullWidth
          >
            Add
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
