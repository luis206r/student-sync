import { Menu } from "antd";
import React from "react";
import "./index.css";
export const Home = () => {
  const items = [
    {
      key: "1",
      label: "Tu resumen",
    },
    {
      key: "2",
      label: "Calendario",
    },
    {
      key: "3",
      label: "Reportes",
    },
    {
      key: "4",
      label: "Tareas",
    },
  ];

  const items2 = [
    {
      key: "1",
      label: "option1",
    },
    {
      key: "2",
      label: "option2",
    },
    {
      key: "3",
      label: "option3",
    },
    {
      key: "4",
      label: "option4",
    },
  ];

  return (
    <div className=" w-full flex flex-col h-full text-textcol-1">
      <div className="w-full p-4 ">
        <div className="p-4 bg-cach-l1 rounded-[15px]">
          <div className="w-full flex flex-row">
            <div className="w-[15%] text-[24px] flex items-center pl-2">
              Student<b>Collab</b>
            </div>
            <div className="w-[70%]">
              {/* <div className="w-full flex flex-row items-center justify-center ">
                <div className="pl-2 pr-2">option1</div>
                <div className="pl-2 pr-2">option1</div>
                <div className="pl-2 pr-2">option1</div>
              </div> */}
              <div className="w-full flex flex-row items-center justify-center">
                <Menu
                  style={{
                    fontSize: "18px",
                    backgroundColor: "transparent",
                    borderBottom: "none",
                  }}
                  defaultSelectedKeys={["1"]}
                  //defaultOpenKeys={['sub1']}
                  mode="horizontal"
                  items={items2}
                />
              </div>
            </div>
            <div className="w-[15%] ">
              <div className="flex w-full h-full justify-end items-center pr-4">
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
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
          Resumen
        </div>
      </div>
    </div>
  );
};
