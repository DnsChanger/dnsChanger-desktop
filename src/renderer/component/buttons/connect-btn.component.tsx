import { Button } from "react-daisyui";
import { CiPower } from "react-icons/ci";
import { useContext, useState } from "react";
import { serversContext } from "@/renderer/context/servers.context";
import { AiOutlineLoading } from "react-icons/ai";

enum statusStep {
  CONNECTED,
  DISCONNECT,
}

export function ConnectButtonComponent() {
  const serversStateContext = useContext(serversContext);
  const [loading, setLoading] = useState<boolean>(false);
  async function clickHandler(step: statusStep) {
    if (loading) return;
    setLoading(true);
    if (step == statusStep.CONNECTED) {
      // req disconnect
      const response = await window.ipc.clearDns();
      if (response.success) {
        serversStateContext.setCurrentActive(null);
        window.ipc.notif(response.message);
      } else window.ipc.dialogError("Error", response.message);
    } else if (step == statusStep.DISCONNECT && serversStateContext.selected) {
      // req connect
      const response = await window.ipc.setDns(serversStateContext.selected);
      if (response.success) {
        serversStateContext.setCurrentActive(serversStateContext.selected);
        window.ipc.notif(response.message);
      } else {
        window.ipc.dialogError("Error", response.message);
      }
    }

    setLoading(false);
  }

  //loading buttons
  if (loading) {
    if (serversStateContext.currentActive) {
      //disconnecting
      return (
        <div>
          <div
            className="bg-[#BB3D3D]  outline -outline-offset-2 outline-8 outline-[#8c37373b] rounded-[70px]"
            style={{ width: 130, height: 130 }}
          >
            <AiOutlineLoading
              size={60}
              className={"absolute spinner bottom-20 left-9"}
            />
          </div>
          <div className={"mt-5 font-[balooTamma] text-1xl "}>
            Disconnecting...
          </div>
        </div>
      );
    } else {
      //connecting
      return (
        <div>
          <div
            className="bg-[#63A76A]  outline -outline-offset-2 outline-8 outline-[#378c4040] rounded-[70px]"
            style={{ width: 130, height: 130 }}
          >
            <AiOutlineLoading
              size={60}
              className={"absolute spinner bottom-20 left-9"}
            />
          </div>
          <div className={"mt-5 font-[balooTamma] text-1xl "}>
            Connecting...
          </div>
        </div>
      );
    }
  } else {
    if (serversStateContext.currentActive) {
      //isConnect
      return (
        <div>
          <Button
            onClick={() => clickHandler(statusStep.CONNECTED)}
            shape={"circle"}
            className="bg-[#378C40]  outline -outline-offset-2 outline-8 outline-[#378c4040] hover:bg-[#297030]"
            style={{ width: 130, height: 130 }}
          >
            <CiPower size={60} />
          </Button>
          <div className={"mt-5 font-[balooTamma] text-2xl "}>Connected</div>
        </div>
      );
    } else {
      //disconnect Btn
      return (
        <div>
          <Button
            onClick={() => clickHandler(statusStep.DISCONNECT)}
            shape={"circle"}
            className="relative disconnectedBtn  bg-white  outline -outline-offset-2 outline-8 outline-[#cfcfcf1a] hover:bg-[#D6D6D6] "
            style={{ width: 130, height: 130 }}
          >
            <span className="absolute inset-0 outline-[#cfcfcf1a] outline-8 "></span>
            <CiPower size={60} style={{ transform: "rotate(180deg)" }} />
          </Button>
          <div className={"mt-5 font-[balooTamma] text-2xl "}>Disconnect</div>
        </div>
      );
    }
  }
}
