import React from "react";

export const Card = ({ fname, sname, major, profileImageUrl, onClick }) => {
  const cuttedFName = fname.length > 20 ? fname.substr(0, 17) + "..." : fname;
  const cuttedSName = sname.length > 15 ? sname.substr(0, 12) + "..." : sname;
  let smajor;
  const arrayMajor = major.split(",");
  if (typeof arrayMajor === "array") smajor = arrayMajor[0];
  else smajor = major;
  smajor =
    smajor === "cs"
      ? "Computer Science"
      : smajor === "civil"
      ? "Ingenería Civil"
      : smajor === "industrial"
      ? "Ingenería Industrial"
      : smajor === "enviromental"
      ? "Ingenería Ambiental"
      : smajor === "energy"
      ? "Ingenería de la Energía"
      : smajor === "mecatronic"
      ? "Ingenería Mecatrónica"
      : smajor === "chemical"
      ? "Ingenería Química"
      : smajor === "mecanic"
      ? "Ingenería Mecánica"
      : smajor === "bio"
      ? "Bioingeniería"
      : smajor === "administration"
      ? "Administración y Negocios Digitales"
      : smajor === "ds"
      ? "Ciencia de Datos"
      : smajor === "is"
      ? "Sistemas de la Información"
      : smajor;
  const cuttedMajor =
    smajor.length > 22 ? smajor.substr(0, 19) + "..." : smajor;
  return (
    <div
      className="w-[168px] h-[208px] m-2 p-4 flex flex-col justify-center items-center bg-[#E8E8E8] rounded-[10px] shadow-md"
      onClick={onClick}
    >
      <div className="h-[70%] ">
        <img
          src={`${profileImageUrl ? profileImageUrl : "/profileImage.png"}`}
          className="w-[100px] rounded-[50%]"
        />
      </div>
      <div className="flex items-center justify-center flex-col">
        <p className=" text-black">{cuttedFName}</p>
        <p className=" text-black">{cuttedSName}</p>
        <p className="text-[13px]">{cuttedMajor}</p>
      </div>
    </div>
  );
};

export default Card;
