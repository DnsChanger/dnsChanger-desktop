import { MdOutlineAddModerator } from "react-icons/md";
import { Button } from "react-daisyui";
import { useContext, useState } from "react";
import { AddDnsModalComponent } from "../modals/add-dns.component";
import { serversContext } from "../../context/servers.context";
import { BsHddNetwork } from "react-icons/bs";
import { NetworkOptionsModalComponent } from "../modals/network-options.component";

export function InterfacesDialogButtonComponent() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const serversStateContext = useContext(serversContext);

  function toggleOpenModal() {
    setIsOpenModal(!isOpenModal);
  }

  return (
    <div>
      <Button
        shape={"square"}
        size={"sm"}
        onClick={toggleOpenModal}
        className={
          "bg-[#e2e2e2] hover:bg-[#d3d2d2] dark:bg-[#383838] hover:dark:bg-[#323232]  border-none text-center"
        }
      >
        <BsHddNetwork
          className={"dark:text-gray-600 text-gray-700"}
          size={16}
        />
      </Button>
      <NetworkOptionsModalComponent
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        cb={(va) => {
          serversStateContext.servers.push(va);
          serversStateContext.setServers([...serversStateContext.servers]);
        }}
      />
    </div>
  );
}
