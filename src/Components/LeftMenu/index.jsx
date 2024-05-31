import { Button, Menu } from "antd";
import React, { useEffect, useState } from "react";
import "./index.css";

import { GoChevronRight } from "react-icons/go";
import { GoChevronLeft } from "react-icons/go";
import { PiStudent } from "react-icons/pi";
import { PiCalendar } from "react-icons/pi";
import { TbClipboardText } from "react-icons/tb";
import { FaTasks } from "react-icons/fa";
import { CgTime } from "react-icons/cg";

import { HiOutlineMenu } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { BsFillPeopleFill, BsPersonFill } from "react-icons/bs";
import { LuAlignStartVertical } from "react-icons/lu";

export const LeftMenu = ({ setCollapsed, collapsed }) => {
  const pathname = useLocation().pathname;
  const [pathnameS, setPathnameS] = useState("");
  const user = useSelector((state) => state.user);
  const [option, setOption] = useState("resume");
  const [items, setItems] = useState(null);
  const onClick = (e) => {
    setOption(e.key);
  };

  const items1 = [
    {
      key: "/home/auto/resume",
      label: <Link to={"auto/resume"}>Tu resumen</Link>,
      icon: <PiStudent className="p-0 m-0" />,
    },
    {
      key: "/home/auto/calendar",
      label: <Link to={"auto/calendar"}>Calendario</Link>,
      icon: <PiCalendar />,
    },
    {
      key: "/home/auto/reports",
      label: <Link to={"auto/reports"}>Reporte</Link>,
      icon: <TbClipboardText />,
    },
    {
      key: "/home/auto/tasks",
      label: <Link to={"auto/tasks"}>Tareas</Link>,
      icon: <FaTasks />,
    },
    {
      key: "/home/auto/events",
      label: <Link to={"auto/events"}>Eventos</Link>,
      icon: <CgTime />,
    },
  ];

  const items2 = [
    {
      key: "/home/red/people",
      label: <Link to={"red/people"}>Personas</Link>,
      icon: <BsPersonFill />,
    },
    {
      key: "/home/red/feed",
      label: <Link to={"red/feed"}>Feed</Link>,
      icon: <LuAlignStartVertical />,
    },
    {
      key: "/home/red/groups",
      label: <Link to={"red/groups"}>Grupos</Link>,
      icon: <BsFillPeopleFill />,
    },
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    setPathnameS(pathname);
  }, [pathname]);

  return (
    <div className={`w-[${collapsed ? "70px" : "200px"}]  pl-4 pt-[94px]`}>
      <div className="bg-cach-l1 rounded-[15px] p-2 shadow-lg">
        <div className="w-full justify-start flex  p-0 pb-0 mb-0">
          <Button
            className="pl-2 pr-2 pb-0 pt-0 ml-0 rounded-[10px]"
            type="text"
            onClick={toggleCollapsed}
            style={{
              marginBottom: 0,
            }}
          >
            <HiOutlineMenu className="text-[20px]" />
          </Button>
        </div>

        <Menu
          className=" bg-transparent "
          style={{
            borderRight: "none",
            borderTop: "none",
          }}
          selectedKeys={[pathnameS]}
          inlineCollapsed={collapsed}
          //defaultOpenKeys={['sub1']}
          mode={"vertical"}
          items={pathname.includes("home/auto") ? items1 : items2}
          onClick={onClick}
        />
      </div>
    </div>
  );
};
