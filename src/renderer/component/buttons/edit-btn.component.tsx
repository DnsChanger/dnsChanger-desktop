import { Button } from "react-daisyui";
import { AiOutlineEdit } from "react-icons/ai";

export function EditButtonComponent() {
  return (
    <Button
      shape={"square"}
      size={"sm"}
      className={
        "bg-[#d8d8d8] hover:bg-[#c4c4c4] dark:bg-[#383838] hover:dark:bg-[#323232] border-none text-center"
      }
    >
      <AiOutlineEdit className={"dark:text-gray-600 text-gray-800"} size={16} />
    </Button>
  );
}
