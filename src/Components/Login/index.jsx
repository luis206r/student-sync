import React, { useEffect, useState } from "react";
import { Button, Typography, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const { Link: AntdLink } = Typography;
import useInput from "../../Utils/useInput";
import validarEmail from "../../Utils/validateEmail";
import { gapi } from "gapi-script";
import { FaGoogle } from "react-icons/fa";
import "./index.css";
import { useDispatch } from "react-redux";
import { setUser } from "../../state/user";

function validarCorreoUtec(correo, dominio) {
  // Escapamos el punto para que se tome literalmente en la expresión regular
  const dominioRegex = new RegExp(`@${dominio.replace(".", "\\.")}$`, "i");

  // Verificamos si el correo electrónico termina con el dominio especificado
  return dominioRegex.test(correo);
}

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useInput();
  const password = useInput();

  const onClickLogin = (e) => {
    e.preventDefault();
    if (validarEmail(email.value) && password.value !== "") {
      loginRequest(email.value, password.value);
    }
  };
  const [openModal, setOpenModal] = useState(false);

  //==========================back request===========================
  const meRequest = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users/me", {
        withCredentials: true,
      });

      if (res.status === 200) {
        console.log("me: ", res.data);
        dispatch(setUser({ ...res.data }));
        //ejecutar seteo de redux en Layout
        navigate("/home");
      } else {
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
      console.error("Error al realizar la solicitud:", error);
      //alert("Solicitud fallida...");
    }
  };

  //================================================================

  const googleLoginRequest = async (email, name, lastname, profileImageUrl) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/googleLogin",
        {
          email: email,
          profileImageUrl: profileImageUrl,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.isRegistered) {
        meRequest();
      }
    } catch (err) {
      if (!err.response.data.isRegistered)
        navigate("/register", {
          state: {
            email: email,
            name: name,
            lastname: lastname,
            profileImageUrl: profileImageUrl,
          },
        });
      else console.error(err);
    }
  };

  // const onClickAccess = (res) => {
  //   const isUtecAccount = validarCorreoUtec(
  //     res.profileObj.email,
  //     "utec.edu.pe"
  //   );
  //   if (isUtecAccount) {
  //     console.log("correo valido");
  //     console.log(res.profileObj);
  //     googleLoginRequest(
  //       res.profileObj.email,
  //       res.profileObj.givenName,
  //       res.profileObj.familyName,
  //       res.profileObj.imageUrl
  //     );
  //   } else {
  //     setOpenModal(true);
  //   }
  // };

  const onClickAccess = (email, name, lastname, profileImageUrl) => {
    const isUtecAccount = validarCorreoUtec(email, "utec.edu.pe");
    if (isUtecAccount) {
      console.log("correo valido");

      googleLoginRequest(email, name, lastname, profileImageUrl);
    } else {
      setOpenModal(true);
    }
  };

  const onKeyDownPasswordInput = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      onClickLogin(e);
    }
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId:
          "802739494860-g8b82fns678r3knlv5d7ed83thpji720.apps.googleusercontent.com",
        scope:
          "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.events",
      });
    }

    gapi.load("client:auth2", start);
  }, []);

  //==========================back request===========================
  const loginRequest = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
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

  const handleLogin = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn({ prompt: "select_account" }).then((user) => {
      const profile = user.getBasicProfile();

      // Aquí puedes realizar acciones adicionales después de iniciar sesión, como enviar datos de usuario al servidor
      console.log("Inicio de sesión exitoso:", user);
      onClickAccess(profile.cu, profile.rV, profile.uT, profile.hK);
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ">
      <div className="flex flex-col items-center justify-center bg-cach-l1 w-[350px] p-4 rounded-[15px]">
        <div className="p-4 pb-0 text-textcol-1 text-[36px]">
          <Modal
            title="Debes acceder con una cuenta UTEC"
            centered
            open={openModal}
            okText={"Ok"}
            onOk={() => {
              setOpenModal(false);
            }}
            onCancel={() => {
              setOpenModal(false);
            }}
            //okButtonProps={}
          ></Modal>
        </div>
        <div className="flex flex-col items-center justify-center w-[300px]">
          {/* <Input
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
            onKeyDown={onKeyDownPasswordInput}
          /> */}
          {/* <div className="p-4">
            <p>
              <Link to="/recoverPassword">
                <AntdLink>¿Olvidaste tu contraseña?</AntdLink>
              </Link>
            </p>
          </div> */}
          <div className="pb-4">
            <img
              src="/logo3.png"
              style={{ width: "200px", borderRadius: "15px" }}
            />
            <div className="flex items-center justify-center">
              <p className="text-textcol-1">
                <b>BETA</b>
              </p>
            </div>
          </div>
          <div className="pt-6 pb-6">
            <Button
              type="primary"
              size={"large"}
              onClick={handleLogin}
              icon={<FaGoogle />}
              className="flex items-center "
            >
              Iniciar Sesión
            </Button>
            {/* <div className="m-4 p-4">
               <GoogleLogin
                clientId="802739494860-g8b82fns678r3knlv5d7ed83thpji720.apps.googleusercontent.com"
                buttonText="Acceder"
                onSuccess={(res) => onClickAccess(res)}
                onFailure={(res) => console.log(res)}
                cookiePolicy={"single_host_origin"}
                isSignedIn={false}
                prompt="select_account"
              /> 
            </div> */}
          </div>
          {/* <div className="p-4">
            <p>
              <Link to="/register">
                <AntdLink>Regístrate</AntdLink>
              </Link>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};
