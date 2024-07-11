import { Button, Menu } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Feed } from "./Feed";
import { People } from "./People";
import { Groups } from "./Groups";
import { HiOutlineMenu } from "react-icons/hi";
import { BsPersonFill } from "react-icons/bs";
import { BsFillPeopleFill } from "react-icons/bs";
import { LuAlignStartVertical } from "react-icons/lu";
import "./index.css";
import { useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import { Profile } from "./People/Profile";
import { RightMenu } from "../RightMenu";
import { Chats } from "./Chats";

// Combinar los dos arreglos sin duplicados basados en el ID

export const Red = () => {
  const location = useLocation();
  const [ch, setCh] = useState("");
  const [inFeed, setInFeed] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("/home/red/chats")) setCh("full");
    else setCh("fit");
    if (location.pathname === "/home/red/feed") setInFeed(true);
    else setInFeed(false);
  }, [location]);
  return (
    <div className="w-full md:pr-4 md:pl-4 md:pb-4 flex flex-row h-full">
      <div className={` w-full flex  md:flex-row flex-col-reverse h-full`}>
        <div className="w-full md:pr-2 h-full">
          <div
            className={` w-full md:ml-2 md:mr-2 ${
              !inFeed ? "bg-cach-l1 md:pt-4 shadow-custom" : "md:pt-0"
            }  md:p-4 md:rounded-[15px] h-${ch} `}
          >
            <Routes>
              <Route path="/people" element={<People />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/chats/*" element={<Chats />} />
              <Route path="/profile/:pUserId" element={<Profile />} />
              <Route path="/*" element={<>404 Not found</>} />
            </Routes>
          </div>
        </div>

        {!location.pathname.includes("/home/red/chats") && (
          <div
            className={`hidden md:flex md:w-[260px]   md:ml-2 md:rounded-[15px] h-fit relative`}
          >
            <div className="hidden md:h-full  md:flex md:flex-col md:w-full md:mb-4">
              <RightMenu />
            </div>
            {/*  */}
          </div>
        )}
      </div>
    </div>
  );
};
