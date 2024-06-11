import { Button, Dropdown, Popover } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { GoChevronLeft } from "react-icons/go";
import { IoPersonAdd, IoPersonRemove } from "react-icons/io5";
import { RiUserFollowFill } from "react-icons/ri";
import { MdMailOutline } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { updateFollowers, updateFollows } from "../../../../state/user";
import { LiaEthereum } from "react-icons/lia";
import ReactGA from "react-ga";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const Profile = ({ info, showFunc }) => {
  const handleBack = () => {
    showFunc(false);
  };
  const dispatch = useDispatch();
  const [major, setMajor] = useState("");
  const [from, setFrom] = useState("");
  const [followers, setFollowers] = useState([]);
  const [follows, setFollows] = useState([]);
  const [followersOBJ, setFollowersOBJ] = useState([]);
  const [followsOBJ, setFollowsOBJ] = useState([]);
  const user = useSelector((state) => state.user);
  const [imFollowing, setImFollowing] = useState(null);

  useEffect(() => {
    let smajor = info[`${info.role}Info`].major;
    smajor =
      smajor === "cs"
        ? "Computer Science"
        : smajor === "civil"
        ? "Ingenería Civil"
        : smajor === "industrial"
        ? "Ingenería Industrial"
        : smajor === "enviromental"
        ? "Ingenería Ambiental"
        : smajor === "energy"
        ? "Ingenería de la Energía"
        : smajor === "mecatronic"
        ? "Ingenería Mecatrónica"
        : smajor === "chemical"
        ? "Ingenería Química"
        : smajor === "mecanic"
        ? "Ingenería Mecánica"
        : smajor === "bio"
        ? "Bioingeniería"
        : smajor === "administration"
        ? "Administración y Negocios Digitales"
        : smajor === "ds"
        ? "Ciencia de Datos"
        : smajor === "is"
        ? "Sistemas de la Información"
        : smajor;
    setMajor(smajor);

    // Verificar si info.createdAt es una fecha válida
    const createdAtDate = new Date(info.createdAt);
    if (!isNaN(createdAtDate.getTime())) {
      // Si es válida, establecer la fecha en el estado
      setFrom(createdAtDate);
    }
  }, []); // Se ejecuta solo una vez después de montar el componente

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  //========================back requests============================

  const getFollowers = async () => {
    try {
      const res = await axios.get(
        `${backUrl}/api/users/getFollowers/${info.id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        return res.data.followers;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getFollows = async () => {
    try {
      const res = await axios.get(
        `${backUrl}/api/users/getFollows/${info.id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        return res.data.follows;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addFollower = async () => {
    try {
      const res = await axios.post(
        `${backUrl}/api/users/addFollower`,
        {
          followUserId: info.id,
          followerUserId: user.id,
        },
        { withCredentials: true }
      );
      if (res.status === 201) {
        return res;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFollower = async () => {
    try {
      const res = await axios.post(
        `${backUrl}/api/users/removeFollower`,
        {
          followUserId: info.id,
          followerUserId: user.id,
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        return res;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onClickAdd = async () => {
    try {
      const result = await addFollower();
      if (result.status === 201) {
        const followToAdd = {
          id: info.id,
          email: info.email,
          name: info.name,
          lastname: info.lastname,
          profileImageUrl: info.profileImageUrl,
          role: info.role,
        };
        dispatch(updateFollows([...user.follows, followToAdd])); //actualizo mis follows
        //=======================
        let fullname = user.name + " " + user.lastname;
        fullname =
          fullname.length > 20 ? fullname.substring(0, 17) + "..." : fullname;
        let followerToAdd = {
          key: user.id,
          label: (
            <div className="w-[200px] flex flex-row items-center">
              <img
                src={
                  user.profileImageUrl
                    ? user.profileImageUrl
                    : "/profileImage.png"
                }
                className="w-[30px] h-[30px] rounded-[50%]"
              />
              &nbsp;&nbsp;
              <p>{fullname}</p>
            </div>
          ),
        };
        setFollowers(() => {
          return [...followers, followerToAdd];
        });
        setImFollowing(true);
        alert(`Ahora sigues a ${info.name}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onClickRemove = async () => {
    try {
      const result = await removeFollower();
      if (result.status === 200) {
        const nf = followers.filter((follower) => follower.key != user.id); //yo me remuevo de la lista de seguidores del usuario
        let myFollows = user.follows;
        myFollows = myFollows.filter((followed) => followed.id != info.id); //dejo de seguir a este usuario
        dispatch(updateFollows(myFollows));
        setFollowers(nf);
        setImFollowing(false);
        alert(`Ya no sigues a ${info.name}`);
      }
    } catch (err) {
      console.error(err);
    }
  };
  //=====================================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await getFollowers();
        setFollowersOBJ(result);
        let items = result.map((follower_) => {
          return {
            key: follower_.id,
            label: (
              <div className="w-[200px] flex flex-row items-center">
                <img
                  src={
                    follower_.profileImageUrl
                      ? follower_.profileImageUrl
                      : "/profileImage.png"
                  }
                  className="w-[30px] h-[30px] rounded-[50%]"
                />
                &nbsp;&nbsp;
                <p>
                  {follower_.name} {follower_.lastname}
                </p>
              </div>
            ),
          };
        });
        console.log("seguidores: ", items);

        setFollowers(items);
      } catch (error) {
        console.error("Error fetching followers data:", error);
      }
    };
    const fetchData2 = async () => {
      try {
        let result = await getFollows();
        setFollowsOBJ(result);
        let items = result.map((followed_) => {
          let fullname = followed_.name + " " + followed_.lastname;
          fullname =
            fullname.length > 20 ? fullname.substring(0, 17) + "..." : fullname;
          return {
            key: followed_.id,
            label: (
              <div className="w-[200px] flex flex-row items-center ">
                <img
                  src={
                    followed_.profileImageUrl
                      ? followed_.profileImageUrl
                      : "/profileImage.png"
                  }
                  className="w-[30px] h-[30px] rounded-[50%]"
                />
                &nbsp;&nbsp;
                <p>{fullname}</p>
              </div>
            ),
          };
        });
        console.log("seguidos: ", items);
        setFollows(items);
      } catch (error) {
        console.error("Error fetching follows data:", error);
      }
    };

    fetchData();
    fetchData2();
  }, []);

  useEffect(() => {
    const arr = user.follows.filter((follow) => follow.id === info.id);
    setImFollowing(() => {
      let value = arr.length === 1 ? true : false;
      return value;
    });
  }, []);

  return (
    <div className="w-full">
      <div>
        <Button
          type="text"
          onClick={handleBack}
          shape="circle"
          className="flex items-center justify-center"
        >
          <GoChevronLeft className="text-[20px]" />
        </Button>
      </div>
      <div className="w-full p-4 flex flex-col items-center">
        <div className="relative w-fit h-fit">
          <img
            src={`${
              info.profileImageUrl ? info.profileImageUrl : "/profileImage.png"
            }`}
            className="w-[200px] rounded-[50%] shadow-md"
          />
          {info.id != user.id && (
            <div className="absolute top-[85%] left-[85%]">
              {!imFollowing && (
                <Popover content={`Seguir`}>
                  <Button
                    type="primary"
                    shape="circle"
                    className="flex justify-center items-center"
                    onClick={onClickAdd}
                  >
                    <IoPersonAdd />
                  </Button>
                </Popover>
              )}
              {imFollowing && (
                <Popover content={`Dejar de seguir`}>
                  <Button
                    danger
                    type="primary"
                    shape="circle"
                    className="flex justify-center items-center"
                    onClick={onClickRemove}
                  >
                    <IoPersonRemove />
                  </Button>
                </Popover>
              )}
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <h2 className="pb-0 mb-0 text-black">{info.name}</h2> &nbsp; &nbsp;
            <h2 className="text-black">{info.lastname}</h2>
          </div>

          <div className="w-[225px] flex flex-row items-center justify-center pt-2">
            <Dropdown
              arrow={{
                pointAtCenter: true,
              }}
              menu={{ items: followers }}
              placement="bottom"
              trigger={["click"]}
            >
              <Button type="text" className="text-[#1677ff]">
                {followers.length} seguidores
              </Button>
            </Dropdown>

            <Dropdown
              arrow={{
                pointAtCenter: true,
              }}
              menu={{ items: follows }}
              placement="bottom"
              trigger={["click"]}
            >
              <Button type="text" className="text-[#1677ff]">
                {follows.length} seguidos
              </Button>
            </Dropdown>
          </div>
          <div className="w-full pt-2">
            <hr />
          </div>

          <div className="max-w-[250px] flex flex-row items-center justify-center p-2 pb-0">
            <PiStudent />
            &nbsp;<p>{major}</p>
          </div>
          <div className="flex items-center justify-center flex-col">
            <div className="flex flex-row items-center">
              <MdMailOutline />
              &nbsp;
              <p>{info.email}</p>
            </div>
            <p>{from ? `Miembro desde ${from.toLocaleDateString()}` : "?"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
