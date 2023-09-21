import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
  Badge,
} from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import { Button as ButtonDaisyui } from "react-daisyui";
import { AiOutlineDelete } from "react-icons/ai";
import { TbInfoHexagon } from "react-icons/tb";
import { serversContext } from "../../context/servers.context";
import { ServersContext } from "../../interfaces/servers-context.interface";
import { appNotif } from "../../notifications/appNotif";

export function DeleteButtonComponent() {
  const [open, setOpen] = useState(false);
  const serversStateContext = useContext<ServersContext>(serversContext);
  const server = serversStateContext.selected;
  const handleOpen = () => setOpen(!open);

  const handleDelete = async () => {
    if (
      server.key == serversStateContext.currentActive?.key &&
      server.name == server.name
    ) {
      setOpen(false);
      appNotif("Error", "cannot delete the active server");
      return;
    }

    const response = await window.ipc.deleteDns(server);
    setOpen(false);
    appNotif("Success", `${server.name} Deleted!`, "SUCCESS");
    serversStateContext.setSelected(null);
    serversStateContext.setServers(response.servers);
    if (serversStateContext.currentActive) {
      serversStateContext.setSelected(serversStateContext.currentActive);
    }
  };
  if (!server) return null;
  return (
    <>
      <ButtonDaisyui
        shape={"circle"}
        size={"sm"}
        className={
          "dark:bg-[#262626] bg-base-200 hover:bg-[#c4c4c4] hover:dark:bg-[#323232] border-none text-center"
        }
        onClick={handleOpen}
      >
        <AiOutlineDelete
          className={"dark:text-gray-600 text-gray-800"}
          size={16}
        />
      </ButtonDaisyui>
      <Dialog
        open={open}
        handler={handleOpen}
        size="sm"
        className={"font-[balooTamma] dark:bg-[#282828] "}
      >
        <DialogHeader className={"ml-1 gap-6 justify-center"}>
          <Badge
            content={<TbInfoHexagon size={20} />}
            overlap="square"
            color={"red"}
          ></Badge>
          <Typography
            variant="h5"
            color="blue-gray"
            className={"font-[balooTamma] dark:text-gray-200"}
          >
            Attention Required
          </Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4 ">
          <Typography className="text-center font-normal font-[balooTamma] text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the server{" "}
            <strong>{server.name}</strong>?
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpen}>
            Close
          </Button>
          <Button variant="gradient" color={"red"} onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
