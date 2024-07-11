import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { Login } from "./Components/Login";
import { Register } from "./Components/Register";
import { Layout } from "./Components/Layout";
import { useEffect, useState } from "react";
import { Navbar } from "./Components/Navbar";
import { useDispatch } from "react-redux";
import { setUser, updateContactStatus } from "./state/user";
import { LeftMenu } from "./Components/LeftMenu";
import ReactGA from "react-ga4";
import { io } from "socket.io-client";
import { addChat, addMessage, setChats } from "./state/chats";
import { Loader } from "./Commons/Loader";
import { chatsService } from "./services/messages";
import { meService } from "./services/users";
let userId;

//====================================

const TRACKING_ID = "G-56X83C2ZX7";
ReactGA.initialize(TRACKING_ID);

const socket = io(import.meta.env.VITE_API_URL);

function App() {
  const pathname = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userHasLogged, setUserHasLogged] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [w, setW] = useState(0);

  const updW = (nw) => {
    setW(nw);
  };

  useEffect(() => {
    const fn = async () => {
      try {
        await meRequest();
      } catch (err) {
        console.error(err);
      }
    };
    fn();
  }, []);

  //==========================back request===========================
  const chatsRequest = chatsService;

  const meRequest = async () => {
    try {
      const res = await meService();

      if (res.status === 200) {
        setLoading(false);
        console.log("me: ", res.data);
        socket.emit("new-user-connected", res.data.id); //envio mi estado
        userId = res.data.id;
        //seteo estado redux user
        dispatch(setUser({ ...res.data }));

        //seteo estado redux chats
        const chts = await chatsRequest(res.data.id);
        dispatch(setChats(chts));

        setUserHasLogged(true);
        if (pathname === "/login" || pathname === "/")
          navigate("/home/auto/resume");
      } else {
        setLoading(false);
        navigate("/login");
      }
    } catch (error) {
      setLoading(false);
      navigate("/login");
      console.error("Error al realizar la solicitud:", error);
      //alert("Solicitud fallida...");
    }
  };

  //==============SOCKET HEAR===================

  useEffect(() => {
    socket.on("message", (data) => {
      if (!pathname.includes("login")) receiveMessage(data, userId);
    });
    socket.on("newChatMessage", (data) => {
      if (!pathname.includes("login")) receiveNewChatMessage(data, userId);
    });
    socket.on("get-connected-users", (data) => {
      if (!pathname.includes("login")) dispatch(updateContactStatus(data));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  //=================socket methods===================

  const receiveMessage = (data, userId) => {
    console.log("recibiste un mensaje");
    const rec = data.receiverId;

    if (rec === userId) {
      dispatch(addMessage({ chatId: data.chatId, message: data }));
    }
  };

  const receiveNewChatMessage = (data, userId) => {
    console.log("recibiste un mensaje");
    const rec = data.message.receiverId;

    if (rec === userId) {
      dispatch(addChat(data.chat));
      //dispatch(addMessage({ chatId: data.chat.id, message: data.message }))
    }
  };

  //====================================

  //=================================

  useEffect(() => {
    const v = localStorage.getItem("leftMenuCollapsed");
    if (!v) localStorage.setItem("leftMenuCollapsed", "no");
  });

  //================================================================
  if (loading) {
    return (
      <Loader
        title={"Cargando servidor..."}
        message={
          "Este proyecto aún está en desarrollo. Pueden haber demoras para cargar el servidor"
        }
      />
    );
  } else
    return (
      <div className="app">
        <Routes>
          <Route
            path="/home/*"
            element={
              <>
                <div className=" hidden md:left-[0%] md:w-full fixed md:z-20 md:flex md:flex-col md:pr-[10px]">
                  <Navbar />
                </div>
                <div className="max-w-[1280px] w-full absolute z-20 md:hidden">
                  <Navbar />
                </div>
                <div className="hidden sm:hidden md:absolute md:flex md:z-10">
                  <LeftMenu setCollapsed={setCollapsed} collapsed={collapsed} />
                </div>

                <Layout collapsed={collapsed} wf={updW} />
              </>
            }
          />
          <Route path="/landing" element={<p>futuro landing page</p>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<>404 Not found</>} />
        </Routes>
        {/* {loading && (
        <div className="w-full h-full flex justify-center items-center">
          <h1>Loading...</h1>
        </div>
      )} */}
      </div>
    );
}

export default App;
export { socket };
