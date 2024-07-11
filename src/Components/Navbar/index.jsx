import React, { useEffect, useState } from "react";
import { Button, Menu, Dropdown, Drawer } from "antd";
import "./index.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdChat,
  MdOutlineExplore,
  MdOutlineNotifications,
} from "react-icons/md";
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
import { clearChats } from "../../state/chats";
import { socket } from "../../App";
import { HiOutlineMenu } from "react-icons/hi";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const [currentOption, setCurrentOption] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);

  ///===new nav

  const [option, setOption] = useState("");

  useEffect(() => {
    if (pathname) {
      if (pathname.includes("/auto")) setOption("auto");
      else if (pathname.includes("/red")) setOption("red");
      else if (pathname.includes("/explore")) setOption("explore");
      else if (pathname.includes("/health")) setOption("health");
    }
  }, [pathname]);

  //=====

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
        localStorage.removeItem("userToken");
        //limpiar estado de redux
        console.log("cesion cerrada exitosamente");
        navigate("/login");
        socket.emit("offline");
        dispatch(clearUser());
        dispatch(clearChats());
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
      //alert("Se ha cerrado sesión correctamente");
      // Aquí puedes realizar acciones adicionales después de cerrar sesión
    });
    logoutRequest();
  };

  //================================================================
  const items = [
    {
      key: "1",
      label: "Perfil",
      onClick: () => navigate(`/home/red/profile/${user.id}`),
    },

    {
      key: "2",
      label: "Configuración",
      disabled: true,
    },
    {
      key: "3",
      label: "Ayuda",
      disabled: true,
    },
    {
      key: "4",
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
      label: (
        <div className="flex items-center">
          <FaBookOpenReader className=" mr-[10px]" />
          Gestión
        </div>
      ),

      children: [
        {
          key: "/home/auto/resume",
          label: "Resumen",
          icon: <PiStudent className="p-0 m-0" />,
        },
        {
          key: "/home/auto/calendar",
          label: "Calendario",
          icon: <PiCalendar />,
        },
        {
          key: "/home/auto/reports",
          label: "Reportes",
          icon: <TbClipboardText />,
        },
        {
          key: "/home/auto/tasks",
          label: "Tareas",
          icon: <FaTasks />,
        },
        {
          key: "/home/auto/events",
          label: "Eventos",
          icon: <CgTime />,
        },
      ],
    },
    {
      key: "home/red",
      label: (
        <div className="flex items-center">
          <IoPeopleSharp className=" mr-[10px]" />
          Red
        </div>
      ),

      children: [
        {
          key: "/home/red/people",
          label: "Personas",
          icon: <BsPersonFill />,
        },
        {
          key: "/home/red/feed",
          label: "Feed",
          icon: <LuAlignStartVertical />,
        },
        {
          key: "/home/red/chats",
          label: "Chats",
          icon: <MdChat />,
        },
        {
          key: "/home/red/groups",
          label: "Grupos",
          icon: <BsFillPeopleFill />,
        },
      ],
    },
    {
      key: "home/explore",
      label: (
        <div className="flex items-center">
          <MdOutlineExplore className=" mr-[10px]" />
          Explora
        </div>
      ),

      disabled: true,
      selectable: false,
    },
    {
      key: "home/health",
      label: (
        <div className="flex items-center">
          <RiMentalHealthFill className=" mr-[10px]" />
          Salud
        </div>
      ),

      disabled: true,
      selectable: false,
    },
  ];

  const onClickOption = (e) => {
    setCurrentOption(e.key);
    navigate(e.key);
    setShowDrawer(false);
  };

  //=========chats=======================================

  const chatsPrev = useSelector((state) => state.chats);

  let chatsToSelect = chatsPrev.map((chat) => {
    let chatUser = chat.user1.id != user.id ? chat.user1 : chat.user2; //usuario del otro chat
    let fullname =
      chatUser.name.trim().split(" ")[0] + " " + chatUser.lastname[0] + ".";
    //console.log("anotherUserId", chatUser);
    if (chat.numberOfMessages > 0)
      return {
        key: chatUser.id.toString(),
        label: (
          <div className="flex flex-row h-full p-0 m-0 items-center w-[200px]">
            <img
              src={`${
                chatUser.profileImageUrl
                  ? chatUser.profileImageUrl
                  : "/profileImage.png"
              }`}
              alt="Profile Image"
              className="h-[35px] rounded-[35px] "
            />

            <div className="w-full h-[60px] flex flex-col pt-3 pb-3 pl-4">
              <div className="h-[50%]  flex items-center text-[15px]">
                <b>{fullname}</b>
              </div>
              <div className="h-[50%] flex items-center text-[15px] text-textcol-1">
                {chat.messages[0].senderId === user.id && "You: "}
                {chat.messages[0].content.substring(0, 30) + "..."}
              </div>
            </div>
            {/* <div className="pl-2 h-full flex items-center">
              <div className="bg-[#1daa61] rounded-[50%] w-[15px] h-[15px] flex items-center justify-center text-[10px] text-white">
                1
              </div>
            </div> */}
          </div>
        ),
        onClick: () => navigate(`/home/red/chats/${chatUser.id}`),
      };
  });

  //========================================================
  return (
    <div className="w-full pt-0 md:h-[62px] md:pl-4 md:pr-4 flex justify-center bg-cach-l1 bg-opacity-50 backdrop-blur-lg  shadow-custom">
      <div className="pl-2 pr-2 md:rounded-b-[15px] md:h-[62px] max-w-[1280px] w-full h-[50px] ">
        <div className="w-full flex h-full flex-row justify-between">
          <div
            className="hidden md:w-[30%] text-[24px] md:h-full md:flex  items-center  hover:cursor-pointer"
            onClick={() => navigate("/home/auto/resume")}
          >
            <div className="hidden md:flex md:h-full md:items-center pl-2 text-[30px] font-light">
              Student<b className="text-[#1677ff]">Collab</b>
            </div>
          </div>
          <div className="md:hidden flex items-center justify-center">
            <Button
              shape="circle"
              type="text"
              className="flex justify-center items-center"
              onClick={() => setShowDrawer(true)}
            >
              <HiOutlineMenu className="text-[20px]" />
            </Button>
          </div>

          <Drawer
            title="Menu"
            placement={"left"}
            closable={true}
            onClose={() => setShowDrawer(false)}
            open={showDrawer}
            key={"left"}
          >
            <Menu
              className="justify-start w-full md:justify-center  text-[18px] bg-[transparent] md:h-[50px] h-full "
              style={{
                borderRight: "none",
              }}
              selectedKeys={[currentOption]}
              mode="inline"
              items={items2}
              onClick={onClickOption}
            />
          </Drawer>

          <div className="md:w-[70%] h-full w-full flex justify-center text-[20px]">
            <div className="hidden md:flex  flex-row  jistify-center h-full ">
              <button
                className={`customTab  relative ${
                  option === "auto" ? "text-[#1677ff] font-semibold" : ""
                }`}
              >
                <Link to={"auto/resume"} className="flex items-center">
                  <FaBookOpenReader className="mr-[10px]" />
                  Gestión
                </Link>
              </button>
              <button
                className={`customTab h-full relative ${
                  option === "red" ? "text-[#1677ff] font-semibold" : ""
                }`}
              >
                <Link to={"red/people"} className="flex items-center">
                  <IoPeopleSharp className=" mr-[10px]" />
                  Red
                </Link>
              </button>
              <button
                className={`customTab h-full relative ${
                  option === "explore" ? "text-[#1677ff] font-semibold" : ""
                }`}
              >
                <Link to={"explore"} className="flex items-center">
                  <MdOutlineExplore className=" mr-[10px]" />
                  Explora
                </Link>
              </button>
              <button
                className={`customTab h-full relative ${
                  option === "health" ? "text-[#1677ff] font-semibold" : ""
                }`}
              >
                <Link to={"health"} className="flex items-center">
                  <RiMentalHealthFill className=" mr-[10px]" />
                  Salud
                </Link>
              </button>
            </div>
          </div>
          <div className="md:w-[30%] ">
            <div className="flex w-full h-full justify-end items-center pr-2">
              <div className=" flex flex-row ">
                {" "}
                <Dropdown
                  menu={{
                    items: chatsToSelect,
                  }}
                  placement="bottom"
                  trigger={["click"]}
                >
                  <Button
                    type="link"
                    size="large"
                    icon={<BiMessageDetail className="text-[22px]" />}
                  />
                </Dropdown>
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
                    alt="Profile Image"
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
