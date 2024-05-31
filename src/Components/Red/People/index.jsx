import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import "./index.css";
import { Input } from "antd";
import { RiSearchLine } from "react-icons/ri";
import axios from "axios";
import { Link } from "react-router-dom";
import { Profile } from "./Profile";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

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

  const handleCardClick = (student) => {
    setProfileInfo(student);
    setSelectedUser(true);
  };

  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [psychos, setPsychos] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [others, setOthers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(false);
  const [profileInfo, setProfileInfo] = useState({});

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

  if (selectedUser)
    return (
      <div>
        <Profile info={profileInfo} showFunc={setSelectedUser} />
      </div>
    );
  else
    return (
      <div className="w-full" /*ref={divRef}*/>
        <div className="md:p-4">
          <Input
            size="large"
            placeholder="Buscar estudiantes, profesores, y más..."
            prefix={<RiSearchLine />}
          />
        </div>
        {/* {customMaxH != "" && ( */}
        <div className=" " /*style={{ maxHeight: customMaxH }}*/>
          <div className="w-full  p-2 md:p-4">
            <h1 className="text-[20px] pb-4">Estudiantes</h1>
            <div className="flex flex-row flex-wrap">
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

          <div className="w-full  p-2 md:p-4">
            <h1 className="text-[20px] pb-4">Profesores</h1>
            <div className="flex flex-row flex-wrap">
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

          <div className="w-full   p-2 md:p-4">
            <h1 className="text-[20px] pb-4">Psicólogos</h1>
            <div className="flex flex-row flex-wrap">
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

          <div className="w-full   p-2 md:p-4">
            <h1 className="text-[20px] pb-4">Otros</h1>
            <div className="flex flex-row flex-wrap ">
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
