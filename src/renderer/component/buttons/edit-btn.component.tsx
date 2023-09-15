import { Button } from "react-daisyui";
import { AiOutlineEdit } from "react-icons/ai";

export function EditButtonComponent() {
  return (
    <Button
      shape={"square"}
      size={"xs"}
      className={
        "bg-[#e2e2e2] hover:bg-[#d3d2d2] dark:bg-[#383838] hover:dark:bg-[#323232] border-none text-center"
      }
    >
      <AiOutlineEdit className={"dark:text-gray-600 text-gray-800"} size={15} />
    </Button>
  );
}
