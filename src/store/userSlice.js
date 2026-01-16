import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({

    name: "user",
    initialState: {
        activeUser: null,
    },

    reducers: {

        changeActiveUser: (user, action) => {
            user.activeUser = action.payload;
        },

    }

})

export const { changeActiveUser } = userSlice.actions;

export const selectUser = state => state.user;

export default userSlice.reducer;