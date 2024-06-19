import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import "./index.css";
import { Input } from "antd";
import { RiSearchLine } from "react-icons/ri";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Profile } from "./Profile";
import ReactGA from "react-ga4";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const People = () => {
  const navigate = useNavigate();
  //importanteeeeeeeeeeeeeeeeeeeeeeeee
  // const divRef = useRef(null);
  // const [customMaxH, setCustomMaxH] = useState("");
  // useEffect(() => {
  //   // Función para obtener la altura del div cuando el componente se monta
  //   const altura = divRef.current.clientHeight;
  //   console.log("altura=", altura);
  //   setCustomMaxH(`${altura}px`);
  // }, []);

  const handleCardClick = (student) => {
    const info_ = student;
    navigate(`/home/red/profile/${student.id}`, { state: { info_ } });

    ReactGA.event({
      category: "Click",
      action: "Acceso a perfil de usuario",
      label: "People",
    });
  };

  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [psychos, setPsychos] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [others, setOthers] = useState([]);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/people", title: "personas" });
    ReactGA.event({
      category: "Navegación",
      action: "Acceso a lista de usuarios",
      label: "People",
    });
  }, []);

  //===================back request====================
  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        `${backUrl}/api/users/getAllUsers`,

        { withCredentials: true }
      );
      if (res.status === 200) return res.data;
    } catch (err) {
      console.error(err);
    }
  };
  //===================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await getAllUsers();
        setStudents(result.students);
        setTeachers(result.teachers);
        setPsychos(result.psychos);
        setOthers(result.others);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
        <div className="w-full  p-4 ">
          <h1 className="text-[20px] pb-4">Estudiantes ({students.length})</h1>
          <div className="flex justify-center flex-row flex-wrap">
            {students.map((student) => {
              return (
                <Card
                  key={student.id}
                  fname={student.name}
                  sname={student.lastname}
                  major={student.studentInfo.major}
                  profileImageUrl={student.profileImageUrl}
                  onClick={() => handleCardClick(student)}
                />
              );
            })}
          </div>
        </div>

        <div className="w-full  p-4">
          <h1 className="text-[20px] pb-4">Profesores ({teachers.length})</h1>
          <div className="flex justify-center flex-row flex-wrap">
            {teachers.map((teacher) => {
              return (
                <Card
                  key={teacher.id}
                  fname={teacher.name}
                  sname={teacher.lastname}
                  major={teacher.teacherInfo.major}
                  profileImageUrl={teacher.profileImageUrl}
                  onClick={() => handleCardClick(teacher)}
                />
              );
            })}
          </div>
        </div>

        <div className="w-full  p-4">
          <h1 className="text-[20px] pb-4">Psicólogos ({psychos.length})</h1>
          <div className="flex justify-center flex-row flex-wrap">
            {psychos.map((psycho) => {
              return (
                <Card
                  key={psycho.id}
                  fname={psycho.name}
                  sname={psycho.lastname}
                  major={psycho.psychoInfo.major}
                  profileImageUrl={psycho.profileImageUrl}
                  onClick={() => handleCardClick(psycho)}
                />
              );
            })}
          </div>
        </div>

        <div className="w-full   p-4">
          <h1 className="text-[20px] pb-4">Otros ({others.length})</h1>
          <div className="flex justify-center flex-row flex-wrap ">
            {others.map((other) => {
              return (
                <Card
                  key={other.id}
                  fname={other.name}
                  sname={other.lastname}
                  major={other.otherInfo.major}
                  profileImageUrl={other.profileImageUrl}
                  onClick={() => handleCardClick(other)}
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
