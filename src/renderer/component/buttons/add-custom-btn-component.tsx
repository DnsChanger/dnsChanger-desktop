import { MdOutlineAddModerator } from "react-icons/md";
import { Button } from "react-daisyui";
import { useContext, useState } from "react";
import { AddDnsModalComponent } from "../modals/add-dns.component";
import { serversContext } from "../../context/servers.context";

export function AddCustomBtnComponent() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const serversStateContext = useContext(serversContext);

  function toggleOpenModal() {
    setIsOpenModal(!isOpenModal);
  }

  return (
    <div>
      <Button
        shape={"circle"}
        size={"sm"}
        onClick={toggleOpenModal}
        className={"bg-[#B3B3B3] dark:bg-[#383838] border-none text-center"}
      >
        <MdOutlineAddModerator className={"text-gray-700"} />
      </Button>
      <AddDnsModalComponent
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
