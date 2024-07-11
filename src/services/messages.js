import axios from "axios";
const backUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: backUrl,
  withCredentials: true,
});

//==========================================================================

export const chatsService = async (userId) => {
  try {
    const res = await axiosInstance.get(`/api/messages/getAllChats/${userId}`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (err) {
    console.error(err);
  }
};
