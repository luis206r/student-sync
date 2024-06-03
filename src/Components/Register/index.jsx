import React, { useRef, useState } from "react";
import { Input, Button, Typography, Select } from "antd";
import { CiUser, CiLock, CiMail } from "react-icons/ci";

import { Link, useLocation, useNavigate } from "react-router-dom";
import useInput from "../../Utils/useInput";
import axios from "axios";
import validarEmail from "../../Utils/validateEmail";
const { Link: AntdLink } = Typography;
let it = 0;

function validarCorreoUtec(correo, dominio) {
  if (correo === "student.collab.app@gmail.com") return true;
  // Escapamos el punto para que se tome literalmente en la expresión regular
  const dominioRegex = new RegExp(`@${dominio.replace(".", "\\.")}$`, "i");

  // Verificamos si el correo electrónico termina con el dominio especificado
  return dominioRegex.test(correo);
}

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const Register = () => {
  const { state } = useLocation();
  const name = state ? useInput(state.name) : useInput("");
  const lastName = state ? useInput(state.lastname) : useInput("");
  const email = state ? useInput(state.email) : useInput("");
  const password = useInput();
  const repeatedPassword = useInput();
  const navigate = useNavigate();

  const userTypeOptions = [
    { value: "student", label: "Estudiante" },
    { value: "teacher", label: "Profesor" },
    { value: "psycho", label: "Psicólogo" },
    { value: "other", label: "Otro" },
  ];

  const inputRef = useRef(null);
  const inputRef2 = useRef(null);
  const [additionalMajor, setAdditionalMajor] = useState();
  const [additionalCourse, setAdditionalCourse] = useState();
  const [courses, setCourses] = useState([]);
  const [majorOptions, setMajorOptions] = useState([
    { value: "civil", label: "Ingenería Civil" },
    { value: "electronic", label: "Ingenería Electrónica" },
    { value: "industrial", label: "Ingenería Industrial" },
    { value: "enviromental", label: "Ingenería Ambiental" },
    { value: "energy", label: "Ingenería de la Energía" },
    { value: "mecatronic", label: "Ingenería Mecatrónica" },
    { value: "chemical", label: "Ingenería Química" },
    { value: "mecanic", label: "Ingenería Mecánica" },
    { value: "bio", label: "Bioingeniería" },
    { value: "administration", label: "Administración y Negocios Digitales" },
    { value: "cs", label: "Ciencia de la Computación" },
    { value: "ds", label: "Ciencia de Datos" },
    { value: "is", label: "Sistemas de la Información" },
  ]);

  const addItem = (optList, adtItem, setList, setAdtItem, e) => {
    let validItem = true;
    e.preventDefault();
    for (const item of optList) {
      if (item.value === adtItem) {
        alert("¡Agrega otra opción!");
        validItem = false;
        break; // Interrumpe el bucle si se encuentra una coincidencia
      }
    }
    if (validItem) {
      setList([...optList, { value: adtItem, label: adtItem }]);
      setAdtItem("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };
  const changeAddM = (event) => {
    setAdditionalMajor(event.target.value);
  };

  const changeAddC = (event) => {
    setAdditionalCourse(event.target.value);
  };

  const [userType, setUserType] = useState(null);
  const [major, setMajor] = useState([]);
  const [course, setCourse] = useState([]);
  const spec = useInput();

  const area = useInput();

  const onChangetType = (value) => {
    console.log(value);
    setUserType(value);
  };

  const onChangeMajors = (value) => {
    console.log(value);
    setMajor(value);
  };

  const onChangeCourses = (value) => {
    console.log(value);
    setCourse(value);
  };

  //==========================back request===========================
  const registerRequest = async (
    email,
    password,
    name,
    lastName,
    role,
    major
  ) => {
    let props = {
      name: name,
      lastname: lastName,
      email: email,
      isAdmin: email === "luis.robledo@utec.edu.pe" ? true : false,
      role: role,
      courses: role === "teacher" ? course.join(", ") : "",
      area: role === "other" ? area.value : "",
      major: major.join(", "),
      spec: role === "psycho" ? spec.value : "",
      password: password,
    };
    try {
      const res = await axios.post(`${backUrl}/api/users/register`, props, {
        withCredentials: true,
      });

      if (res.status === 201) {
        //ejecutar seteo de redux en Layout
        alert("usuario registrado exitosamente");
        navigate("/login");
      } else {
        console.error("Error en la solicitud:", res.data);
        alert("Algo salió mal...");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      alert("Solicitud fallida...");
    }
  };

  //================================================================

  //==========================back request===========================
  const registerGoogleRequest = async (
    email,
    name,
    lastName,
    profileImageUrl,
    role,
    major,
    password
  ) => {
    let props = {
      name: name,
      lastname: lastName,
      email: email,
      isAdmin: email === "luis.robledo@utec.edu.pe" ? true : false,
      profileImageUrl: profileImageUrl,
      role: role,
      courses: role === "teacher" ? course.join(", ") : "",
      area: role === "other" ? area.value : "",
      major: major.join(", "),
      spec: role === "psycho" ? spec.value : "",
      password: password,
    };
    try {
      const res = await axios.post(
        `${backUrl}/api/users/googleRegister`,
        {
          ...props,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        //ejecutar seteo de redux en Layout
        alert("usuario registrado exitosamente");
        navigate("/login");
      } else {
        console.error("Error en la solicitud:", res.data);
        alert("Algo salió mal...");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      alert("Solicitud fallida...");
    }
  };

  //================================================================

  const onClickRegister = (e) => {
    //e.preventDefault();
    const isUtecAccount = validarCorreoUtec(email.value, "utec.edu.pe");
    if (!isUtecAccount) {
      alert("Correo no válido");
      return;
    }
    if (password.value !== repeatedPassword.value) {
      alert("verifica las contraseñas");
      return;
    } else if (
      name.value != "" &&
      lastName.value != "" &&
      userType != "" &&
      major.length != 0 &&
      password.value != "" &&
      repeatedPassword.value != ""
    ) {
      if (
        (userType == "teacher" && course.length != 0) ||
        (userType == "psycho" && spec.value != "") ||
        (userType == "other" && area.value != "") ||
        userType == "student"
      ) {
        if (!state)
          registerRequest(
            email.value,
            password.value,
            name.value,
            lastName.value,
            userType,
            major
          );
        else
          registerGoogleRequest(
            state.email,
            name.value,
            lastName.value,
            state.profileImageUrl,
            userType,
            major,
            password.value
          );
      } else {
        alert("Completa todo los campos");
        return;
      }
    } else {
      alert("Completa todo los campos");
      return;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center bg-cach-l1 w-[350px] p-4 rounded-[15px]">
        <div className="p-4 text-textcol-1 text-[36px]">
          <h1>Regístrate</h1>
        </div>
        <div className="flex flex-col items-center justify-center pt-8 w-[300px]">
          <Select
            size="large"
            style={{ marginBottom: "6px", width: "100%" }}
            placeholder={"Tipo de usuario"}
            options={userTypeOptions}
            onChange={onChangetType}
          />

          <Select
            size="large"
            onChange={onChangeMajors}
            mode="multiple"
            style={{
              width: "100%",
              marginTop: "6px",
              marginBottom: "6px",
            }}
            placeholder="Carrera(s)"
            dropdownRender={(menu) => (
              <>
                {menu}
                <div className="pt-2 pb-2">
                  <hr />
                </div>
                <div className="flex">
                  <Input
                    placeholder="Otra"
                    ref={inputRef}
                    value={additionalMajor}
                    onChange={changeAddM}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  &nbsp;
                  <Button
                    type="primary"
                    onClick={(e) =>
                      addItem(
                        majorOptions,
                        additionalMajor,
                        setMajorOptions,
                        setAdditionalMajor,
                        e
                      )
                    }
                    shape="circle"
                    style={{ paddingLeft: "0px !important" }}
                  >
                    +
                  </Button>
                </div>
              </>
            )}
            options={majorOptions}
          />

          {userType == "teacher" && (
            <Select
              size="large"
              onChange={onChangeCourses}
              mode="multiple"
              style={{
                width: "100%",
                marginTop: "6px",
                marginBottom: "6px",
              }}
              placeholder="Cursos"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div className="pt-2 pb-2">
                    <hr />
                  </div>
                  <div className="flex">
                    <Input
                      placeholder="Agregar"
                      ref={inputRef2}
                      value={additionalCourse}
                      onChange={changeAddC}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                    &nbsp;
                    <Button
                      type="primary"
                      onClick={(e) =>
                        addItem(
                          courses,
                          additionalCourse,
                          setCourses,
                          setAdditionalCourse,
                          e
                        )
                      }
                      shape="circle"
                      style={{ paddingLeft: "0px !important" }}
                    >
                      +
                    </Button>
                  </div>
                </>
              )}
              options={courses}
            />
          )}

          {userType == "other" && (
            <Input
              size="large"
              placeholder="Area"
              prefix={<CiUser />}
              style={{ marginBottom: "6px" }}
              {...area}
            />
          )}
          {userType == "psycho" && (
            <Input
              size="large"
              placeholder="Epecialización"
              prefix={<CiUser />}
              style={{ marginBottom: "6px" }}
              {...spec}
            />
          )}
          <Input
            size="large"
            placeholder="Nombres"
            prefix={<CiUser />}
            style={{ marginTop: "6px", marginBottom: "6px" }}
            {...name}
          />
          <Input
            size="large"
            placeholder="Apellidos"
            prefix={<CiUser />}
            style={{ marginTop: "6px", marginBottom: "6px" }}
            {...lastName}
          />
          <Input
            disabled={state ? true : false}
            size="large"
            placeholder="Email"
            type="email"
            prefix={<CiMail />}
            style={{ marginTop: "6px", marginBottom: "6px" }}
            {...email}
          />
          <Input
            size="large"
            placeholder="Contraseña"
            type="password"
            prefix={<CiLock />}
            style={{ marginTop: "6px", marginBottom: "6px" }}
            {...password}
          />
          <Input
            size="large"
            placeholder="Confirmar contraseña"
            type="password"
            prefix={<CiLock />}
            style={{ marginTop: "6px" }}
            {...repeatedPassword}
          />

          <div className="pt-6">
            <Button type="primary" size={"large"} onClick={onClickRegister}>
              Registrarme
            </Button>
          </div>
          <div className="p-4">
            <p>
              <Link to="/login">
                <AntdLink>Iniciar Sesión</AntdLink>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
