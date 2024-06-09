import React, { useEffect, useState } from "react";
import { Post } from "./Post";
import { Button } from "antd";
import { IoMdAdd } from "react-icons/io";
import { CreatePost } from "./CreatePost";
import axios from "axios";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [creatingPost, setCreatingPost] = useState(false);

  //==========back requests=====================

  const getPosts = async () => {
    try {
      const res = await axios.get(
        `${backUrl}/api/content/getPosts`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        return res.data.posts;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePostFromArray = (contentId) => {
    setPosts(() => {
      let temp = posts.filter((post) => post.postInfo.contentId !== contentId);
      return temp;
    });
  };

  const addPostToArray = (data) => {
    const prevPosts = posts;
    setPosts(() => {
      return [data, ...prevPosts];
    });
  };

  const execAddPostToArray = (data) => addPostToArray(data);
  const execDeletePostFromArray = (id) => deletePostFromArray(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await getPosts();
        console.log("pots: ", result);
        setPosts(result.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col md:p-4 ">
      <div className=" flex md:pb-4 md:pt-0 md:pl-0 md:pr-0 p-4 w-full justify-between">
        <h2 className="text-black">Feed</h2>
        {!creatingPost && (
          <div className="md:hidden flex w-full justify-end ">
            <Button
              size="large"
              type="primary"
              className=""
              onClick={() => setCreatingPost(true)}
            >
              Crear post
            </Button>
            {/* <Button  type="primary">
            Crear Evento
          </Button> */}
          </div>
        )}
      </div>

      <div className="w-full max-w-[750px]  flex flex-col  justify-center md:p-4 pb-0 m-auto">
        {!creatingPost && (
          <div className="hidden md:flex flex-row m-auto w-full  pl-4 md:pl-0 pb-4">
            <Button
              size="large"
              type="primary"
              className="mr-4"
              onClick={() => setCreatingPost(true)}
            >
              Crear post
            </Button>
            {/* <Button  type="primary">
            Crear Evento
          </Button> */}
          </div>
        )}
        {creatingPost && (
          <CreatePost
            cancelFunc={() => setCreatingPost(false)}
            addFunc={execAddPostToArray}
          />
        )}
        {posts.map((post) => {
          return (
            <Post
              key={post.postInfo.id}
              contentInfo={post.postInfo}
              userInfo={post.User}
              delFunc={execDeletePostFromArray}
              reactions={post.reactions}
              comments={post.comments}
            />
          );
        })}
      </div>
    </div>
  );
};
