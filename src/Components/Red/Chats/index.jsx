import React, { useEffect, useState } from "react";
import { Chat } from "./Chat";
import { Button, ConfigProvider, Dropdown, Menu, Modal, Select } from "antd";
import { IoCreate } from "react-icons/io5";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { LuUser2 } from "react-icons/lu";
import { Keyframes } from "@ant-design/cssinjs";
import { uniqueList } from "../../../Utils/uniqueList";
import "./index.css";
import ReactGA from "react-ga4";

export const Chats = () => {
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/chats", title: "chats" });
    ReactGA.event({
      category: "Navegación",
      action: "Acceso a chats",
      label: "Chats",
    });
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const { receiverId } = useParams();
  const [skey, setSkey] = useState("");
  const user = useSelector((state) => state.user);
  const [openModal, setOpenModal] = useState(false);
  const [contactList, setContactList] = useState(null);
  const [chatsToSelect, setChatsToSelect] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (location) {
      if (
        location.pathname === "/home/red/chats" ||
        location.pathname === "/home/red/chats/"
      ) {
        setShowChat(false);
      } else setShowChat(true);
    }
  }, [location]);

  useEffect(() => {
    if (user && user.followers && user.follows) {
      let cl = uniqueList(user.followers, user.follows);
      cl = cl.map((contact) => {
        return {
          key: contact.id.toString(),
          label: (
            <div className="w-[150px] flex flex-row items-center">
              <img
                src={
                  contact.profileImageUrl
                    ? contact.profileImageUrl
                    : "/profileImage.png"
                }
                className="w-[30px] h-[30px] rounded-[50%] shadow-md"
              />
              &nbsp;&nbsp;
              <p>{contact.name}</p>
            </div>
          ),
          onClick: () => navigate(`${contact.id}`),
          status: contact.status,
        };
      });
      setContactList(cl);
    }
  }, [user]);

  const chatsPrev = useSelector((state) => state.chats);

  useEffect(() => {
    if (contactList && chatsPrev) {
      let cts = chatsPrev.map((chat) => {
        let chatUser = chat.user1.id != user.id ? chat.user1 : chat.user2; //usuario del otro chat
        let isOnline = contactList.some(
          (contact) =>
            parseInt(contact.key) === chatUser.id && contact.status === "online"
        );
        let fullname =
          chatUser.name.trim().split(" ")[0] + " " + chatUser.lastname[0] + ".";

        //console.log("anotherUserId", chatUser);
        if (chat.numberOfMessages > 0)
          return {
            key: chatUser.id.toString(),
            label: (
              <div className="flex flex-row h-full p-0 m-0 items-center relative">
                <img
                  src={`${
                    chatUser.profileImageUrl
                      ? chatUser.profileImageUrl
                      : "/profileImage.png"
                  }`}
                  alt="Profile Image"
                  className="h-[35px] rounded-[35px] "
                />
                {isOnline && (
                  <div className="flex bg-[#52c41a] w-[12px] h-[12px] rounded-[50%] absolute left-[26px] bottom-[13px] border-[1px] border-[#7e7a7a]" />
                )}

                <div className="w-full h-full flex flex-col pt-3 pb-3 pl-4">
                  <div className="h-[50%]  flex items-center text-[15px]">
                    <b>{fullname}</b>
                  </div>
                  <div className="h-[50%] flex items-center text-[15px] text-textcol-1">
                    {chat.messages[0].senderId === user.id && "You: "}
                    {chat.messages[0].content.substring(0, 12) + "..."}
                  </div>
                </div>
              </div>
            ),
          };
      });

      setChatsToSelect(cts);
    }
  }, [contactList, chatsPrev]);

  return (
    <div className="relative w-full flex flex-row h-full ">
      <div className=" w-full md:w-[25%]  h-full pr-4">
        <div className=" h-full rounded-[10px]  flex flex-col ">
          <div className="flex justify-between flex-row p-2 ">
            <div className="flex flex-row items-center">
              <h3 className="text-black">Chats</h3> &nbsp;
              <p className="text-[10px]">Beta</p>
            </div>
            {contactList && (
              <Dropdown
                menu={{
                  items: contactList,
                }}
                placement="bottomLeft"
                trigger={["click"]}
                overlayStyle={{
                  maxHeight: "600px",
                  overflow: "hidden",
                  overflowY: "auto",
                  backgroundColor: "transparent",
                  boxShadow:
                    "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              >
                <Button
                  type="link"
                  shape="circle"
                  className="flex items-center justify-center"
                  //onClick={() => setOpenModal(true)}
                >
                  <IoCreate className="m-0 w-[25px] h-[25px]" />
                </Button>
              </Dropdown>
            )}
          </div>
          {chatsToSelect && (
            <ConfigProvider
              theme={{
                components: {
                  Menu: {
                    itemHeight: 60,
                  },
                },
              }}
            >
              <Menu
                className=" bg-transparent max-h-[100%] overflow-auto scp  "
                style={{
                  borderRight: "none",
                  borderTop: "none",
                }}
                selectedKeys={[skey]}
                //inlineCollapsed={collapsed}
                //defaultOpenKeys={['sub1']}
                mode={"vertical"}
                items={chatsToSelect}
                //onClick={onClick}
                onClick={({ key }) => {
                  setSkey(key);
                  navigate(`${key}`);
                }}
              />
            </ConfigProvider>
          )}
        </div>
      </div>
      <div
        className={`${
          showChat ? "absolute" : "hidden"
        }  w-full md:relative md:w-[75%] h-full md:flex`}
      >
        <Routes>
          <Route path="/:receiverId" element={<Chat />} />
          <Route
            path="/"
            element={
              <div className=" hidden md:w-full md:h-full md:flex md:items-center md:justify-center">
                <span>Selecciona un chat o inicia una conversación</span>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};
