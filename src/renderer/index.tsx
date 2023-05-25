import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";
import { Button } from "react-daisyui";
import "./index.css";
// eslint-disable-next-line import/no-unresolved

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App/>);
