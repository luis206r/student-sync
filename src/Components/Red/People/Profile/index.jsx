import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { GoChevronLeft } from "react-icons/go";

export const Profile = ({ info, showFunc }) => {
  const handleBack = () => {
    showFunc(false);
  };
  const [major, setMajor] = useState("");
  const [from, setFrom] = useState("");

  useEffect(() => {
    let smajor = info[`${info.role}Info`].major;
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
    setMajor(smajor);

    // Verificar si info.createdAt es una fecha válida
    const createdAtDate = new Date(info.createdAt);
    if (!isNaN(createdAtDate.getTime())) {
      // Si es válida, establecer la fecha en el estado
      setFrom(createdAtDate);
    }
  }, []); // Se ejecuta solo una vez después de montar el componente

  return (
    <div className="w-full">
      <div>
        <Button
          type="text"
          onClick={handleBack}
          shape="circle"
          className="flex items-center justify-center"
        >
          <GoChevronLeft className="text-[20px]" />
        </Button>
      </div>
      <div className="w-full p-4 flex flex-col items-center">
        <img src={info.profileImageUrl} className="w-[200px] rounded-[50%]" />
        <div className="p-4">
          <div className="flex items-center justify-center">
            <h2 className="pb-0 mb-0">{info.name}</h2> &nbsp; &nbsp;
            <h2>{info.lastname}</h2>
          </div>
          <div className="max-w-[250px] flex items-center justify-center p-2">
            <p>{major}</p>
          </div>
          <div className="flex items-center justify-center flex-col">
            <p>{info.email}</p>
            <p>{from ? `Miembro desde ${from.toLocaleDateString()}` : "?"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};