import React from "react";
import { Input, Button, Typography } from "antd";
import { CiUser, CiLock, CiMail } from "react-icons/ci";

import { Link } from "react-router-dom";
const { Link: AntdLink } = Typography;

export const Register = () => {
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
          />
          <Input
            size="large"
            placeholder="Apellidos"
            prefix={<CiUser />}
            style={{ marginTop: "6px", marginBottom: "6px" }}
          />
          <Input
            size="large"
            placeholder="Email"
            type="email"
            prefix={<CiMail />}
            style={{ marginTop: "6px", marginBottom: "6px" }}
          />
          <Input
            size="large"
            placeholder="Contraseña"
            type="password"
            prefix={<CiLock />}
            style={{ marginTop: "6px", marginBottom: "6px" }}
          />
          <Input
            size="large"
            placeholder="Confirmar contraseña"
            type="password"
            prefix={<CiLock />}
            style={{ marginTop: "6px" }}
          />

          <div className="pt-6">
            <Button type="primary" size={"large"}>
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
