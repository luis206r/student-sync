import React from "react";

export const Card = ({ fname, sname, major }) => {
  const cuttedFName = fname.length > 20 ? fname.substr(0, 17) + "..." : fname;
  const cuttedSName = sname.length > 15 ? sname.substr(0, 12) + "..." : sname;
  const cuttedMajor = major.length > 22 ? major.substr(0, 19) + "..." : major;
  return (
    <div className="w-[168px] h-[208px] m-2 p-4 flex flex-col justify-center items-center bg-[#E8E8E8] rounded-[10px]">
      <div className="h-[70%] ">
        <div className="w-[90px] h-[90px] rounded-[50%] bg-[black]"></div>
      </div>
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-[18px] text-black">{cuttedFName}</h1>
        <h1 className="text-[18px] text-black">{cuttedSName}</h1>
        <h2 className="text-[13px]">{cuttedMajor}</h2>
      </div>
    </div>
  );
};

export default Card;
