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

export const Auto = () => {
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
      <div className={`w-[${collapsed ? "70px" : "20%"}] mr-2`}>
        <div className="bg-cach-l1 rounded-[15px] p-2">
          <div className="w-full justify-end flex p-0 pb-0 mb-0">
            <Button
              className="pl-2 pr-2 pb-0 pt-0 ml-0 rounded-[10px]"
              type="text"
              onClick={toggleCollapsed}
              style={{
                marginBottom: 0,
              }}
            >
              {collapsed ? (
                <GoChevronRight className="text-[20px]" />
              ) : (
                <GoChevronLeft className="text-[20px]" />
              )}
            </Button>
          </div>
          <Menu
            className=" bg-transparent "
            style={{
              borderRight: "none",
              borderTop: "none",
            }}
            defaultSelectedKeys={["resume"]}
            inlineCollapsed={collapsed}
            //defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
            onClick={onClick}
          />
        </div>
      </div>
      <div className={`w-full ml-2 bg-cach-l1 p-4 rounded-[15px]`}>
        {option == "resume" && <Resume />}
        {option == "calendar" && <Calendar />}
        {option == "reports" && <Reports />}
        {option == "tasks" && <Tasks />}
        {option == "events" && <Events />}
      </div>
    </div>
  );
};
