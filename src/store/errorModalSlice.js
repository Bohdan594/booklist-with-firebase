import { createSlice } from "@reduxjs/toolkit";

export const errorModalSlice = createSlice({

    name: "errorModal",
    initialState: {
        isActive: null,
        isActiveModal: false 
    },

    reducers: {

        activeError: (errorModal, action) => {
            errorModal.isActive = action.payload;
        },

        activeModalError: (errorModal, action) => {
            errorModal.isActiveModal = action.payload;
        }

    }

})

export const { activeError, activeModalError } = errorModalSlice.actions;

export const selectErrorModal = state => state.errorModal;

export default errorModalSlice.reducer;