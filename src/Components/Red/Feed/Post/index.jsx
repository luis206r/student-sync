import React, { useEffect, useState } from "react";
import RichTextEditor2 from "../../../RichTextEditor2";
import { MdDeleteOutline } from "react-icons/md";
import { Button, ConfigProvider, Input, Popover, Space } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import { BiRepost, BiSolidCommentDetail, BiSolidLike } from "react-icons/bi";
import { PiShareFatFill } from "react-icons/pi";
import TextArea from "antd/es/input/TextArea";
import { IoSend } from "react-icons/io5";
import useInput from "../../../../Utils/useInput";
import { Comments } from "../Comments";
import ReactGA from "react-ga4";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

function obtenerReaccionesMasFrecuentes(reacciones) {
  // Objeto para almacenar la frecuencia de cada tipo de reacción
  const frecuenciaReacciones = {};
  // Calcular la frecuencia de cada tipo de reacción
  reacciones.forEach((reaccion) => {
    const tipo = reaccion.type;
    frecuenciaReacciones[tipo] = (frecuenciaReacciones[tipo] || 0) + 1;
  });
  // Convertir el objeto de frecuencias a un array de pares [tipo, frecuencia]
  const frecuenciaArray = Object.entries(frecuenciaReacciones);
  // Ordenar el array de frecuencias en orden descendente por la frecuencia
  frecuenciaArray.sort((a, b) => b[1] - a[1]);
  // Obtener solo los tipos de reacción ordenados
  const reaccionesOrdenadas = frecuenciaArray.map((pair) => pair[0]);
  // Devolver el array de tipos de reacción ordenados
  return reaccionesOrdenadas;
}

export const Post = ({
  contentInfo,
  userInfo,
  delFunc,
  reactions,
  comments,
}) => {
  const commentText = useInput();
  const [clickedComments, setClickedComments] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const user = useSelector((state) => state.user);
  const [postReactions, setPostReactions] = useState(reactions);
  const [mfr, setMfr] = useState(null);
  const [deletingPost, setDeletingPost] = useState(false);

  //==================back request==========================
  const deletePostRequest = async () => {
    try {
      const res = await axios.delete(
        `${backUrl}/api/content/deletePost/${contentInfo.contentId}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        return true;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const addReaction = async (type) => {
    try {
      const res = await axios.post(
        `${backUrl}/api/content/addReaction/${user.id}/${contentInfo.contentId}`,
        { type: type },
        { withCredentials: true }
      );
      if (res.status === 201 || res.status === 200) return res.data;
    } catch (err) {
      console.error(err);
      alert("algo salio mal");
    }
  };

  const removeReaction = async () => {
    try {
      const res = await axios.delete(
        `${backUrl}/api/content/removeReaction/${user.id}/${contentInfo.contentId}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) return res.data;
    } catch (err) {
      console.error(err);
      alert("algo salio mal");
    }
  };

  //============================================================

  const handleSelectReaction = async (type) => {
    try {
      const result = await addReaction(type);
      if (result) {
        console.log("operacion realizada");
        setSelectedReaction(type);

        ReactGA.event({
          category: "Click",
          action: "Agregar Reacción",
          label: "Post",
        });

        // Buscar si el usuario ya ha reaccionado anteriormente
        const existingReactionIndex = postReactions.findIndex(
          (reaction) => reaction.UserId === user.id
        );

        // Si el usuario ya ha reaccionado, actualiza el tipo de reacción
        if (existingReactionIndex !== -1) {
          setPostReactions((prevReactions) => {
            const updatedReactions = [...prevReactions];
            updatedReactions[existingReactionIndex].type = type;
            return updatedReactions;
          });
        } else {
          // Si el usuario no ha reaccionado anteriormente, agrega una nueva reacción
          setPostReactions((prevReactions) => [
            ...prevReactions,
            { type: type, UserId: user.id },
          ]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnselectReaction = async () => {
    try {
      const result = await removeReaction();
      if (result) {
        console.log("operacion realizada");
        setSelectedReaction(null);
        let pr = postReactions.filter((r) => r.UserId != user.id);
        setPostReactions(pr);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePost = async () => {
    setDeletingPost(true);
    const result = await deletePostRequest();
    if (result === true) {
      delFunc(contentInfo.contentId);
      alert("Se eliminó el post");
      setDeletingPost(false);
      return;
    } else {
      alert("No se pudo eliminar el post");
      return;
    }
  };

  useEffect(() => {
    const t = obtenerReaccionesMasFrecuentes(postReactions);
    setMfr(t);
  }, [postReactions]);

  useEffect(() => {
    const existingReactionIndex = reactions.findIndex(
      (reaction) => reaction.UserId === user.id
    );
    if (existingReactionIndex !== -1) {
      setSelectedReaction(() => {
        return reactions[existingReactionIndex].type;
      });
    }
  }, []);

  const createdAt = new Date(contentInfo.createdAt);
  return (
    <div className="w-full p-4 pb-1 bg-white md:mb-4 mb-[1px] md:rounded-[10px] shadow-lg md:border-[1px] relative">
      {deletingPost && (
        <div className="absolute  left-[0%] top-[0%]  rounded-[10px] z-10 w-full bg-[#f7f7f7] h-full flex flex-col items-center justify-center bg-opacity-80">
          <span>Eliminando Post...</span> &nbsp;{" "}
          <div role="status">
            <svg
              aria-hidden="true"
              class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="flex flex-row md:p-2 items-center w-full">
        <img
          src={`${
            userInfo.profileImageUrl
              ? userInfo.profileImageUrl
              : "/profileImage.png"
          }`}
          className="w-[35px] h-[35px] rounded-[50%]"
        />
        <div className="w-full">
          <h4 className="pl-2 text-black">
            {userInfo.name.trim().split(" ")[0]}{" "}
            {userInfo.lastname.trim().split(" ")[0]}
          </h4>
        </div>
        <div className="flex justify-end w-full flex-wrap pr-2 items-center">
          <p>
            {createdAt
              .toLocaleDateString()
              .slice(0, -5)
              .split("/")
              .reverse()
              .join("/")}
          </p>{" "}
          &nbsp;·&nbsp;
          <p>
            {createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          &nbsp;·&nbsp;
          {user.id === userInfo.id && (
            <Button
              type="text"
              shape="circle"
              danger
              className="flex items-center justify-center"
              onClick={handleDeletePost}
            >
              <MdDeleteOutline className="text-[25px]" />
            </Button>
          )}
        </div>
      </div>
      <div className="md:p-2 pt-2 pb-2">
        <RichTextEditor2 editorState={contentInfo.content} />
      </div>

      {contentInfo.driveId && (
        <div className="p-1 rounded-[8px] bg-[#e8e8e8] flex justify-center w-full">
          <img
            src={`https://drive.google.com/thumbnail?id=${contentInfo.driveId}&sz=w1000`}
            className="rounded-[6px] "
          />
        </div>
      )}
      {postReactions && postReactions.length > 0 && (
        <div className="p-1 pl-0 flex flex-row w-full justify-between items-center">
          <Button className="p-0" type="text">
            <div className="flex flex-row items-center">
              <div>
                {mfr &&
                  mfr.map((r, i) => {
                    if (i < 3) {
                      return r === "laugh"
                        ? "😁"
                        : r === "sad"
                        ? "😞"
                        : r === "love"
                        ? "❤️"
                        : r === "surprise"
                        ? "😯"
                        : r === "claps"
                        ? "👏"
                        : "👍";
                    }
                  })}
              </div>{" "}
              &nbsp;
              <div>{postReactions.length}</div> &nbsp;
            </div>
          </Button>
          {comments.length > 0 && <span>{comments.length} comentario(s)</span>}
        </div>
      )}
      <hr />
      <div className=" pt-1  flex items-center justify-between w-full">
        <div className="w-[33.3%] flex items-center justify-center">
          <Popover
            placement="top"
            content={
              <div>
                <Button
                  size="large"
                  icon={"👍"}
                  type="text"
                  className="m-0"
                  onClick={(e) => handleSelectReaction("like")}
                />{" "}
                {/*like*/}
                <Button
                  size="large"
                  icon={"😁"}
                  type="text"
                  onClick={(e) => handleSelectReaction("laugh")}
                />{" "}
                {/*laugh*/}
                <Button
                  size="large"
                  icon={"👏"}
                  type="text"
                  onClick={(e) => handleSelectReaction("claps")}
                />{" "}
                {/*claps*/}
                <Button
                  size="large"
                  icon={"❤️"}
                  type="text"
                  onClick={(e) => handleSelectReaction("love")}
                />{" "}
                {/*love*/}
                <Button
                  size="large"
                  icon={"😯"}
                  type="text"
                  onClick={(e) => handleSelectReaction("surprise")}
                />{" "}
                {/*surprise*/}
                <Button
                  size="large"
                  icon={"😞"}
                  type="text"
                  onClick={(e) => handleSelectReaction("sad")}
                />{" "}
                {/*sad*/}
              </div>
            }
          >
            <Button
              className="flex flex-row items-center justify-center w-full"
              type="text"
              icon={
                selectedReaction === "laugh" ? (
                  "😁"
                ) : selectedReaction === "sad" ? (
                  "😞"
                ) : selectedReaction === "claps" ? (
                  "👏"
                ) : selectedReaction === "love" ? (
                  "❤️"
                ) : selectedReaction === "surprise" ? (
                  "😯"
                ) : selectedReaction === "like" ? (
                  <BiSolidLike className={`mt-[2px] text-[#1677ff]`} />
                ) : (
                  <BiSolidLike className={`mt-[2px]`} />
                )
              }
              onClick={(e) => {
                selectedReaction
                  ? handleUnselectReaction()
                  : handleSelectReaction("like");
              }}
            >
              {!selectedReaction && <span className={``}>Me gusta</span>}
              {selectedReaction === "like" && (
                <span className={`text-[#1677ff]`}>Me gusta</span>
              )}
              {selectedReaction === "laugh" && (
                <span className={`text-[#fdb846]`}>Me divierte</span>
              )}
              {selectedReaction === "sad" && (
                <span className={`text-[#fdb846]`}>Me entristece</span>
              )}
              {selectedReaction === "love" && (
                <span className={`text-[#c33937]`}>Me encanta</span>
              )}
              {selectedReaction === "claps" && (
                <span className={`text-[#fdb846]`}>Felicitar</span>
              )}
              {selectedReaction === "surprise" && (
                <span className={`text-[#fdb846]`}>Me asombra</span>
              )}
            </Button>
          </Popover>
        </div>
        <div className="w-[33.3%] flex items-center justify-center">
          <Button
            className="flex flex-row items-center"
            type="text"
            icon={<BiSolidCommentDetail className="mt-[2px]" />}
            onClick={(e) => {
              setClickedComments(true);
              ReactGA.event({
                category: "Click",
                action: "Ver comentarios",
                label: "Post",
              });
            }}
          >
            Comentar
          </Button>
        </div>
        <div className="w-[33.3%] flex items-center justify-center">
          <Button
            disabled
            className="flex flex-row items-center"
            type="text"
            icon={<PiShareFatFill className="mt-[2px]" />}
          >
            Compartir
          </Button>
        </div>
      </div>
      {
        clickedComments && (
          <Comments commentsP={comments} contentId={contentInfo.contentId} />
        ) /* */
      }
    </div>
  );
};
