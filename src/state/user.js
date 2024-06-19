import { createAction, createReducer } from "@reduxjs/toolkit";

export const setUser = createAction("SET_USER");
//export const setFavorites = createAction("SET_USER_FAVS"); //es otro pedido axios
//export const addToFavs = createAction("ADD_TO_FAVORITES");
//export const removeFromFavs = createAction("REMOVE_FROM_FAVORITES");
export const clearUser = createAction("CLEAR_USER");
export const updateFollowers = createAction("UPDATE_FOLLOWERS");
export const updateFollows = createAction("UPDATE_FOLLOWS");
export const updateContactStatus = createAction("UPDATE_CONTACT_STATUS");

//export const setOnlyMail = createAction("SET_ONLY_MAIL")

const initialState = {
  id: null,
  name: null,
  lastname: null,
  email: null,
  profileImageUrl: null,
  role: null,
  roleInfo: null,
  followers: null,
  follows: null,
  status: null
}

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setUser, (state, action) => {
      return { ...action.payload, status: "online" }
    })
    // .addCase(setFavorites, (state, action) => {
    //   return {
    //     ...state,
    //     favorites: action.payload
    //   };
    // })
    .addCase(clearUser, (state, action) => {
      return {
        id: null,
        name: null,
        lastname: null,
        email: null,
        profileImageUrl: null,
        role: null,
        roleInfo: null,
        followers: null,
        follows: null,
        status: null
      };
    })
    .addCase(updateFollowers, (state, action) => {
      return {
        ...state,
        followers: action.payload
      }
    })
    .addCase(updateFollows, (state, action) => {
      return {
        ...state,
        follows: action.payload
      }
    })
    .addCase(updateContactStatus, (state, action) => {
      const onlineContacts = action.payload; // Array de objetos con userId y otras propiedades

      // Actualizar followers
      const updatedFollows = state.follows.map(follow => {
        if (onlineContacts.some(contact => contact.userId === follow.id)) {
          return { ...follow, status: "online" };
        } else {
          return { ...follow, status: "offline" };
        }
      });

      // Actualizar followers
      const updatedFollowers = state.followers.map(follower => {
        if (onlineContacts.some(contact => contact.userId === follower.id)) {
          return { ...follower, status: "online" };
        } else {
          return { ...follower, status: "offline" };
        }
      });

      // Actualizar el estado con los nuevos arrays actualizados
      return {
        ...state,
        follows: updatedFollows,
        followers: updatedFollowers,
      };
    });
  // .addCase(setOnlyMail, (state, action) => {
  //   return {
  //     ...state,
  //     email: action.payload
  //   };
  // });
});
export default userReducer;