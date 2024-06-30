import { Button, ConfigProvider, Input } from "antd";
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
import { GoChevronLeft } from "react-icons/go";
import { uniqueList } from "../../../../Utils/uniqueList";
import getTime from "../../../../Utils/getTime";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const Chat = () => {
  const inptMsg = useRef(null);
  const scrollRef = useRef(null);
  const executeScroll = () =>
    scrollRef.current.scrollIntoView({ block: "start" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { receiverId } = useParams();
  const [receptorId, setReceptorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const chats = useSelector((state) => state.chats);
  const [chat, setChat] = useState(null);
  const [userReceiverInfo, setUserReceiverInfo] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [tempText, setTempText] = useState("");
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [isNewChat, setIsNewChat] = useState(false);
  const [contacts, setContacts] = useState(null);

  useEffect(() => {
    console.log("receiverId:", receiverId);
    if (receiverId != null) {
      const ii = parseInt(receiverId);
      setReceptorId(ii);
    }
  }, [receiverId]);

  useEffect(() => {
    //cada vez que recibo un mensaje, socket actualiza el estado de redux. en esa transición pueden ocurren distintos cambios al estado de chats, por lo que puede no encontrar un chat especifo en algun momento, pero milisegundos despues lo encuetra, por lo que chatt puede ser undefined incialmente. Para preveer eso se crea el estado setIsNewChat que se actualiza con cada ejecucion de este useEffect, evitando el bug de borrar los mensajes anteriores al enviar un mensaje. 🧐
    if (chats && user && receptorId != null && user.id) {
      //console.log("====>", chats);
      if (receptorId === user.id) {
        alert("El chat personal aún no esta disponible...");
        navigate("/home/red/chats");
      }
      let chatt = chats.filter(
        (chat_) =>
          chat_.user1.id === receptorId || chat_.user2.id === receptorId
      )[0];

      //===============for new chat====================

      if (!chatt) {
        //console.log("este es un nuevo chat...");
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
        setIsNewChat(false); //importante!!!!!
        //console.log("ahora este chat no es nuevo...");
        let t = chatt.user1.id === user.id ? chatt.user2 : chatt.user1;
        setUserReceiverInfo(t);
        setChat(chatt);
      }
    }
  }, [chats, receptorId]);

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

  const handleClickSendMessage = async () => {
    try {
      if (messageInput.trim() === "") {
        alert("Mensaje invválido");
        return;
      }
      let tt = messageInput;
      setTempText(tt);

      setMessageInput("");
      setSendingMessage(true);
      // setTimeout(async () => {
      const result = await createMessage(tt);

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
      inptMsg.current.focus();
      // }, "3000");
    } catch (err) {
      setSendingMessage(false);
      console.error(err);
      alert("no se pudo enviar el mensaje");
    }
  };

  useEffect(() => {
    if (!sendingMessage && inptMsg.current) {
      inptMsg.current.focus();
    }
  }, [sendingMessage]);

  const handleEnter = (event) => {
    if (event.keyCode === 13 || event.keyCode === 3) {
      event.preventDefault();
      //event.target.value === "";
      let text = messageInput;
      setTempText(text);
      handleClickSendMessage();
    }
  };

  if (loading) return <div>loading...</div>;

  return (
    <div className="w-full h-full">
      <div className="bg-[#ffffff] md:rounded-[10px] h-full">
        <div className=" p-1 md:p-2 pt-0 flex flex-col h-full pb-0 md:pb-0 md:pt-0">
          <div className="md:h-[80px] h-[60px] w-full flex flex-row items-center md:p-2 p-1 relative">
            <Button
              type="text"
              onClick={() => navigate("/home/red/chats")}
              shape="circle"
              className="md:hidden flex items-center justify-center"
            >
              <GoChevronLeft className="text-[20px]" />
            </Button>
            <div className="w-[35px] h-[35px] relative">
              <img
                src={userReceiverInfo.profileImageUrl || "/profileImage.png"}
                alt="Profile Image"
                className="h-[35px] rounded-[35px] shadow-md"
                onClick={() =>
                  navigate(`/home/red/profile/${userReceiverInfo.id}`)
                }
              />
              {contacts.some(
                (u) => u.id === userReceiverInfo.id && u.status === "online"
              ) && (
                <div className="flex bg-[#52c41a] w-[12px] h-[12px] rounded-[50%] absolute left-[26px] bottom-[2px] border-[1px] border-[#7e7a7a]" />
              )}
            </div>
            &nbsp;&nbsp;
            <h4 className="text-black">
              {userReceiverInfo.name} {userReceiverInfo.lastname}
            </h4>
          </div>
          <hr />
          <div className="scp h-full w-full mb-1 mt-1 overflow-y-auto overflow-x-hidden">
            {chat && chat.currentPage < chat.totalPages && (
              <div className="w-full flex justify-center">
                {loadingMoreMessages ? (
                  <span className="text-[14px] pb-1 pt-1">Cargando...</span>
                ) : (
                  <Button className="w-fit" onClick={loadMsgs} type="link">
                    Cargar
                  </Button>
                )}
              </div>
            )}
            <div className=" w-full flex flex-col p-2 pl-2 pr-2 justify-end text-black">
              {chat &&
                chat.messages &&
                [...chat.messages].reverse().map((msg, index, array) => (
                  <div className="w-full" key={index}>
                    {index == 0 && (
                      <span className="w-full flex flex-row justify-center items-center text-textcol-1 text-[13px]">
                        <div className="bg-[#f3f3f3] p-1 pl-2 pr-2 rounded-[15px]">
                          {getTime(msg.createdAt).date}
                        </div>
                      </span>
                    )}
                    {index > 0 &&
                      getTime(msg.createdAt).date !=
                        getTime(array[index - 1].createdAt).date && (
                        <span className="w-full flex flex-row justify-center items-center text-textcol-1 text-[13px]">
                          <div className="bg-[#f3f3f3] p-1 pl-2 pr-2 rounded-[15px]">
                            {getTime(msg.createdAt).date}
                          </div>
                        </span>
                      )}
                    <div
                      // key={index}
                      className={`w-full flex ${
                        msg.senderId === user.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={` p-2 ${
                          msg.senderId === user.id
                            ? "bg-[#0f83fe] text-white rounded-br-[0px] pr-2 pl-3"
                            : "bg-[#f3f3f3] rounded-tl-[0px] pl-3 pr-3"
                        }  mt-2 rounded-[20px]  w-fit pointer-events-none border-none shadow-md  max-w-[80%] break-words relative flex flex-row`}
                      >
                        <div className="pb-1">{msg.content}</div>
                        <span
                          className={`text-[10px] pl-2 ${
                            msg.senderId === user.id
                              ? "text-[#f1f1f1]"
                              : "text-[#7e7e7e]"
                          } flex items-end`}
                        >
                          {getTime(msg.createdAt).time}
                          {msg.senderId === user.id && (
                            <BsCheckAll className="text-[15px]" />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              {sendingMessage && (
                <div
                  // key={index}
                  className={`w-full flex justify-end`}
                >
                  <div
                    className={`
                    bg-[#0f83fe] text-white rounded-br-[0px]
                    p-2 pl-3 pr-2 mt-2 rounded-[20px]  w-fit pointer-events-none border-none shadow-md  max-w-[80%] break-words relative flex flex-row`}
                  >
                    <div className="pb-1">{tempText}</div>
                    <span
                      className={`text-[10px] pl-2 text-[#f1f1f1] flex items-end`}
                    >
                      <TbClockHour3 className="text-[13px]" />
                    </span>
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
                className="bg-[#f3f3f3] border-[#f3f3f3] text-black p-[8px] rounded-[10px] text-[16px] max-h-[150px] overflow-auto resize-none"
                placeholder="Escribe un mensaje"
                autoSize
                maxLength={300}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleEnter}
                disabled={sendingMessage}
                ref={inptMsg}
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
