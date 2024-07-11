import { Button, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { MdChat } from "react-icons/md";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { uniqueList } from "../../Utils/uniqueList";
import "./index.css";

export const RightMenu = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  const goToProfile = (userId) => {
    if (location.pathname != `/home/red/profile/${userId}`)
      navigate(`/home/red/profile/${userId}`);
  };

  useEffect(() => {
    if (user && user.followers && user.follows) {
      const contacts_ = uniqueList(user.followers, user.follows);
      setContacts(contacts_);
    }
  }, [user]);

  return (
    <div
      className={` pl-2 max-w-[210px] w-full top-[76px] pb-4 fixed bottom-[0px]`}
    >
      <div className="rounded-[15px] h-full">
        <div className="w-full bg-cach-l1  shadow-md pt-2 pl-4 pr-4 rounded-t-[15px]">
          <h3 className="text-black"> Contactos</h3>
        </div>
        <div className=" scp w-full max-h-[91%] bg-cach-l1  overflow-auto p-2 shadow-md rounded-b-[15px]">
          <div className="flex flex-col ">
            {contacts.map((contact) => {
              let fullname =
                contact.name.trim().split(" ")[0] +
                " " +
                contact.lastname[0] +
                ".";
              fullname =
                fullname.length > 20
                  ? fullname.substring(0, 14) + "..."
                  : fullname;
              return (
                <div className="flex items-center justify-between mt-2 w-full h-full">
                  <Button
                    className="w-full flex flex-row pt-2 pb-2 pl-2 h-fit"
                    type="text"
                    onClick={() => goToProfile(contact.id)}
                    key={contact.id}
                  >
                    <div className="flex items-center relative">
                      <img
                        src={
                          contact.profileImageUrl
                            ? contact.profileImageUrl
                            : "/profileImage.png"
                        }
                        className="w-[25px] h-[25px] rounded-[50%] shadow-md"
                      />
                      {contact.status === "online" && (
                        <div className="flex bg-[#52c41a] w-[10px] h-[10px] rounded-[50%] absolute left-[18px] bottom-[0px] border-[1px] border-[#7e7a7a]" />
                      )}
                      &nbsp;&nbsp;
                      <p>{fullname}</p>
                    </div>
                  </Button>

                  <Button
                    type="link"
                    className="flex items-center justify-center"
                    onClick={() => navigate(`/home/red/chats/${contact.id}`)}
                  >
                    <MdChat className="w-[18px] h-[18px]" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
