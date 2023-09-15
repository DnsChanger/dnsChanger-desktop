import toast from "react-hot-toast";
import { BiErrorAlt } from "react-icons/bi";
import { TiInputChecked } from "react-icons/ti";

export function appNotif(
  title: string,
  msg: string,
  type: "SUCCESS" | "ERROR" = "ERROR"
) {
  const audio = new Audio("./sounds/error-sound.mp3");
  audio.volume = 0.3;
  audio.play().catch();
  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-[#CCCCCC] dark:bg-[#262626] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {type == "SUCCESS" ? (
                <TiInputChecked size={50} className={"text-green-500"} />
              ) : (
                <BiErrorAlt size={50} className={"text-red-500"} />
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium ">{title}</p>
              <p className="mt-1 text-sm dark:text-gray-500 text-gray-600">
                {msg}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
    }
  );
}
