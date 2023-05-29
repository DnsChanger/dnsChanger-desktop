import React, { useState, useEffect } from "react";
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

export function ExplorePage() {
  const TABLE_HEAD = ["Name", "Address", "Ping", ""];
  const [TABLE_ROWS, SetTableRow] = useState<Server[]>([]);

  useEffect(() => {
    async function updateHandler() {
      try {
        const response = await axios.get<Server[]>(UrlsConstant.STORE);
        const servers = response.data;
        SetTableRow(servers);
      } catch (error) {
      } finally {
      }
    }

    updateHandler();
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
                  <th key={head} className="border-y border-blue-gray-100  p-4">
                    <Typography
                      variant="h6"
                      color="white"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(({ name, key, avatar, servers }, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={key}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={`./servers-icon/${avatar}`}
                          alt={name}
                          size="sm"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "./servers-icon/def.png";
                          }}
                        />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="white"
                            className="font-normal"
                          >
                            {name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="white"
                          className="font-normal"
                        >
                          {servers.join(",")}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max"></div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      ></Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
