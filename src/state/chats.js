import { createAction, createReducer } from "@reduxjs/toolkit";

export const setChats = createAction("SET_MESSAGES");
export const deleteMessage = createAction("DELETE_MESSAGE");
export const addMessage = createAction("ADD_MESSAGE");
export const addChat = createAction("ADD_CHAT");
export const updateChat = createAction("UPDATE_CHAT");

//export const setOnlyMail = createAction("SET_ONLY_MAIL")

const initialState = []

const chatsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setChats, (state, action) => action.payload)

    .addCase(deleteMessage, (state, action) => {
      return [];
    })
    // .addCase(addChat, (state, action) => {
    //   const chat = action.payload;
    //   const exist = state.some((cht) => chat.id === cht.id);
    //   if (!exist) {
    //     return [chat, ...state];
    //   }
    //   return state;
    // })
    .addCase(addChat, (state, action) => {
      const chat = action.payload;
      const existIndex = state.findIndex((cht) => chat.id === cht.id);

      if (existIndex === -1) {
        // Si el chat no existe, lo añadimos al inicio
        return [chat, ...state];
      } else {
        // Si el chat ya existe, lo movemos al inicio
        const newState = [chat, ...state.slice(0, existIndex), ...state.slice(existIndex + 1)];
        return newState;
      }
    })
    .addCase(updateChat, (state, action) => {
      const { chatId, newMessages, newProps } = action.payload;
      let chts = state.map((cht) => {
        if (cht.id === chatId) {
          let t = {
            ...cht,
            messages: [...cht.messages, ...newMessages],
            ...newProps

          }
          return t;
        }
        else return cht;
      });
      return chts;
    })
    // .addCase(addMessage, (state, action) => {
    //   const { chatId, message } = action.payload;
    //   return state.map((chat) => {
    //     if (chat.id === chatId) {
    //       let n = chat.numberOfMessages;
    //       n++;
    //       return {
    //         ...chat,
    //         messages: [message, ...chat.messages],
    //         numberOfMessages: n,
    //       };
    //     } else {
    //       return chat;
    //     }
    //   });
    // })
    .addCase(addMessage, (state, action) => {
      const { chatId, message } = action.payload;
      const chatIndex = state.findIndex((chat) => chat.id === chatId);

      if (chatIndex !== -1) {
        const updatedChat = {
          ...state[chatIndex],
          messages: [message, ...state[chatIndex].messages],
          numberOfMessages: state[chatIndex].numberOfMessages + 1,
        };

        // Eliminamos el chat del array original y lo insertamos al principio
        const newState = [updatedChat, ...state.slice(0, chatIndex), ...state.slice(chatIndex + 1)];
        return newState;
      }

      return state;
    })
});
export default chatsReducer;