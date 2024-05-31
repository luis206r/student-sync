import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import { Auto } from "../Auto";
import { Red } from "../Red";
import { Explore } from "../Explore";
import { Health } from "../Health";

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";

export const Layout = ({ collapsed }) => {
  const location = useLocation().pathname;
  const navigate = useNavigate();

  // const items1 = [
  //   {
  //     key: "/home/auto/resume",
  //     label: <Link to={"auto/resume"}>Tu resumen</Link>,
  //     icon: <PiStudent className="p-0 m-0" />,
  //   },
  //   {
  //     key: "/home/auto/calendar",
  //     label: <Link to={"auto/calendar"}>Calendario</Link>,
  //     icon: <PiCalendar />,
  //   },
  //   {
  //     key: "/home/auto/reports",
  //     label: <Link to={"auto/reports"}>Reporte</Link>,
  //     icon: <TbClipboardText />,
  //   },
  //   {
  //     key: "/home/auto/tasks",
  //     label: <Link to={"auto/tasks"}>Tareas</Link>,
  //     icon: <FaTasks />,
  //   },
  //   {
  //     key: "/home/auto/events",
  //     label: <Link to={"auto/events"}>Eventos</Link>,
  //     icon: <CgTime />,
  //   },
  // ];

  // const items2 = [
  //   {
  //     key: "/home/red/people",
  //     label: <Link to={"red/people"}>Personas</Link>,
  //     icon: <BsPersonFill />,
  //   },
  //   {
  //     key: "/home/red/feed",
  //     label: <Link to={"red/feed"}>Feed</Link>,
  //     icon: <LuAlignStartVertical />,
  //   },
  //   {
  //     key: "/home/red/groups",
  //     label: <Link to={"red/groups"}>Grupos</Link>,
  //     icon: <BsFillPeopleFill />,
  //   },
  // ];

  return (
    <div className="w-full">
      <div className="h-[94px] w-full"></div>

      {location && (
        <div
          className={`${!collapsed ? "md:pl-[192px]" : "md:pl-[62px]"}
           w-full h-full flex flex-col text-textcol-1`}
        >
          {/* <div className="w-full flex flex-row items-center justify-between p-4 pt-0 md:hidden ">
            <Button type="primary" shape="round" activ>
              Resume
            </Button>
          </div> */}
          <Routes>
            <Route path="/auto/*" element={<Auto />} />
            <Route path="/red/*" element={<Red />} />
            <Route path="/explore/*" element={<Explore />} />
            <Route path="/health/*" element={<Health />} />
            <Route path="/*" element={<>404 Not found</>} />
          </Routes>
        </div>
      )}
    </div>
  );
};
