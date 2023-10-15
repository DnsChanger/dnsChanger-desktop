import React, { useContext, useEffect, useState } from "react";

import { setState } from "../../interfaces/react.interface";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
} from "@material-tailwind/react";
import { Select } from "react-daisyui";
import { ServersContext } from "../../interfaces/servers-context.interface";
import { serversContext } from "../../context/servers.context";
import { settingStore } from "../../app";

interface Props {
  isOpen: boolean;
  setIsOpen: setState<boolean>;
  cb: (val: any) => void;
}

export function NetworkOptionsModalComponent(props: Props) {
  const { setNetwork, network } = useContext<ServersContext>(serversContext);

  const handleOpen = () => props.setIsOpen((cur) => !cur);

  const [loading, setLoading] = useState<boolean>(true);

  const [networkInterface, setNetworkInterfaceInterface] = useState<string>();

  const [networkAdapters, setNetworkAdapters] = useState<string[]>([]);

  useEffect(() => {
    if (props.isOpen) {
      const current = window.storePreload.get("settings").network_interface;

      setNetwork(current);

      window.os
        .getInterfaces()
        .then((interfaces) => {
          const networks = interfaces.map((d) => d.name);
          networks.unshift("Auto");
          setNetworkAdapters(networks);
        })
        .finally(() => setLoading(false));
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (networkInterface) {
      settingStore.network_interface = networkInterface;
      window.ipc.saveSettings(settingStore).catch();

      setNetwork(networkInterface);
    }
  }, [networkInterface]);

  return (
    <Dialog
      size="lg"
      open={props.isOpen}
      handler={handleOpen}
      animate={{
        mount: { y: 0 },
        unmount: { y: 25 },
      }}
      className="bg-transparent shadow-none "
    >
      <Card className="mx-auto w-80 dark:bg-[#282828]">
        <div className="mb-0 p-2 bg-[#f2f2f2] dark:bg-[#262626] dark:text-gray-400 rounded-t-2xl  place-items-center flex flex-row justify-between">
          <div className="ml-3 font-[balooTamma] text-1xl">Network Options</div>
        </div>
        <CardBody className="flex flex-col">
          <div className={"grid"}>
            <div>
              <div className="label">
                <span className="label-text text-lg font-normal ">
                  Network Interface
                </span>
              </div>

              <div>
                {loading ? (
                  <div className={"flex flex-row gap-2"}>
                    <span className="loading loading-ring loading-xs"></span>
                    fetching interfaces...
                  </div>
                ) : (
                  <Select
                    onChange={(value) =>
                      setNetworkInterfaceInterface(value.target.value)
                    }
                  >
                    {networkAdapters.map((item) => (
                      <Select.Option value={item} selected={item == network}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="pt-0 flex flex-row gap-2">
          <Button
            variant="text"
            className="normal-case font-[balooTamma] text-xl flex-1"
            color="red"
            onClick={handleOpen}
          >
            Close
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
