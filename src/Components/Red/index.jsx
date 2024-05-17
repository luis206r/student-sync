import { Menu } from "antd";
import React, { useState } from "react";
import { Feed } from "./Feed";
import { People } from "./People";
import { Groups } from "./Groups";
export const Red = () => {
  const [option, setOption] = useState("feed");
  const onClick = (e) => {
    setOption(e.key);
  };
  const items = [
    {
      key: "feed",
      label: "Feed",
    },
    {
      key: "people",
      label: "Personas",
    },
    {
      key: "groups",
      label: "Grupos",
    },
  ];

  return (
    <div className="w-full pr-4 pl-4 pb-4 flex flex-row">
      <div className="w-[20%] mr-2  ">
        <div className="bg-cach-l1 rounded-[15px] p-2">
          <Menu
            style={{
              width: "100%",
              backgroundColor: "transparent",
              borderRight: "none",
            }}
            defaultSelectedKeys={["feed"]}
            //defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
            onClick={onClick}
          />
        </div>
      </div>
      <div className="w-[80%] h-auto ml-2 bg-cach-l1 p-4 rounded-[15px]">
        {option == "feed" && <Feed />}
        {option == "people" && <People />}
        {option == "groups" && <Groups />}
      </div>
    </div>
  );
};
