import { Menu } from "antd";
import React from "react";
export const Explore = () => {
  // const items = [
  //   {
  //     key: "1",
  //     label: "Organizaciones",
  //   },
  //   {
  //     key: "2",
  //     label: "Charlas",
  //   },
  //   {
  //     key: "3",
  //     label: "Eventos",
  //   },
  //   {
  //     key: "4",
  //     label: "Otros",
  //   },
  // ];

  return (
    <div className="w-full pr-4 pl-4 pb-4 flex flex-row">
      {/* <div className="w-[20%] mr-2">
        <div className="bg-cach-l1 rounded-[15px] p-2">
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
      </div> */}
      <div className="w-[80%] ml-2 bg-cach-l1 p-4 rounded-[15px] shadow-custom">
        Próximamente
      </div>
    </div>
  );
};
