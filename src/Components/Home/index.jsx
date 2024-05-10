import { Menu } from "antd";
import React, { useState } from "react";
import "./index.css";
import { Resume } from "./Resume";
import { Calendar } from "./Calendar";
import { Reports } from "./Reports";
import { Tasks } from "./Tasks";

export const Home = () => {
  const [option, setOption] = useState("resume");
  const onClick = (e) => {
    setOption(e.key);
  };
  const items = [
    {
      key: "resume",
      label: "Tu resumen",
    },
    {
      key: "calendar",
      label: "Calendario",
    },
    {
      key: "reports",
      label: "Reportes",
    },
    {
      key: "tasks",
      label: "Tareas",
    },
    {
      key: "events",
      label: "Eventos",
    },
  ];

  return (
    <div className="w-full h-full pr-4 pl-4 pb-4 flex flex-row">
      <div className="w-[20%] mr-2 bg-cach-l1 rounded-[15px]">
        <div className="p-4">
          <Menu
            style={{
              width: "100%",
              backgroundColor: "transparent",
              borderRight: "none",
            }}
            defaultSelectedKeys={["resume"]}
            //defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
            onClick={onClick}
          />
        </div>
      </div>
      <div className="w-[80%] ml-2 bg-cach-l1 p-4 rounded-[15px]">
        {option == "resume" && <Resume />}
        {option == "calendar" && <Calendar />}
        {option == "reports" && <Reports />}
        {option == "tasks" && <Tasks />}
      </div>
    </div>
  );
};
