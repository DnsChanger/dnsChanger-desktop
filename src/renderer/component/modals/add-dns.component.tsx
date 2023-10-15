import React, { useState } from "react";

import { setState } from "../../interfaces/react.interface";
import { useI18nContext } from "../../../i18n/i18n-react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  Input,
} from "@material-tailwind/react";
import { appNotif } from "../../notifications/appNotif";

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
        appNotif(
          "Success",
          LL.dialogs.added_server({ serverName: serverName }),
          "SUCCESS"
        );
        setNameServer1("");
        setNameServer2("");
        setServerName("");

        props.setIsOpen(false);
        props.cb(resp.server);
      } else {
        appNotif("Error", resp.message, "ERROR");
      }
    } catch (e) {}
  }
  return (
    <Dialog
      size="lg"
      open={props.isOpen}
      handler={handleOpen}
      className="bg-transparent shadow-none "
    >
      <Card className="mx-auto w-80 dark:bg-[#282828]">
        <div className="mb-0 p-2 bg-[#f2f2f2] dark:bg-[#262626] dark:text-gray-400 rounded-t-2xl  place-items-center flex flex-row justify-between">
          <div className="ml-3 font-[balooTamma] text-1xl">Custom Server</div>
        </div>

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
                color="indigo"
                className={"w-full max-w-xs text-gray-400"}
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
                    color="indigo"
                    className={"dark:text-gray-400"}
                    label={"Preferred DNS server.."}
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
                    color="indigo"
                    label={"Alternate DNS server (optional)..."}
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
        <CardFooter className="pt-0 flex flex-row gap-2">
          <Button
            variant="text"
            className="normal-case font-[balooTamma] text-xl"
            color="red"
            onClick={handleOpen}
          >
            Close
          </Button>
          <Button
            variant="gradient"
            color={"green"}
            className={
              "flex-1  normal-case bg-[#7487FF] font-[balooTamma] text-xl "
            }
            onClick={addHandler}
          >
            Add
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
