import React from "react";
import { Input, Button, Typography } from "antd";
import { CiUser, CiLock, CiMail } from "react-icons/ci";

import { Link, useNavigate } from "react-router-dom";
import useInput from "../../Utils/useInput";
import axios from "axios";
import validarEmail from "../../Utils/validateEmail";
const { Link: AntdLink } = Typography;

export const Register = () => {
  const name = useInput();
  const lastName = useInput();
  const email = useInput();
  const password = useInput();
  const repeatedPassword = useInput();
  const navigate = useNavigate();

  //==========================back request===========================
  const registerRequest = async (email, password, name, lastName) => {
    try {
      const res = await axios.post(
        "https://student-sync-back.onrender.com/api/users/register",
        {
          name: name,
          lastname: lastName,
          email: email,
          password: password,
        },
        { withCredentials: true }
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
    e.preventDefault();
    if (
      password.value === repeatedPassword.value &&
      validarEmail(email.value) &&
      name.value != "" &&
      lastName.value != ""
    ) {
      registerRequest(email.value, password.value, name.value, lastName.value);
    } else {
      alert("verifica los datos ingresados");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center bg-cach-l1 w-[350px] p-4 rounded-[15px]">
        <div className="p-4 text-textcol-1 text-[36px]">
          <h1>
            <b>Sing Up</b>
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center pt-8 w-[300px]">
          <Input
            size="large"
            placeholder="Nombres"
            prefix={<CiUser />}
            style={{ marginBottom: "6px" }}
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
