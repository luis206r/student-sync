import { Button, Menu } from "antd";
import React, { useState } from "react";
import { Feed } from "./Feed";
import { People } from "./People";
import { Groups } from "./Groups";
import { HiOutlineMenu } from "react-icons/hi";
import { BsPersonFill } from "react-icons/bs";
import { BsFillPeopleFill } from "react-icons/bs";
import { LuAlignStartVertical } from "react-icons/lu";
import "./index.css";
export const Red = () => {
  const [option, setOption] = useState("people");
  const onClick = (e) => {
    setOption(e.key);
  };
  const items = [
    {
      key: "people",
      label: "Personas",
      icon: <BsPersonFill />,
    },
    {
      key: "feed",
      label: "Feed",
      icon: <LuAlignStartVertical />,
    },

    {
      key: "groups",
      label: "Grupos",
      icon: <BsFillPeopleFill />,
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
            style={{
              width: "100%",
              backgroundColor: "transparent",
              borderRight: "none",
            }}
            defaultSelectedKeys={["people"]}
            inlineCollapsed={collapsed}
            //defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
            onClick={onClick}
          />
        </div>
      </div>
      <div className={`w-full ml-2 bg-cach-l1 p-4 rounded-[15px]`}>
        {option == "people" && <People />}
        {option == "feed" && <Feed />}
        {option == "groups" && <Groups />}
      </div>
    </div>
  );
};
