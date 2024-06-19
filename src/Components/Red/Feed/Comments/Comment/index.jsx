import { Button } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const Comment = ({ commentP }) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState(commentP);
  const user = useSelector((state) => state.user);

  const removeComment = async () => {
    try {
      const res = await axios.delete(
        `${backUrl}/api/content/deleteComment/${comment.id}`,

        { withCredentials: true }
      );
      if (res.status === 200) return res.data;
    } catch (err) {
      console.error(err);
      alert("algo salio mal");
    }
  };

  const goToProfile = (e) => {
    navigate(`/home/red/profile/${comment.commentOwner.id}`);
  };

  const handleRemoveComment = async () => {
    try {
      const result = await removeComment();
      if (result.comment) {
        setComment((cm) => {
          return { ...cm, content: null };
        });
      } else {
        setComment(null);
      }
      alert("comentario eliminado");
      return;
    } catch (err) {
      console.error(err);
      alert("algo salio mal");
    }
  };

  return (
    <div
      className={`w-full  ${
        comment && comment.level == 1 ? "mt-2 mb-2" : ""
      } text-black`}
    >
      {comment && (
        <div className="p-2 pt-0  flex flex-col">
          <div className="flex flex-row">
            <img
              src={`${
                comment.commentOwner.profileImageUrl
                  ? comment.commentOwner.profileImageUrl
                  : "/profileImage.png"
              }`}
              className="w-[32px] h-[32px] rounded-[50%]"
              onClick={goToProfile}
            />
            <div className="flex flex-col ml-2 bg-[#f3f3f3] p-2 pl-4 pr-4 rounded-[10px]">
              <div className="flex flex-row justify-between">
                <p className="pb-0 mb-0">
                  <b>{comment.commentOwner.name}</b>
                </p>
                {user.id === comment.commentOwner.id && (
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    danger
                    className="flex items-center justify-center p-0 m-0"
                    onClick={handleRemoveComment}
                    //onClick={handleDeletePost}
                  >
                    <MdDeleteOutline className="text-[15px] m-0" />
                  </Button>
                )}
              </div>

              <p className="pt-0 mt-0">
                {comment.content ? (
                  comment.content
                ) : (
                  <i className="text-textcol-1">
                    Este comentario fue eliminado.
                  </i>
                )}
              </p>
            </div>
          </div>
          {comment.subComments && comment.subComments.length > 0 && (
            <Button type="link" className="w-fit ml-[26px]">
              Mostrar respuestas
            </Button>
          )}
          <div className="pl-[34px]">
            {comment.subComments &&
              comment.subComments.map((subComment) => {
                return <Comment comment={subComment} key={subComment.id} />;
              })}
          </div>
        </div>
      )}
    </div>
  );
};
