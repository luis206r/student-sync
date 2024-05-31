import React, { useEffect, useState } from "react";
import { Button, Menu, Dropdown } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineExplore, MdOutlineNotifications } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import axios from "axios";
import { gapi } from "gapi-script";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../state/user";
import { FaAddressBook, FaTasks } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { RiMentalHealthFill } from "react-icons/ri";
import { IoPeopleSharp } from "react-icons/io5";
import { PiCalendar, PiStudent } from "react-icons/pi";
import { TbClipboardText } from "react-icons/tb";
import { CgTime } from "react-icons/cg";
import { BsFillPeopleFill, BsPersonFill } from "react-icons/bs";
import { LuAlignStartVertical } from "react-icons/lu";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const Navbar = ({ mobile }) => {
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
      label: <Link to={"auto/resume"}>Gestión</Link>,
      icon: <FaBookOpenReader />,
      children: !mobile
        ? null
        : [
            {
              key: "/home/auto/resume",
              label: <Link to={"auto/resume"}>Tu resumen</Link>,
              icon: <PiStudent className="p-0 m-0" />,
            },
            {
              key: "/home/auto/calendar",
              label: <Link to={"auto/calendar"}>Calendario</Link>,
              icon: <PiCalendar />,
            },
            {
              key: "/home/auto/reports",
              label: <Link to={"auto/reports"}>Reporte</Link>,
              icon: <TbClipboardText />,
            },
            {
              key: "/home/auto/tasks",
              label: <Link to={"auto/tasks"}>Tareas</Link>,
              icon: <FaTasks />,
            },
            {
              key: "/home/auto/events",
              label: <Link to={"auto/events"}>Eventos</Link>,
              icon: <CgTime />,
            },
          ],
    },
    {
      key: "home/red",
      label: <Link to={"red/people"}>Red</Link>,
      icon: <IoPeopleSharp />,
      children: !mobile
        ? null
        : [
            {
              key: "/home/red/people",
              label: <Link to={"red/people"}>Personas</Link>,
              icon: <BsPersonFill />,
            },
            {
              key: "/home/red/feed",
              label: <Link to={"red/feed"}>Feed</Link>,
              icon: <LuAlignStartVertical />,
            },
            {
              key: "/home/red/groups",
              label: <Link to={"red/groups"}>Grupos</Link>,
              icon: <BsFillPeopleFill />,
            },
          ],
    },
    {
      key: "home/explore",
      label: <Link to={"explore"}>Explora</Link>,
      disabled: true,
      selectable: false,
      icon: <MdOutlineExplore />,
    },
    {
      key: "home/health",
      label: <Link to={"health"}>Salud</Link>,
      disabled: true,
      selectable: false,
      icon: <RiMentalHealthFill />,
    },
  ];

  useEffect(() => {
    console.log(pathname);
    if (pathname.includes("home/auto")) setCurrentOption("home/auto");
    else if (pathname.includes("home/red")) setCurrentOption("home/red");
  }, [pathname]);

  const onClickOption = (e) => {
    //console.log(items2[parseInt(e.key) - 1].value);
    //const newOptionSelected = items2[parseInt(e.key) - 1].value;
    //changeValue(newOptionSelected);
    setCurrentOption(e.key);
  };
  return (
    <div className="w-full pt-0 h-[94px] md:pl-4 md:pr-4">
      <div className="md:p-4 p-2 bg-cach-l1 md:rounded-[15px]  w-full rounded-t-[0px] shadow-lg">
        <div className="w-full flex flex-row justify-between">
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
          <div className="">
            <div className="flex w-full h-full justify-end items-center pr-4">
              <div className="hidden md:flex md:flex-row ">
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
              <div className="min-w-[35px] w-[35px]">
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
                    className="w-[35px] min-w-[35px] rounded-[20px] shadow-md"
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
