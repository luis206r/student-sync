import { Button, ConfigProvider, Drawer, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { socket } from "../../../../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addChat, addMessage, updateChat } from "../../../../state/chats";
import "./index.css";
import { BsCheck, BsCheckAll } from "react-icons/bs";
import { TbClockHour3 } from "react-icons/tb";
import Result from "postcss/lib/result";
import { GoChevronLeft } from "react-icons/go";
import { uniqueList } from "../../../../Utils/uniqueList";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const Chat = () => {
  const scrollRef = useRef(null);
  const executeScroll = () =>
    scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { receiverId } = useParams();
  const [receptorId, setReceptorId] = useState(null);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const chats = useSelector((state) => state.chats);
  const [chat, setChat] = useState(null);
  const [chatProps, setChatProps] = useState(null);
  const [userReceiverInfo, setUserReceiverInfo] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [tempText, setTempText] = useState("");
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [isNewChat, setIsNewChat] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [contacts, setContacts] = useState(null);

  useEffect(() => {
    console.log("receiverId:", receiverId);
    if (receiverId) setReceptorId(parseInt(receiverId));
  }, [receiverId]);

  useEffect(() => {
    if (chats && user && receptorId && user.id) {
      //console.log("====>", chats);
      if (receptorId === user.id) {
        alert("El chat personal aún no esta disponible...");
        navigate("/home/red/chats");
      }
      let chatt = chats.filter(
        (chat_) =>
          (chat_.user1.id === user.id && chat_.user2.id === receptorId) ||
          (chat_.user1.id === receptorId && chat_.user2.id === user.id)
      )[0];

      //===============for new chat====================

      if (!chatt) {
        console.log("este es un nuevo chat");
        setIsNewChat(true);
        const createAndAddChat = async () => {
          try {
            const chat_ = await createChat(user.id, receptorId); // Espera a que se cree el chat
            dispatch(addChat(chat_)); // Dispatcha la acción para añadir el chat al estado
            setChat(chat_); // Actualiza el estado local con el chat creado
            const t = chat_.user1.id === user.id ? chat_.user2 : chat_.user1;

            setUserReceiverInfo(t); // Establece la información del receptor
          } catch (error) {
            console.error("Error al crear y añadir el chat:", error);
            // Aquí puedes manejar errores, como mostrar un mensaje al usuario
          }
        };

        createAndAddChat();
      }

      //================================================
      else {
        let t = chatt.user1.id === user.id ? chatt.user2 : chatt.user1;

        setUserReceiverInfo(t);
        //const tempMessages = [...chat.messages];
        //setMessages(tempMessages);
        setChat(chatt);
      }
    }
  }, [chats, receptorId]);

  // useEffect(() => {
  //   if (user && user.followers && user.follows && receptorId) {
  //     let isO = false;
  //     let v1 = user.followers.some(
  //       (follower) => follower.id === receptorId && follower.status === "online"
  //     );
  //     let v2 = user.follows.some(
  //       (follow) => follow.id === receptorId && follow.status === "online"
  //     );
  //     isO = v1 || v2;
  //     setIsOnline(isO);
  //   }
  // }, [user, receptorId]);

  useEffect(() => {
    if (user && user.followers && user.follows) {
      const contacts_ = uniqueList(user.followers, user.follows);
      setContacts(contacts_);
    }
  }, [user]);

  useEffect(() => {
    if (!loadingMoreMessages) {
      if (chat && scrollRef.current) executeScroll();
    }
    setLoadingMoreMessages(false);
  }, [chat]);

  useEffect(() => {
    //initial scroll
    if (scrollRef.current && !loading) executeScroll();
  }, [scrollRef, loading]);

  useEffect(() => {
    if (chat && chat.messages && userReceiverInfo) {
      setLoading(false);
    }
  }, [chat, userReceiverInfo]);

  //==============================back request=============================

  const createMessage = async (message) => {
    try {
      const res = await axios.post(
        `${backUrl}/api/messages/create/${user.id}/${userReceiverInfo.id}`,
        { content: message },
        { withCredentials: true }
      );
      if (res.status === 201) return res.data;
    } catch (err) {
      console.error(err);
      alert("something went wrong");
    }
  };

  const loadPrevMessages = async (chatId, page, lastId) => {
    try {
      let res;
      res = lastId
        ? await axios.get(
            `${backUrl}/api/messages/loadChatMessages/${chatId}/${page}/${lastId}`,
            {},
            { withCredentials: true }
          )
        : await axios.get(
            `${backUrl}/api/messages/loadChatMessages/${chatId}/${page}`,
            {},
            { withCredentials: true }
          );
      if (res.status === 200) return res.data;
    } catch (err) {
      console.error(err);
      alert("something went wrong");
    }
  };

  const createChat = async (id1, id2) => {
    try {
      const res = await axios.post(
        `${backUrl}/api/messages/createChat/${id1}/${id2}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200 || res.status === 201) return res.data;
    } catch (err) {
      console.error(err);
      alert("no existe este usuario");
      navigate("/home/red/chats");
    }
  };

  //=======================================================================

  const loadMsgs = async () => {
    try {
      setLoadingMoreMessages(true);
      let nextPage = chat.currentPage + 1;
      const result = await loadPrevMessages(chat.id, nextPage, chat.lastId);
      //console.log(result);
      dispatch(
        updateChat({
          chatId: result.id,
          newMessages: result.messages,
          newProps: {
            currentPage: parseInt(result.currentPage),
            lastId: result.lastId,
          },
        })
      );
      // setChat((pcp) => {
      //   return {
      //     ...pcp,
      //     currentPage: parseInt(result.currentPage),
      //     lastId: result.lastId,
      //     //totalPages: result.totalPages,
      //   };
      // });
      // setMessages((messages) => {
      //   return [...messages, ...result.messages];
      // });
    } catch (err) {
      console.error(err);
      setLoadingMoreMessages(false);
      alert("no se pudo cargar mas mensajes");
    }
  };

  const handleClickSendMessage = async (text) => {
    try {
      if (messageInput.trim() === "") {
        alert("Mensaje invválido");
        return;
      }

      setMessageInput("");
      setSendingMessage(true);

      const result = await createMessage(text);

      dispatch(addMessage({ chatId: result.chatId, message: result }));
      if (isNewChat) {
        socket.emit("newChatMessage", {
          chat: { ...chat, numberOfMessages: 1, messages: [result] }, //testear
          message: result,
        });
        setIsNewChat(false);
      } else socket.emit("message", result);

      // setMessages((prevMessages) => [result, ...prevMessages]);

      setSendingMessage(false);
    } catch (err) {
      setSendingMessage(false);
      console.error(err);
      alert("no se pudo enviar el mensaje");
    }
  };

  const handleEnter = (event) => {
    if (event.keyCode === 13 || event.keyCode === 3) {
      event.preventDefault();
      //event.target.value === "";
      let text = messageInput;
      setTempText(text);
      handleClickSendMessage(text);
    }
  };

  if (loading) return <div>loading...</div>;

  return (
    <div className="w-full h-full">
      <div className="bg-[#ffffff] md:rounded-[10px] h-full">
        <div className=" p-1 md:p-2 pt-0 flex flex-col h-full pb-0 ">
          <div className="md:h-[80px] h-[60px] w-full flex flex-row items-center md:p-2 p-1 ">
            <Button
              type="text"
              onClick={() => navigate("/home/red/chats")}
              shape="circle"
              className="md:hidden flex items-center justify-center"
            >
              <GoChevronLeft className="text-[20px]" />
            </Button>
            {/*
            <Drawer
              title="Basic Drawer"
              placement={"left"}
              closable={true}
              onClose={() => setShowDrawer(false)}
              open={showDrawer}
              key={"1d"}
            >
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </Drawer> */}
            <div className="w-[35px] h-[35px] relative">
              <img
                src={userReceiverInfo.profileImageUrl || "/profileImage.png"}
                alt="Profile Image"
                className="h-[35px] rounded-[35px]"
                onClick={() =>
                  navigate(`/home/red/profile/${userReceiverInfo.id}`)
                }
              />
              {contacts.some(
                (u) => u.id === userReceiverInfo.id && u.status === "online"
              ) && (
                <div className="flex bg-[#52c41a] w-[12px] h-[12px] rounded-[50%] absolute left-[26px] bottom-[2px]" />
              )}
            </div>
            &nbsp;&nbsp;
            <h4 className="text-black">
              {userReceiverInfo.name} {userReceiverInfo.lastname}
            </h4>
          </div>
          <hr />
          <div
            className="scp h-full w-full mb-1 mt-1 overflow-y-auto overflow-x-hidden"

            //style={{ scrollbarWidth: "thin", overflowY: "auto" }}
          >
            {chat && chat.currentPage < chat.totalPages && (
              <div className="w-full flex justify-center">
                {loadingMoreMessages ? (
                  "Cargando..."
                ) : (
                  <Button className="w-fit" onClick={loadMsgs}>
                    Cargar más
                  </Button>
                )}
              </div>
            )}
            <div className=" w-full flex flex-col p-2 pl-2 pr-2 justify-end text-black">
              {chat &&
                chat.messages &&
                [...chat.messages].reverse().map((msg, index) => (
                  <div
                    key={index}
                    className={`w-full flex ${
                      msg.senderId === user.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`${
                        msg.senderId === user.id
                          ? "bg-[#0f83fe] text-white rounded-br-[0px]"
                          : "bg-[#f3f3f3] rounded-bl-[0px]"
                      } p-3 mt-2 rounded-[20px]  w-fit pointer-events-none border-none shadow-md  max-w-[80%] break-words relative`}
                    >
                      {msg.content}
                      {msg.senderId === user.id && (
                        <div className="absolute bottom-[2px] right-[4px] text-[12px]">
                          {/* <BsCheck /> */}
                          <BsCheckAll />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              {sendingMessage && (
                <div className={`w-full flex justify-end`}>
                  <div
                    className={`
                          bg-[#0f83fe] text-white rounded-br-[0px]
                       p-3 mt-2 rounded-[20px]  w-fit pointer-events-none border-none shadow-md  max-w-[80%] break-words relative`}
                  >
                    {tempText}

                    <div className="absolute bottom-[2px] right-[4px] text-[12px]">
                      <TbClockHour3 />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} className="w-full"></div>
            </div>
          </div>

          <hr />
          <div className="h-fit w-full flex items-center flex-row justify-center pt-2 pb-2">
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    activeBg: "#f3f3f3",
                    hoverBg: "#f3f3f3",
                  },
                },
              }}
            >
              <TextArea
                className="bg-[#f3f3f3] border-[#f3f3f3] text-black p-[8px] rounded-[10px] text-[16px]"
                placeholder="Escribe un mensaje"
                autoSize
                maxLength={300}
                style={{ resize: "none", overflow: "auto", maxHeight: "150px" }}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleEnter}
                disabled={sendingMessage}
              />
            </ConfigProvider>
            <Button
              className="w-fit ml-2 flex items-center justify-center"
              type="primary"
              shape="circle"
              onClick={handleClickSendMessage}
            >
              <IoSend />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
