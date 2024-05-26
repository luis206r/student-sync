import React, { useRef, useState } from "react";
import { Input, Button, Typography, Select } from "antd";
import { CiUser, CiLock, CiMail } from "react-icons/ci";

import { Link, useLocation, useNavigate } from "react-router-dom";
import useInput from "../../Utils/useInput";
import axios from "axios";
import validarEmail from "../../Utils/validateEmail";
const { Link: AntdLink } = Typography;
let it = 0;

export const Register = () => {
  const { state } = useLocation();
  const name = useInput(state.name);
  const lastName = useInput(state.lastname);
  const email = useInput(state.email);
  //const password = useInput();
  //const repeatedPassword = useInput();
  const navigate = useNavigate();

  const userTypeOptions = [
    { value: "student", label: "Estudiante" },
    { value: "teacher", label: "Profesor" },
    { value: "psycho", label: "Psicólogo" },
    { value: "other", label: "Otro" },
  ];

  /*
  - Ingenería Civil. Diseno y construcc
medioarnbienle.
• Ingenerfa Electrårvca. Manejo y desar
• Ingenerfa Industnal. Diseno. oplirrliz
- Inqerlieria Artlåierual. ESIudio de los p
ingenjeria viable: que irnpulsen la co
- Ingermeria de lu Ervergiu_ Creacjön de
- Irygerveria tvlecaLrår1ica_ Integra de for
sobre Sisternas usadOS en la industria y
- ia Quirrvca. DiserhO y elaboraci
- Irvaerliæria Vecérlica_ DiSf2hO. desarroll
rnås altas tecnologias_
- 3i01ruerveria. Aplicaciån de IOS princ
biOIogia corno base CienIlTica_
- Ardrrlirmstraclört v Negocjas C)igta'es,
emprendirnienlo.
- Ciertcva de Ia Cornvutacvön. Creacjön
- Caervaa de Dalcs, Anålisis de grand
inforrnaciån generada por una empr
  */
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
  // const registerRequest = async (email, password, name, lastName) => {
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:8000/api/users/register",
  //       {
  //         name: name,
  //         lastname: lastName,
  //         email: email,
  //         password: password,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     if (res.status === 201) {
  //       //ejecutar seteo de redux en Layout
  //       alert("usuario registrado exitosamente");
  //       navigate("/login");
  //     } else {
  //       console.error("Error en la solicitud:", res.data);
  //       alert("Algo salió mal...");
  //     }
  //   } catch (error) {
  //     console.error("Error al realizar la solicitud:", error);
  //     alert("Solicitud fallida...");
  //   }
  // };

  //================================================================

  //==========================back request===========================
  const registerGoogleRequest = async (
    email,
    name,
    lastName,
    profileImageUrl,
    role,
    major
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
    };
    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/googleRegister",
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
    if (
      name.value != "" &&
      lastName.value != "" &&
      userType != "" &&
      major.length != 0
    ) {
      if (
        (userType == "teacher" && course.length != 0) ||
        (userType == "psycho" && spec.value != "") ||
        (userType == "other" && area.value != "") ||
        userType == "student"
      )
        //registerRequest(email.value, password.value, name.value, lastName.value);
        registerGoogleRequest(
          state.email,
          name.value,
          lastName.value,
          state.profileImageUrl,
          userType,
          major
        );
    } else {
      alert("verifica los datos ingresados");
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
            disabled
            size="large"
            placeholder="Email"
            type="email"
            prefix={<CiMail />}
            style={{ marginTop: "6px", marginBottom: "6px" }}
            {...email}
          />
          {/* <Input
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
          /> */}

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
