import React, { useEffect, useState } from "react";
import { Avatar, Button, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineNotifications } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";

import { TbLogout } from "react-icons/tb";

export const Navbar = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const [currentOption, setCurrentOption] = useState("");
  const items2 = [
    {
      key: "home",
      label: "Inicio",
    },
    {
      key: "red",
      label: "Red",
    },
    {
      key: "explore",
      label: "Explora",
    },
    {
      key: "more",
      label: "Más",
    },
  ];

  useEffect(() => {
    const key = pathname.substring(1);
    setCurrentOption(key);
  }, [pathname]);

  const onClickOption = (e) => {
    //console.log(items2[parseInt(e.key) - 1].value);
    //const newOptionSelected = items2[parseInt(e.key) - 1].value;
    //changeValue(newOptionSelected);
    setCurrentOption(e.key);
    navigate(`/${e.key}`);
  };
  return (
    <div className="w-full p-4 ">
      <div className="p-4 bg-cach-l1 rounded-[15px]">
        <div className="w-full flex flex-row">
          <div className="w-[15%] text-[24px] flex items-center pl-2">
            Student<b className="text-[#1677ff]">Collab</b>
          </div>
          <div className="w-[70%]">
            {/* <div className="w-full flex flex-row items-center justify-center ">
                <div className="pl-2 pr-2">option1</div>
                <div className="pl-2 pr-2">option1</div>
                <div className="pl-2 pr-2">option1</div>
              </div> */}
            <div className="w-full ">
              <Menu
                className="w-full justify-center text-[18px] bg-[transparent]"
                style={{
                  borderBottom: "none",
                }}
                selectedKeys={[currentOption]}
                mode="horizontal"
                items={items2}
                onClick={onClickOption}
              />
            </div>
          </div>
          <div className="w-[15%]">
            <div className="flex w-full h-full justify-end items-center pr-4">
              <Button
                type="link"
                size="large"
                icon={<BiMessageDetail className="text-[22px]" />}
              />
              <Button
                type="link"
                size="large"
                icon={<MdOutlineNotifications className="text-[25px]" />}
              />
              &nbsp; &nbsp;
              <Avatar
                style={{
                  backgroundColor: "#ff7b3b",
                  verticalAlign: "middle",
                }}

                //gap={gap}
              >
                Luis
              </Avatar>
              {/* &nbsp; &nbsp;
              <Button
                type="link"
                size="large"
                icon={<TbLogout className="text-[25px]" />}
              /> */}
              {/* <Button
                type="primary"
                size="large"
                icon={<TbLogout className="text-[30px]" />}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
