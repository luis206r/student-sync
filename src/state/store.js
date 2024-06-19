import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import chatsReducer from "./chats";

const store = configureStore({
  reducer: {
    user: userReducer,
    chats: chatsReducer
  },
});

export default store;