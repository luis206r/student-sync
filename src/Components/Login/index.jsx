import React, { useState } from "react";
import { Input, Button, Typography } from "antd";
import { CiMail, CiLock } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const { Link: AntdLink } = Typography;
import useInput from "../../Utils/useInput";
import validarEmail from "../../Utils/validateEmail";

export const Login = () => {
  const navigate = useNavigate();
  const email = useInput();
  const password = useInput();

  const onClickLogin = (e) => {
    e.preventDefault();
    if (validarEmail(email.value) && password.value !== "") {
      loginRequest(email.value, password.value);
    }
  };

  //==========================back request===========================
  const loginRequest = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        //ejecutar seteo de redux en Layout
        alert("usuario logeado correctamente");
        navigate("/home");
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

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center bg-cach-l1 w-[350px] p-4 rounded-[15px]">
        <div className="p-4 text-textcol-1 text-[36px]">
          <h1>
            <b>Login</b>
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center pt-8 w-[300px]">
          <Input
            size="large"
            placeholder="email"
            type="email"
            prefix={<CiMail />}
            style={{ marginBottom: "6px" }}
            {...email}
          />
          <Input
            size="large"
            placeholder="contraseña"
            type="password"
            prefix={<CiLock />}
            style={{ marginTop: "6px" }}
            {...password}
          />
          <div className="p-4">
            <p>
              <Link to="/recoverPassword">
                <AntdLink>¿Olvidaste tu contraseña?</AntdLink>
              </Link>
            </p>
          </div>
          <div className="pt-6">
            <Button type="primary" size={"large"} onClick={onClickLogin}>
              Iniciar Sesión
            </Button>
          </div>
          <div className="p-4">
            <p>
              <Link to="/register">
                <AntdLink>Regístrate</AntdLink>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
