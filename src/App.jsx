import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { Login } from "./Components/Login";
import { Register } from "./Components/Register";
import { Layout } from "./Components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "./Components/Navbar";

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userHasLogged, setUserHasLogged] = useState(false);

  useEffect(() => {
    meRequest();
  }, []);

  //==========================back request===========================
  const meRequest = async () => {
    try {
      const res = await axios.get(
        "https://student-sync-back.onrender.com/api/users/me",
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        //ejecutar seteo de redux en Layout
        setUserHasLogged(true);
        setLoading(false);
        navigate("/home");
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

  return (
    <div className={"app w-full relative"}>
      <Routes>
        <Route
          path="/home/*"
          element={
            <>
              <Navbar />
              <Layout />
            </>
          }
        />
        <Route path="/landing" element={<p>futuro landing page</p>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
