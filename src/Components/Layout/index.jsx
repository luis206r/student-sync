import React, { useState } from "react";
import { Navbar } from "../Navbar";
import { Home } from "../Home";
import { Red } from "../Red";
import { Explore } from "../Explore";
import { More } from "../More";

export const Layout = ({ option }) => {
  const [l_option, setLOption] = useState(option);
  const changeOption = (newOption) => {
    setLOption(newOption);
  };

  return (
    <div className=" w-full h-full flex flex-col text-textcol-1">
      <Navbar />
      {option === "home" && <Home />}
      {option === "red" && <Red />}
      {option === "explore" && <Explore />}
      {option === "more" && <More />}
      {/*
        <div className="w-full h-full pr-4 pl-4 pb-4 flex flex-row">
        <div className="w-[20%] mr-2 bg-cach-l1 rounded-[15px]">
          <div className="p-4">
            <Menu
              style={{
                width: "100%",
                backgroundColor: "transparent",
                borderRight: "none",
              }}
              defaultSelectedKeys={["1"]}
              //defaultOpenKeys={['sub1']}
              mode="inline"
              items={items}
            />
          </div>
        </div>
        <div className="w-[80%] ml-2 bg-cach-l1 p-4 rounded-[15px]">
        </div>
      </div>
    </div>
            */}
    </div>
  );
};
