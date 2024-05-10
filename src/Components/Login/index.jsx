import React from "react";
import { Input, Button, Typography } from "antd";
import { CiMail, CiLock } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
const { Link: AntdLink } = Typography;

export const Login = () => {
  const navigate = useNavigate();
  const onClickLogin = (e) => {
    navigate("/home");
  };
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
          />
          <Input
            size="large"
            placeholder="contraseña"
            type="password"
            prefix={<CiLock />}
            style={{ marginTop: "6px" }}
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
