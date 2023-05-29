import {
  MdOutlineSignalCellularAlt,
  MdOutlineSignalCellularAlt1Bar,
  MdOutlineSignalCellularAlt2Bar,
} from "react-icons/md";

export function getPingIcon(ping: number): JSX.Element {
  switch (true) {
    case ping <= 100:
      return <MdOutlineSignalCellularAlt className={"mt-0.5 text-[#40CF4E]"} />;
    case ping <= 180:
      return (
        <MdOutlineSignalCellularAlt2Bar className={"mt-0.5 text-[#A6893F]"} />
      );
    default:
      return (
        <MdOutlineSignalCellularAlt1Bar className={"mt-0.5 text-[#A63F3F]"} />
      );
  }
}
