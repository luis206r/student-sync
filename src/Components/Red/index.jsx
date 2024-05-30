import { Button, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Feed } from "./Feed";
import { People } from "./People";
import { Groups } from "./Groups";
import { HiOutlineMenu } from "react-icons/hi";
import { BsPersonFill } from "react-icons/bs";
import { BsFillPeopleFill } from "react-icons/bs";
import { LuAlignStartVertical } from "react-icons/lu";
import "./index.css";
import { useSelector } from "react-redux";

// Combinar los dos arreglos sin duplicados basados en el ID

export const Red = () => {
  const user = useSelector((state) => state.user);
  const [contacts, setContacts] = useState([]);
  const [option, setOption] = useState("people");
  const onClick = (e) => {
    setOption(e.key);
  };
  const items = [
    {
      key: "people",
      label: "Personas",
      icon: <BsPersonFill />,
    },
    {
      key: "feed",
      label: "Feed",
      icon: <LuAlignStartVertical />,
    },

    {
      key: "groups",
      label: "Grupos",
      icon: <BsFillPeopleFill />,
    },
  ];

  useEffect(() => {
    const combinadoSinDuplicados = [...user.followers, ...user.follows].reduce(
      (acumulador, objeto) => {
        // Usamos el ID como clave para verificar duplicados
        const id = objeto.id;
        if (!acumulador[id]) {
          acumulador[id] = objeto;
        }
        return acumulador;
      },
      {}
    );

    const myContacts = Object.values(combinadoSinDuplicados);
    setContacts(myContacts);
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="w-full pr-4 pl-4 pb-4 flex flex-row">
      <div className={`w-[${collapsed ? "10%" : "20%"}] mr-2`}>
        <div className="bg-cach-l1 rounded-[15px] p-2">
          <div className="w-full justify-start flex  p-0 pb-0 mb-0">
            <Button
              className="pl-2 pr-2 pb-0 pt-0 ml-0 rounded-[10px]"
              type="text"
              onClick={toggleCollapsed}
              style={{
                marginBottom: 0,
              }}
            >
              <HiOutlineMenu className="text-[20px]" />
            </Button>
          </div>
          <Menu
            style={{
              width: "100%",
              backgroundColor: "transparent",
              borderRight: "none",
            }}
            defaultSelectedKeys={["people"]}
            inlineCollapsed={collapsed}
            //defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
            onClick={onClick}
          />
        </div>
      </div>
      <div className={` w-full flex flex-row`}>
        <div className={` w-full ml-2 mr-2 bg-cach-l1 p-4 rounded-[15px]`}>
          {option == "people" && <People />}
          {option == "feed" && <Feed />}
          {option == "groups" && <Groups />}
        </div>
        <div className={`w-[280px] bg-cach-l1 p-4 ml-2 rounded-[15px]`}>
          <h3 className="text-black"> Contactos</h3>
          <div>
            {contacts.map((contact) => {
              let fullname = contact.name + " " + contact.lastname;
              fullname =
                fullname.length > 20
                  ? fullname.substring(0, 14) + "..."
                  : fullname;
              return (
                <div
                  className=" flex flex-row items-center pt-4 pb-4 "
                  key={contact.id}
                >
                  <img
                    src={
                      contact.profileImageUrl
                        ? contact.profileImageUrl
                        : "/profileImage.png"
                    }
                    className="w-[30px] h-[30px] rounded-[50%]"
                  />
                  &nbsp;&nbsp;
                  <p>{fullname}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
