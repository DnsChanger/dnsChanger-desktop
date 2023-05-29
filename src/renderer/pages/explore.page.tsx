import React, { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { Server } from "@/shared/interfaces/server.interface";
import { UrlsConstant } from "@/shared/constants/urls.constant";
import { Button } from "react-daisyui";
import { getPingIcon } from "@/renderer/utils/icons.util";

export function ExplorePage() {
  const TABLE_HEAD = ["Name", "Address", "Ping", "-"];
  const [TABLE_ROWS, SetTableRow] = useState<Server[]>([]);
  const [storeServers, setStoreServers] = useState<Server[]>([]);

  useEffect(() => {
    async function fetchDnsList() {
      const response = await window.ipc.fetchDnsList();
      setStoreServers(response.servers);
    }

    async function updateHandler() {
      try {
        const response = await axios.get<Server[]>(UrlsConstant.STORE);
        const servers = response.data.sort((a, b) => b.rate - a.rate);
        SetTableRow(servers);
      } catch (error) {}
    }
    fetchDnsList().then(() => updateHandler());
  }, []);

  return (
    <div className="hero flex flex-col justify-center items-center">
      <h1 className={"font-[balooTamma] text-4xl"}>Explore</h1>
      <div className="flex flex-col items-start gap-4 py-0 ">
        <div className="dark:bg-[#262626] bg-base-200 p-4 rounded-lg shadow w-[670px] h-[250px] overflow-auto overflow-y-auto">
          <table className="mt-4 w-full min-w-max table-auto  text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="  p-4">
                    <p className="font-normal leading-none opacity-70">
                      {head}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((server, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-gray-800";
                return (
                  <ServerTrComponent
                    server={server}
                    classes={classes}
                    storeServers={storeServers}
                    setStoreServer={setStoreServers}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface Prop {
  server: Server;
  classes: string;
  storeServers: Server[];
  setStoreServer: any;
}
function ServerTrComponent(prop: Prop) {
  const { avatar, name, key, servers } = prop.server;
  const storeServers = prop.storeServers;
  const [ping, setPing] = useState<number>(0);
  useEffect(() => {
    window.ipc
      .ping(prop.server)
      .then((res) => res.success && setPing(res.data.time));
  }, []);

  async function DeleteHandler() {
    const response = await window.ipc.deleteDns(prop.server);
    if (response.success) {
      prop.setStoreServer(response.servers);
    }
  }

  async function AddToListHandler() {
    const response = await window.ipc.addDns(prop.server);
    if (response.success) {
      prop.setStoreServer(response.servers);
    }
  }

  return (
    <tr>
      <td className={prop.classes}>
        <div className="flex items-center gap-3">
          <Avatar
            src={`./servers-icon/${avatar}`}
            alt={name}
            size="xs"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = "./servers-icon/def.png";
            }}
          />
          <div className="flex flex-col">
            <p className="font-normal font-light text-sm dark:text-white truncate w-32">
              {name}
            </p>
          </div>
        </div>
      </td>
      <td className={prop.classes}>
        <div className="flex flex-col">
          <p className="font-normal font-light text-sm dark:text-white truncate w-52 opacity-70">
            {servers.join(" , ")}
          </p>
        </div>
      </td>
      <td className={prop.classes}>
        <div className="w-max flex flex-row gap-2 opacity-70">
          <span className={"mt-1"}>{getPingIcon(ping)}</span>
          <p> {!Number(ping) ? 0 : ping}</p>
        </div>
      </td>
      <td className={prop.classes}>
        {storeServers.find((ser) => ser.key == key) ? (
          <Button
            size={"xs"}
            className={
              "normal-case bg-[#a5242485] hover:bg-[#891717d1] border-none"
            }
            onClick={DeleteHandler}
          >
            Remove
          </Button>
        ) : (
          <Button
            size={"xs"}
            className={
              "normal-case bg-[#3fa67573] hover:bg-[#2d9d67d1] hover:text-white text-[#63C873] border-none"
            }
            onClick={AddToListHandler}
          >
            Add to list
          </Button>
        )}
      </td>
    </tr>
  );
}
