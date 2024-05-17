import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import "./index.css";
import { Input } from "antd";
import { RiSearchLine } from "react-icons/ri";

export const People = () => {
  //importanteeeeeeeeeeeeeeeeeeeeeeeee
  // const divRef = useRef(null);
  // const [customMaxH, setCustomMaxH] = useState("");
  // useEffect(() => {
  //   // Función para obtener la altura del div cuando el componente se monta
  //   const altura = divRef.current.clientHeight;
  //   console.log("altura=", altura);
  //   setCustomMaxH(`${altura}px`);
  // }, []);

  const students = [
    {
      first_name: "Luis",
      sur_name: "Robledo",
      major: "Computer Science",
    },
    {
      first_name: "Armando",
      sur_name: "Estrada",
      major: "Ingeniería Industrial",
    },
    {
      first_name: "Camila",
      sur_name: "Rodriguez",
      major: "Ingeniería Electrónica",
    },
    {
      first_name: "Carolina",
      sur_name: "Valdez",
      major: "Ingeniería Mecatrónica",
    },
    {
      first_name: "Estefano",
      sur_name: "Ramirez",
      major: "Ingeniería Amiental",
    },
    {
      first_name: "Angelina",
      sur_name: "Fernandez",
      major: "Adminstración y Negocios Digitales",
    },
    {
      first_name: "Luis",
      sur_name: "Robledo",
      major: "Computer Science",
    },
    {
      first_name: "Luis",
      sur_name: "Robledo",
      major: "Computer Science",
    },
  ];
  return (
    <div className="w-full" /*ref={divRef}*/>
      <div className="p-4">
        <Input
          size="large"
          placeholder="Buscar estudiantes, profesores, y más..."
          prefix={<RiSearchLine />}
        />
      </div>
      {/* {customMaxH != "" && ( */}
      <div className=" " /*style={{ maxHeight: customMaxH }}*/>
        <div className="w-full  p-4">
          <h1 className="text-[20px] pb-4">Estudiantes</h1>
          <div className="flex flex-row flex-wrap ">
            {students.map((student) => {
              return (
                <Card
                  fname={student.first_name}
                  sname={student.sur_name}
                  major={student.major}
                />
              );
            })}
          </div>
        </div>

        <div className="w-full  p-4">
          <h1 className="text-[20px] pb-4">Profesores</h1>
          <div className="flex flex-row flex-wrap ">
            {students.map((student) => {
              return (
                <Card
                  fname={student.first_name}
                  sname={student.sur_name}
                  major={student.major}
                />
              );
            })}
          </div>
        </div>

        <div className="w-full  p-4">
          <h1 className="text-[20px] pb-4">Psicólogos</h1>
          <div className="flex flex-row flex-wrap ">
            {students.map((student) => {
              return (
                <Card
                  fname={student.first_name}
                  sname={student.sur_name}
                  major={student.major}
                />
              );
            })}
          </div>
        </div>

        <div className="w-full  p-4">
          <h1 className="text-[20px] pb-4">Otros</h1>
          <div className="flex flex-row flex-wrap ">
            {students.map((student) => {
              return (
                <Card
                  fname={student.first_name}
                  sname={student.sur_name}
                  major={student.major}
                />
              );
            })}
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};
