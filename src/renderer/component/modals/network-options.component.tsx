import React, { useEffect, useState } from "react";

import { setState } from "../../interfaces/react.interface";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dialog,
  Typography,
} from "@material-tailwind/react";
import { Select } from "react-daisyui";

interface Props {
  isOpen: boolean;
  setIsOpen: setState<boolean>;
  cb: (val: any) => void;
}

export function NetworkOptionsModalComponent(props: Props) {
  const handleOpen = () => props.setIsOpen((cur) => !cur);
  const [network, setNetwork] = useState<string>();
  const [networkAdapters, setNetworkAdapters] = useState<string[]>([]);
  const [currentNetwork, setCurrentNetwork] = useState<string>("Auto");
  useEffect(() => {
    if (props.isOpen) {
      window.ipc.getNetworkInterface().then((d) => {
        setCurrentNetwork(d);

        const interfaces = window.os.getInterfaces();
        const networks = [...Object.keys(interfaces)];
        networks.unshift("Auto");

        setNetworkAdapters(networks);
      });
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (network) window.ipc.setNetworkInterface(network).catch();
  }, [network]);

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
        <CardHeader className="bg-[#7487FF] mb-0 grid h-12 place-items-center ">
          <Typography
            variant="h3"
            color="white"
            className={"font-[balooTamma]"}
          >
            Network Options
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className={"grid"}>
            <div>
              <div className="label">
                <span className="label-text text-lg font-normal ">
                  Network interface
                </span>
              </div>

              <div>
                <Select onChange={(value) => setNetwork(value.target.value)}>
                  {networkAdapters.map((item) => (
                    <Select.Option
                      value={item}
                      selected={item == currentNetwork}
                    >
                      {item}
                    </Select.Option>
                  ))}
                </Select>
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
