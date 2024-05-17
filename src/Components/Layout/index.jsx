import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import { Auto } from "../Auto";
import { Red } from "../Red";
import { Explore } from "../Explore";
import { Health } from "../Health";

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

export const Layout = () => {
  const location = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {location && (
        <div className=" w-full h-full flex flex-col text-textcol-1 ">
          <Routes>
            <Route path="/" element={<Auto />} />
            <Route path="/auto" element={<Auto />} />
            <Route path="/red" element={<Red />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/health" element={<Health />} />
          </Routes>
        </div>
      )}
    </div>
  );
};
