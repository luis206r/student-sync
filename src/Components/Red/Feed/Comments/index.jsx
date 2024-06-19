import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Comment } from "./Comment";
import TextArea from "antd/es/input/TextArea";
import { Button, ConfigProvider, Input } from "antd";
import { IoSend } from "react-icons/io5";
import useInput from "../../../../Utils/useInput";
import axios from "axios";
import ReactGA from "react-ga4";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const Comments = ({ commentsP, contentId }) => {
  const [comments, setComments] = useState(commentsP);
  const user = useSelector((state) => state.user);
  const commentText = useInput();

  //=============================Back requets=============================

  const addComment = async () => {
    try {
      const res = await axios.post(
        `${backUrl}/api/content/addComment/${user.id}/${contentId}`,
        { text: commentText.value },
        { withCredentials: true }
      );
      if (res.status === 201) return res.data.createdComment;
    } catch (err) {
      console.error(err);
      alert("algo salio mal");
    }
  };

  //======================================================================

  const handleAddComment = async () => {
    try {
      if (commentText.value.length == 0) {
        alert("comentario invalido");
        return;
      }
      let result = await addComment();
      result = {
        ...result,
        commentOwner: {
          id: user.id,
          email: user.email,
          name: user.name,
          lastname: user.lastname,
          profileImageUrl: user.profileImageUrl,
          role: user.role,
        },
      };
      setComments((prevcomments) => {
        return [result, ...prevcomments];
      });

      ReactGA.event({
        category: "Click",
        action: "Agregar Comentario",
        label: "Post",
      });

      alert("se agregó el comentario");
      return;
    } catch (err) {
      console.error(err);
      alert("algo salio mal");
    }
  };

  return (
    <div className="w-full">
      <div className="pl-2 pr-2 pt-2 flex flex-col  w-full">
        <div
          className={` flex flex-row h-fit ${
            comments.length > 0 ? "pb-2" : "pb-4"
          }`}
        >
          <img
            src={`${
              user.profileImageUrl ? user.profileImageUrl : "/profileImage.png"
            }`}
            className="w-[32px] h-[32px] rounded-[50%] mt-1"
          />
          <div className="w-full pl-2">
            <ConfigProvider
              theme={{
                components: {
                  Input: {
                    activeBg: "#f3f3f3",
                    //activeBorderColor: "#f3f3f3",
                    //hoverBorderColor: "#f3f3f3",
                    hoverBg: "#f3f3f3",
                  },
                },
              }}
            >
              <TextArea
                className="bg-[#f3f3f3] border-[#f3f3f3] text-black p-[8px] rounded-[10px] text-[16px]"
                placeholder="Agregar comentario"
                autoSize
                maxLength={300}
                style={{ resize: "none" }}
                {...commentText}
              />
            </ConfigProvider>
          </div>

          <Button
            className="w-fit ml-2 flex items-center justify-center mt-1"
            type="primary"
            shape="circle"
            onClick={handleAddComment}
          >
            <IoSend />
          </Button>
        </div>
      </div>

      {comments.map((comment) => {
        return <Comment commentP={comment} key={comment.id} />;
      })}
    </div>
  );
};
