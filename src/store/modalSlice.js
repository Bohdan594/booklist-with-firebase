import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({

    name: "modal",
    initialState: {
        isActive: false,
    },

    reducers: {

        changeIsActive: (modal) => {
            modal.isActive = !modal.isActive;
        },

    }

})

export const { changeIsActive } = modalSlice.actions;

export const selectModal = state => state.modal;

export default modalSlice.reducer;