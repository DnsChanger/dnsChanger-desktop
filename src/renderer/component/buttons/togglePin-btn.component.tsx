import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
  Badge,
} from "@material-tailwind/react";
import React, { useContext, useEffect, useState } from "react";
import { Button as ButtonDaisyui } from "react-daisyui";
import { AiOutlineDelete } from "react-icons/ai";
import { TbInfoHexagon } from "react-icons/tb";
import { serversContext } from "../../context/servers.context";
import { ServersContext } from "../../interfaces/servers-context.interface";
import { appNotif } from "../../notifications/appNotif";
import { BsPin, BsPinFill } from "react-icons/bs";

export function ToggleButtonComponent() {
  const serversStateContext = useContext<ServersContext>(serversContext);
  const server = serversStateContext.selected;
  const [isPin, setIsPin] = useState<boolean>();

  useEffect(() => {
    if (serversStateContext.selected)
      setIsPin(serversStateContext.selected.isPin);
  }, [serversStateContext.selected]);

  if (!server) return null;

  async function handleClick() {
    const res = await window.ipc.togglePinServer(server);
    if (res.success) {
      server.isPin = !server.isPin;
      setIsPin(server.isPin);
      console.log(server.isPin);
      serversStateContext.setServers(res.servers);
    }
  }

  return (
    <>
      <ButtonDaisyui
        shape={"circle"}
        size={"sm"}
        className={
          "dark:bg-[#262626] bg-base-200 hover:bg-[#c4c4c4] hover:dark:bg-[#323232] border-none text-center"
        }
        onClick={handleClick}
      >
        {isPin ? (
          <BsPinFill className={"dark:text-gray-600 text-gray-800"} size={16} />
        ) : (
          <BsPin className={"dark:text-gray-600 text-gray-800"} size={16} />
        )}
      </ButtonDaisyui>
    </>
  );
}
