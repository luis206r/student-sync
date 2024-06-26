import React, { useEffect, useState } from "react";
import { Button, Menu, Dropdown } from "antd";
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
      label: !mobile ? (
        <Link to={"auto/resume"} className="flex ">
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
        <Link to={"red/people"} className="flex ">
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
              key: "/home/red/chats",
              label: <Link to={"red/chats"}>Chat</Link>,
              icon: <MdChat />,
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
        <Link to={"explore"} className="flex">
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
        <Link to={"health"} className="flex ">
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
    <div className="w-full pt-0 md:h-[80px] md:pl-4 md:pr-4">
      <div className="pl-2 pr-2 bg-cach-l1 md:rounded-b-[15px] md:h-[62px] w-full h-[50px] shadow-lg">
        <div className="w-full flex h-full flex-row justify-between">
          <div
            className="hidden md:w-[30%] text-[24px] md:h-full md:flex  items-center  hover:cursor-pointer"
            onClick={() => navigate("/home/auto/resume")}
          >
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
