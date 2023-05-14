import React from "react";
import ReactDOM from "react-dom/client";

declare const VERSION: string;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(LoadingCom());

function LoadingCom() {
  const notes: string[] = [
    "این برنامه به  صورت متن باز  می باشد.",
    "برای استفاده بهینه از این برنامه، آخرین ورژن مرورگر خود را داشته باشید.",
    "شما میتونید سرور دلخواه خود را اضافه کنید.",
  ];
  const note = notes[Math.floor(Math.random() * notes.length)];
  return (
    <div
      dir="rtl"
      className="flex flex-col overflow  gap-5 justify-center items-center h-screen py-5"
    >
      <div className="loader"></div>
      <div className="text-center">
        <h1 className="text-1xl font-bold text-gray-200 w-60">{note}</h1>
      </div>
      <div>
        <p
          className="text-sm  mt-2 animate-pulse"
          style={{ color: " #fff3cd" }}
        >
          در حال بارگذاری ...
        </p>
      </div>
      <div className="absolute top-[350px]">
        <p className="text-smmt-2 text-gray-50 text-opacity-70">
          {getVersion()}
        </p>
      </div>
    </div>
  );
}

function getVersion() {
  let versionToDisplay = "unknown";
  try {
    versionToDisplay = VERSION;
  } catch (error) {
  } finally {
    return versionToDisplay;
  }
}
