import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "../Navbar";
import { Auto } from "../Auto";
import { Red } from "../Red";
import { Explore } from "../Explore";
import { Health } from "../Health";

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { RightMenu } from "../RightMenu";

export const Layout = ({ collapsed }) => {
  const location = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <div className="w-full h-full">
      {location && (
        <div
          className={`${!collapsed ? "md:pl-[192px]" : "md:pl-[62px]"}
           w-full h-full flex flex-col text-textcol-1 md:pt-[78px] pt-[50px]`}
        >
          {/* <div className="w-full flex flex-row items-center justify-between p-4 pt-0 md:hidden ">
            <Button type="primary" shape="round" activ>
              Resume
            </Button>
          </div> */}
          <Routes>
            <Route path="/auto/*" element={<Auto />} />
            <Route path="/red/*" element={<Red />} />
            <Route path="/explore/*" element={<Explore />} />
            <Route path="/health/*" element={<Health />} />
            <Route path="/*" element={<>404 Not found</>} />
          </Routes>
        </div>
      )}
    </div>
  );
};
