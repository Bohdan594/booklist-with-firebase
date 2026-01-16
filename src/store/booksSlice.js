import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, query, 
         where, getDocs, 
         updateDoc, doc,
         deleteDoc, addDoc } from "firebase/firestore";
import { db, auth } from '../firebase/config.js'

export const booksSlice = createSlice({

    name: "books",
    initialState: {
        books: [],
        status: "idle",
        scrollPos: 0
    },

    reducers: {

        setScrollPos(state, action) {
            state.scrollPos = action.payload;
        }

    },
    extraReducers: builder => {
        builder
        // fetching the books
        .addCase(fetchBooks.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(fetchBooks.fulfilled, (state, action) => {
            state.books = action.payload
            state.status = 'succeeded'
        })
        .addCase(fetchBooks.rejected, (state, action) => {
            state.status = 'failed'
            console.error(action.error.message)
        })
        // changing isRead property
        .addCase(changeIsRead.pending, (state, action) => {
            state.status = 'isRead-loading'
        })
        .addCase(changeIsRead.fulfilled, (state, action) => {
            let book = state.books.find(book => book.id == action.payload);
            if(book){
                book.isRead = !book.isRead;
            }
            state.status = 'succeeded'
        })
        .addCase(changeIsRead.rejected, (state, action) => {
            state.status = 'failed'
            console.error(action.error.message)
        })
        // erase the book
        .addCase(eraseBook.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(eraseBook.fulfilled, (state, action) => {
            state.books = state.books.filter(book => book.id != action.payload);
            state.status = 'idle'
        })
        .addCase(eraseBook.rejected, (state, action) => {
            state.status = 'failed'
            console.error(action.error.message)
        })
        // add a new book
        .addCase(addBook.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(addBook.fulfilled, (state, action) => {
            state.books.push(action.payload);
            state.books.sort((a, b) => a.book_num - b.book_num)
            state.status = 'idle'
        })
        .addCase(addBook.rejected, (state, action) => {
            state.status = 'failed'
            console.error(action.error.message)
        })
    }

})

export const { setScrollPos } = booksSlice.actions;

export const selectBooks = state => state.books;

export default booksSlice.reducer;

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
    const q = query(collection(db, "books"), where("user_id", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    let bookList = [];

    querySnapshot.forEach((doc) => {
        bookList.push({...doc.data(), id: doc.id});
    });

    bookList.sort((a, b) => a.book_num - b.book_num);

    return bookList
})

export const changeIsRead = createAsyncThunk('books/changeIsRead', async (payload) => {
    const book = doc(db, "books", payload.id);

    await updateDoc(book, {
        isRead: !payload.isRead
    });

    return payload.id
})

export const eraseBook = createAsyncThunk('books/eraseBook', async (payload) => {

    const q = query(collection(db, "notes"), where("book_id", "==", payload.id));
    const querySnapshot = await getDocs(q);

    const deleteNotes = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "notes", docSnap.id))
    );

    await Promise.all(deleteNotes);

    await deleteDoc(doc(db, "books", payload.id));
    return payload.id
})

export const addBook = createAsyncThunk('books/addBook', async (payload) => {

    const q = query(collection(db, "books"), where("user_id", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    let bookList = [];

    querySnapshot.forEach((doc) => {
        bookList.push({...doc.data(), id: doc.id});
    });

    const num = bookList.length === 0 ? 1 : Math.max(...bookList.map(book => book.book_num)) + 1;

    let book = {...payload, book_num: num, user_id: auth.currentUser.uid};
    const docRef = await addDoc(collection(db, "books"), book);
    return {...book, id: docRef.id}
})