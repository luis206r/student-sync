import React, { useEffect, useState } from "react";
import { Button, Menu, Dropdown } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineNotifications } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import axios from "axios";

export const Navbar = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const [currentOption, setCurrentOption] = useState("");

  //==========================back request===========================
  const logoutRequest = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
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

  //================================================================

  const items = [
    {
      key: "1",
      label: "Configuración",
    },
    {
      key: "2",
      label: "Ayuda",
    },
    {
      key: "3",
      label: "Cerrar Sesión",
      onClick: () => {
        return logoutRequest();
      },
    },
  ];

  const items2 = [
    {
      key: "home/auto",
      label: <Link to={"auto"}>Autogestión</Link>,
    },
    {
      key: "home/red",
      label: <Link to={"/home/red"}>Red</Link>,
    },
    {
      key: "home/explore",
      label: <Link to={"/home/explore"}>Explora</Link>,
    },
    {
      key: "home/health",
      label: <Link to={"/home/health"}>Salud</Link>,
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
    const newOptionSelected = items2[parseInt(e.key) - 1].value;
    changeValue(newOptionSelected);
    setCurrentOption(e.key);
  };
  return (
    <div className="w-full p-4 h-[110px]">
      <div className="p-4 bg-cach-l1 rounded-[15px]">
        <div className="w-full flex flex-row">
          <div className="w-[15%] text-[24px] flex items-center pl-2">
            Student<b className="text-[#1677ff]">Collab</b>
          </div>
          <div className="w-[70%]">
            <div className="w-full ">
              <Menu
                className="w-full justify-center text-[18px] bg-[transparent]"
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
          <div className="w-[15%]">
            <div className="flex w-full h-full justify-end items-center pr-4">
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
              &nbsp; &nbsp;
              <Dropdown
                menu={{
                  items,
                  selectable: false,
                }}
                placement="bottom"
              >
                <div className="flex justify-center items-center bg-[#ac9bff] rounded-[50%] w-[35px] h-[35px] text-[white]">
                  L
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
