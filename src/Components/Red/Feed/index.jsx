import React, { useEffect, useState } from "react";
import { Post } from "./Post";
import { Button } from "antd";
import { IoMdAdd } from "react-icons/io";
import { CreatePost } from "./CreatePost";
import axios from "axios";
import ReactGA from "react-ga4";

//const backUrl = "http://localhost:8000";
const backUrl = "https://student-sync-back.onrender.com";

export const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [creatingPost, setCreatingPost] = useState(false);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/feed", title: "feed" });
    ReactGA.event({
      category: "Navegación",
      action: "Acceso a posteos",
      label: "Feed",
    });
  }, []);

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
        let rs = result.sort((a, b) => b.id - a.id);
        setPosts(rs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col md:p-4 md:pt-0 ">
      <div className="w-full max-w-[800px]  flex flex-col  justify-center md:p-6 pb-0 m-auto bg-cach-l1 shadow-custom md:rounded-[15px]">
        <div className=" flex md:pb-4 md:pt-0 md:pl-0 md:pr-0 p-4 w-full justify-between">
          <h2 className="text-black">Feed</h2>
          {!creatingPost && (
            <div className=" flex w-full justify-end ">
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
