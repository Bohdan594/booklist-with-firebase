import { configureStore } from "@reduxjs/toolkit";
import booksReducer from './booksSlice'
import modalReducer from './modalSlice'
import errorModalReducer from "./errorModalSlice";
import userReducer from './userSlice'

export const store = configureStore({
    reducer: {
        modal: modalReducer,
        errorModal: errorModalReducer,
        books: booksReducer,
        user: userReducer
    },
})