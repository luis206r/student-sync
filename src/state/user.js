import { createAction, createReducer } from "@reduxjs/toolkit";

export const setUser = createAction("SET_USER");
//export const setFavorites = createAction("SET_USER_FAVS"); //es otro pedido axios
//export const addToFavs = createAction("ADD_TO_FAVORITES");
//export const removeFromFavs = createAction("REMOVE_FROM_FAVORITES");
export const clearUser = createAction("CLEAR_USER");
export const updateFollowers = createAction("UPDATE_FOLLOWERS");
export const updateFollows = createAction("UPDATE_FOLLOWS");

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
  follows: null
}

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setUser, (state, action) => action.payload)
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
        follows: null
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
    });
  // .addCase(setOnlyMail, (state, action) => {
  //   return {
  //     ...state,
  //     email: action.payload
  //   };
  // });
});
export default userReducer;