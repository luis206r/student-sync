import { Button, Menu } from "antd";
import React, { useState } from "react";
import "./index.css";
import { Resume } from "./Resume";
import { Calendar } from "./Calendar";
import { Reports } from "./Reports";
import { Tasks } from "./Tasks";
import { GoChevronRight } from "react-icons/go";
import { GoChevronLeft } from "react-icons/go";
import { PiStudent } from "react-icons/pi";
import { PiCalendar } from "react-icons/pi";
import { TbClipboardText } from "react-icons/tb";
import { FaTasks } from "react-icons/fa";
import { CgTime } from "react-icons/cg";
import { Events } from "./Events";
import { HiOutlineMenu } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

export const Auto = () => {
  const user = useSelector((state) => state.user);
  const [option, setOption] = useState("resume");
  const onClick = (e) => {
    setOption(e.key);
  };
  const items = [
    {
      key: "resume",
      label: "Tu resumen",
      icon: <PiStudent className="p-0 m-0" />,
    },
    {
      key: "calendar",
      label: "Calendario",
      icon: <PiCalendar />,
    },
    {
      key: "reports",
      label: "Reportes",
      icon: <TbClipboardText />,
    },
    {
      key: "tasks",
      label: "Tareas",
      icon: <FaTasks />,
    },
    {
      key: "events",
      label: "Eventos",
      icon: <CgTime />,
    },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="w-full pr-4 pl-4 pb-4 flex flex-row">
      <div className={`w-full ml-2 bg-cach-l1 p-4 rounded-[15px]`}>
        <Routes>
          <Route path="/resume" element={<Resume />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/events" element={<Events />} />
          <Route path="/*" element={<>404 Not found</>} />
        </Routes>
      </div>
    </div>
  );
};
