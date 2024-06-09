import React, { useEffect, useRef, useState } from "react";
import { Button, Typography, Modal, Input, Popover } from "antd";
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
import { FaGalacticSenate } from "react-icons/fa6";
import { CiLock, CiMail } from "react-icons/ci";
import { RiQuestionFill } from "react-icons/ri";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

function validarCorreoUtec(correo, dominio) {
  if (correo === "student.collab.app@gmail.com") return true;
  // Escapamos el punto para que se tome literalmente en la expresión regular
  const dominioRegex = new RegExp(`@${dominio.replace(".", "\\.")}$`, "i");

  // Verificamos si el correo electrónico termina con el dominio especificado
  return dominioRegex.test(correo);
}

export const Login = () => {
  const pRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useInput();
  const password = useInput();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showMailInput, setShowMailInput] = useState(true);
  const [enableMailInput, setEnableMailInput] = useState(true);

  // const onClickLogin = (e) => {
  //   e.preventDefault();
  //   if (validarEmail(email.value) && password.value !== "") {
  //     loginRequest(email.value, password.value);
  //   }
  // };
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const openModalWithMessage = (message) => {
    setModalMessage(message);
    setOpenModal(true);
  };

  //==========================back request===========================
  const meRequest = async () => {
    try {
      const res = await axios.get(
        `${backUrl}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        console.log("me: ", res.data);
        dispatch(setUser({ ...res.data }));
        //ejecutar seteo de redux en Layout
        navigate("/home/auto/resume");
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
        `${backUrl}/api/users/googleLogin`,
        {
          email: email,
          profileImageUrl: profileImageUrl,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        localStorage.setItem("userToken", res.data.token);
        await meRequest();
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

  const onClickAccess = async (email, name, lastname, profileImageUrl) => {
    const isUtecAccount = validarCorreoUtec(email, "utec.edu.pe");
    if (isUtecAccount) {
      console.log("correo valido");

      await googleLoginRequest(email, name, lastname, profileImageUrl);
    } else {
      openModalWithMessage("Debes acceder con un correo UTEC");
    }
  };

  const onKeyDownPasswordInput = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      loginRequest(email.value, password.value);
    }
  };

  const onKeyDownMailInput = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      findEmail();
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
        `${backUrl}/api/users/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        localStorage.setItem("userToken", res.data.token);
        await meRequest();

        alert("usuario logeado correctamente");
      } else {
        console.error("Error en la solicitud:", res.data);
        alert("Algo salió mal...");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      alert("Solicitud fallida...");
    }
  };

  const findEmail = async () => {
    try {
      setEnableMailInput(false);
      const isUtecAccount = validarCorreoUtec(email.value, "utec.edu.pe");
      if (!isUtecAccount) {
        openModalWithMessage("Debes acceder con un correo UTEC");
        setEnableMailInput(true);
        return;
      } else {
        const res = await axios.post(
          `${backUrl}/api/users/findEmail`,
          {
            email: email.value,
          },
          { withCredentials: true }
        );
        if (res.status === 200) {
          if (res.data.user.hasGoogleAcces) {
            handleLoginGoogle();
          } else {
            setShowMailInput(false);
            setShowPasswordInput(true);
          }
        }
      }
    } catch (err) {
      if (err.response.status === 404) {
        openModalWithMessage("Aún no estás regitrado");
        setEnableMailInput(true);
        return;
      } else console.error("Error al realizar la solicitud");
    }
  };

  //================================================================

  const handleLoginGoogle = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2
      .signIn({ prompt: "select_account" })
      .then((user) => {
        const profile = user.getBasicProfile();

        // Aquí puedes realizar acciones adicionales después de iniciar sesión, como enviar datos de usuario al servidor
        console.log("Inicio de sesión exitoso:", user);
        if (profile.cu != email.value) {
          alert("los correos no coinciden");
          setEnableMailInput(true);
          return;
        }
        onClickAccess(profile.cu, profile.rV, profile.uT, profile.hK);
      })
      .catch((error) => {
        setEnableMailInput(true);
        console.error(error);
      });
  };

  useEffect(() => {
    if (showPasswordInput && pRef.current) {
      pRef.current.focus();
    }
  }, [showPasswordInput]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ">
      <div className="flex flex-col items-center justify-center bg-cach-l1 w-[350px] p-4 rounded-[15px]">
        <div className="p-4 pb-0 text-textcol-1 text-[36px]">
          <Modal
            title={modalMessage}
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
          <div className="pb-4">
            <img
              src="/logo3.png"
              style={{ width: "200px", borderRadius: "15px" }}
            />
            <div className="flex flex-row items-center justify-center">
              <p className="text-textcol-1">
                <b>BETA</b>
              </p>
              <Popover
                className="text-textcol-1"
                placement="bottom"
                content={
                  <div className="max-w-[300px]">
                    <p>
                      <b>*Nuestra aplicación aún esta en desarrollo*</b>
                    </p>
                    <p>
                      Ya puedes ir registrándote. Una vez te hayas registrado,
                      habilitaremos tu inicio de sesión con Google en los
                      próximos días.
                    </p>
                    <p>En caso de experimentar demoras, recarga la página.</p>
                  </div>
                }
              >
                <div className="flex flex-row items-center">
                  <RiQuestionFill className="text-[20px]" />
                </div>
              </Popover>
            </div>
          </div>

          <div className="pt-6 pb-4 w-full">
            {showMailInput && (
              <div>
                <Input
                  onKeyDown={onKeyDownMailInput}
                  disabled={!enableMailInput}
                  size="large"
                  placeholder="correo Utec"
                  type="email"
                  prefix={<CiMail className="mr-2" />}
                  style={{ marginBottom: "6px" }}
                  {...email}
                />
                <div className="flex items-center justify-center pt-4">
                  <Button type="primary" size="large" onClick={findEmail}>
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {showPasswordInput && (
              <div>
                <Input
                  ref={pRef}
                  onLoad={true}
                  size="large"
                  placeholder="contraseña"
                  type="password"
                  prefix={<CiLock />}
                  {...password}
                  onKeyDown={onKeyDownPasswordInput}
                />

                <div className="flex flex-row pt-4 items-center justify-center">
                  <Button
                    className="mr-2 w-[50%]"
                    size="large"
                    onClick={(e) => {
                      setEnableMailInput(true);
                      setShowMailInput(true);
                      setShowPasswordInput(false);
                    }}
                  >
                    Volver
                  </Button>
                  <Button
                    className="ml-2 w-[50%]"
                    type="primary"
                    size="large"
                    onClick={(e) => {
                      loginRequest(email.value, password.value);
                    }}
                  >
                    Iniciar sesión
                  </Button>
                </div>
              </div>
            )}
            {/* <div className="p-4">
            <p>
              <Link to="/recoverPassword">
                <AntdLink>¿Olvidaste tu contraseña?</AntdLink>
              </Link>
            </p>
          </div> */}

            {/* ==========================google========================== */}
            {/* <Button
              type="primary"
              size={"large"}
              onClick={handleLogin}
              icon={<FaGoogle />}
              className="flex items-center "
            >
              Iniciar Sesión
            </Button> */}
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
