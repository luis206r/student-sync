import React, { useEffect, useState } from "react";
import { Button, Menu, Dropdown } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineExplore, MdOutlineNotifications } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import axios from "axios";
import { gapi } from "gapi-script";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../state/user";
import { FaAddressBook } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { RiMentalHealthFill } from "react-icons/ri";
import { IoPeopleSharp } from "react-icons/io5";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const [currentOption, setCurrentOption] = useState("");

  //==========================back request===========================
  const logoutRequest = async () => {
    try {
      const res = await axios.post(
        `${backUrl}/api/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        dispatch(clearUser());
        localStorage.removeItem("userToken");
        //limpiar estado de redux
        console.log("cesion cerrada exitosamente");
        navigate("/login");
      } else {
        console.log("error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      alert("Solicitud fallida...");
    }
  };

  const handleLogout = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      alert("Se ha cerrado sesión correctamente");
      // Aquí puedes realizar acciones adicionales después de cerrar sesión
    });
    logoutRequest();
  };

  //================================================================
  const items = [
    {
      key: "1",
      label: "Configuración",
      disabled: true,
    },
    {
      key: "2",
      label: "Ayuda",
      disabled: true,
    },
    {
      key: "3",
      label: "Cerrar sesión",
      // <div>
      //   <GoogleLogout
      //     clientId="802739494860-g8b82fns678r3knlv5d7ed83thpji720.apps.googleusercontent.com"
      //     buttonText={"Logout"}
      //     onLogoutSuccess={() =>
      //       console.log("Cesión cerrada satisfactoriamente")
      //     }
      //   />
      // </div>

      onClick: () => {
        return handleLogout();
      },
    },
  ];

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

  const items2 = [
    {
      key: "home/auto",
      label: <Link to={"auto"}>Autogestión</Link>,
      icon: <FaBookOpenReader />,
    },
    {
      key: "home/red",
      label: <Link to={"/home/red"}>Red</Link>,
      icon: <IoPeopleSharp />,
    },
    {
      key: "home/explore",
      label: <Link to={"/home/explore"}>Explora</Link>,
      disabled: true,
      selectable: false,
      icon: <MdOutlineExplore />,
    },
    {
      key: "home/health",
      label: <Link to={"/home/health"}>Salud</Link>,
      disabled: true,
      selectable: false,
      icon: <RiMentalHealthFill />,
    },
  ];

  useEffect(() => {
    if (pathname === "/home") setCurrentOption("home/auto");
    else {
      const key = pathname.substring(1);
      console.log(key);
      setCurrentOption(key);
    }
  }, [pathname]);

  const onClickOption = (e) => {
    //console.log(items2[parseInt(e.key) - 1].value);
    //const newOptionSelected = items2[parseInt(e.key) - 1].value;
    //changeValue(newOptionSelected);
    setCurrentOption(e.key);
  };
  return (
    <div className="w-full p-4 h-[110px]">
      <div className="p-4 bg-cach-l1 rounded-[15px]">
        <div className="w-full flex flex-row">
          <div className="md:w-[15%] text-[24px] flex items-center pl-2 ">
            <div className="hidden md:flex">
              Student<b className="text-[#1677ff]">Collab</b>
            </div>
          </div>
          <div className="md:w-[70%] w-full">
            <div className="w-full ">
              <Menu
                className="justify-start w-full md:justify-center text-[18px] bg-[transparent] "
                style={{
                  borderBottom: "none",
                }}
                selectedKeys={[currentOption]}
                mode="horizontal"
                items={items2}
                onClick={onClickOption}
              />
            </div>
          </div>
          <div className="max-w-[15%]">
            <div className="flex w-full h-full justify-end items-center pr-4">
              <div className="flex flex-row ">
                {" "}
                <Button
                  type="link"
                  size="large"
                  icon={<BiMessageDetail className="text-[22px]" />}
                />
                <Button
                  type="link"
                  size="large"
                  icon={<MdOutlineNotifications className="text-[25px]" />}
                />
              </div>
              &nbsp; &nbsp;
              <div className="min-w-[35px]">
                <Dropdown
                  menu={{
                    items,
                    selectable: false,
                  }}
                  placement="bottom"
                  trigger={["click"]}
                >
                  {/* <div className="flex justify-center items-center bg-[#ac9bff] rounded-[50%] w-[35px] h-[35px] text-[white]">
                  L
                </div> */}

                  <img
                    src={`${
                      user.profileImageUrl
                        ? user.profileImageUrl
                        : "/profileImage.png"
                    }`}
                    className="md:w-[35px] rounded-[20px]"
                  />
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
