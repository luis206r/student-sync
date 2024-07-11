import axios from "axios";
const backUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: backUrl,
  withCredentials: true,
});

//=====================================================================================//

export const meService = async () => {
  try {
    const res = await axiosInstance.get(
      `/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
    return res;
  }
  catch (err) {
    throw err;
  }
}

export const googleLoginService = async (email, profileImageUrl) => {
  try {
    const res = axiosInstance.post(`/api/users/googleLogin`,
      {
        email: email,
        profileImageUrl: profileImageUrl,
      }
    );
    return res;
  }
  catch (err) {
    throw err;
  }
}

export const loginService = async (email, password) => {
  try {
    const res = await axiosInstance.post(`/api/users/login`,
      {
        email: email,
        password: password,
      }
    );
    return res;
  } catch (err) {
    throw err;
  }
}

export const findEmailService = async (email) => {
  try {
    const res = await axiosInstance.post(
      `/api/users/findEmail`,
      {
        email: email,
      },
    );
    return res;
  }
  catch (err) {
    throw err;
  }
}

export const registerService = async (props) => {
  try {
    const res = await axiosInstance.post(`/api/users/register`, props);
    return res;
  }
  catch (err) { throw err; }
}

export const registerGoogleService = async (props) => {
  try {
    const res = await axiosInstance.post(
      `/api/users/googleRegister`, props);
    return res;
  }
  catch (err) { throw err; }
}


