import './BooksPage.scss'
import Header from "../components/Header"
import Book from "../components/Book"
import { useDispatch, useSelector } from 'react-redux'
import { selectBooks } from "../store/booksSlice";
import { fetchBooks } from "../store/booksSlice";
import { useEffect } from "react";

function BooksPage(){

    const dispatch = useDispatch();
    const books = useSelector(selectBooks).books;
    const status = useSelector(selectBooks).status;
    const scrollPos = useSelector(state => state.books.scrollPos);

    useEffect(() => {
        window.scrollTo(0, scrollPos);
    }, []);

    useEffect(() => {
        if(status === "idle"){
            dispatch(fetchBooks());
        }
    }, [])

    return(
        <>
            <section className="container">
                <Header/>
                {status === 'loading' ?
                <p className="fetching-status">Loading ...</p> : status === 'failed' ? 
                <p className="fetching-status">Error fetching the books</p> :
                books.length ? <div className="books-list">
                    {books.map(book => (
                            <Book key={book.id} book={book}/>
                        ))
                    }
                </div> : 
                <p className="fetching-status">Your booklist is empty</p> }
            </section>
        </>
    )

}

export default BooksPage