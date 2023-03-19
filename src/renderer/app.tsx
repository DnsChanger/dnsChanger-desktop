import React, { useEffect, useState } from "react";
import { BottomNavigation } from "react-daisyui"


import { activityContext } from './context/activty.context';
import { Server } from "../shared/interfaces/server.interface";
import { ServersComponent } from "./component/servers/servers";
import { NavbarComponent } from "./component/head/navbar.component";
import {
    ServerListOptionsDropDownComponent
} from './component/dropdowns/serverlist-options/serverlist-options.component';
import { serversContext } from './context/servers.context';
import { HiOutlineShieldCheck } from "react-icons/hi"
import { TbCloudDataConnection } from "react-icons/tb"
import { RiSettings3Line } from "react-icons/ri"
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home.page";

export function App() {


    return (
        <div>
            <Routes >
                <Route path="/main_window/*">
                    <Route index element={<HomePage />} />
                </Route>
            </Routes>
        </div>
    )
}

