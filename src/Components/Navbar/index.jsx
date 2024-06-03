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
const backUrl="https://student-sync-back.onrender.com";

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
      label: !mobile ? (
        <Link to={"auto/resume"} className="flex ml-[15px]  mr-[15px]">
          <FaBookOpenReader className="mt-[14px] mr-[10px]" />
          Gestion
        </Link>
      ) : (
        <FaBookOpenReader className="mt-[16px] ml-[15px] mr-[15px]" />
      ),
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
      label: !mobile ? (
        <Link to={"red/people"} className="flex ml-[15px]  mr-[15px]">
          <IoPeopleSharp className="mt-[14px] mr-[10px]" />
          Red
        </Link>
      ) : (
        <IoPeopleSharp className="mt-[16px] ml-[15px] mr-[15px]" />
      ),

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
      label: !mobile ? (
        <Link to={"explore"} className="flex ml-[15px]  mr-[15px]">
          <MdOutlineExplore className="mt-[14px] mr-[10px]" />
          Explora
        </Link>
      ) : (
        <MdOutlineExplore className="mt-[16px] ml-[15px] mr-[15px]" />
      ),
      disabled: true,
      selectable: false,
    },
    {
      key: "home/health",
      label: !mobile ? (
        <Link to={"health"} className="flex ml-[15px]  mr-[15px]">
          <RiMentalHealthFill className="mt-[14px] mr-[10px]" />
          Salud
        </Link>
      ) : (
        <RiMentalHealthFill className="mt-[16px] ml-[15px] mr-[15px]" />
      ),
      disabled: true,
      selectable: false,
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
      <div className="pl-2 pr-2 bg-cach-l1 md:rounded-b-[15px] md:h-[62px] w-full h-[50px] shadow-lg">
        <div className="w-full flex h-full flex-row justify-between">
          <div className="hidden md:w-[30%] text-[24px] md:h-full md:flex  items-center  ">
            <div className="hidden md:flex md:h-full md:items-center pl-2">
              Student<b className="text-[#1677ff]">Collab</b>
            </div>
          </div>
          <div className="md:w-[70%] h-full w-full">
            <div className="w-full h-full flex items-end ">
              <Menu
                className="justify-start w-full md:justify-center  text-[18px] bg-[transparent] md:h-[50px] h-full "
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
          <div className="md:w-[30%] ">
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
              <div className="min-w-[30px] w-[30px]">
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
                    className="w-[30px] min-w-[30px] rounded-[20px] shadow-md"
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
