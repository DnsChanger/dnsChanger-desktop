import { Button } from "react-daisyui";
import { CiPower } from "react-icons/ci";
import { useContext } from "react";
import { serversContext } from "@/renderer/context/servers.context";

export function ConnectButtonComponent() {
  const serversStateContext = useContext(serversContext);

  if (serversStateContext.currentActive) {
    //isConnect
    return (
      <div>
        <Button
          onClick={() => serversStateContext.setCurrentActive(null)}
          shape={"circle"}
          className="bg-[#378C40]  outline -outline-offset-2 outline-8 outline-[#378c4040] hover:bg-[#297030]"
          style={{ width: 130, height: 130 }}
        >
          <CiPower size={60} />
        </Button>
        <div className={"mt-5 font-[balooTamma] text-2xl "}>Connected</div>
      </div>
    );
  } else
    return (
      <div>
        <Button
          onClick={() => serversStateContext.setCurrentActive({} as any)}
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
