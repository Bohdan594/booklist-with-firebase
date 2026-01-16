import './AddBook.scss'
import { useDispatch, useSelector } from 'react-redux';
import { addBook, selectBooks } from '../store/booksSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ErrorModal from './modals/errorModal';
import { selectErrorModal } from '../store/errorModalSlice';
import { activeError } from '../store/errorModalSlice';
import { activeModalError } from '../store/errorModalSlice';
import { setScrollPos } from '../store/booksSlice';

function AddBook(){

    const [mandatory, setMandatory] = useState(false);
    const [btnNotAct, setBtnNotAct] = useState(false);
    const modal = useSelector(selectErrorModal).isActive;
    const error = useSelector(selectErrorModal).isActiveModal;
    const status = useSelector(selectBooks).status;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function addBookHandler(e){

        setBtnNotAct(true);

        e.preventDefault();

        let book = {
            title: document.querySelector('input[name="title"]').value,
            cover: document.querySelector('input[name="cover"]').value,
            isRead: false,
            author: document.querySelector('input[name="author"]').value,
            synopsis: document.querySelector('textarea[name="synopsis"]').value
        };

        if(book.title && book.author){
            dispatch(addBook(book)).then((response) => {
                if(response.error){
                    dispatch(activeError("err-adding-book"));
                    dispatch(activeModalError(true))
                    setBtnNotAct(false);
                } else {
                    dispatch(setScrollPos(0));
                    if(modal === "err-adding-book"){
                        dispatch(activeError(null));
                    }
                    navigate("/");
                    setMandatory(false);
                }
            });
        } else {
            setMandatory(true);
            setBtnNotAct(false);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    },[])

    return(
        <>
            <section className='add-book-section'>
                { modal === "err-adding-book" && error && <ErrorModal>
                    Error adding the book
                </ErrorModal>}
                <h1>Add Book</h1>
                <form className='add-form'>
                    <div className='form-title'>
                        <label htmlFor="title">Title</label>
                        <input id='title' className={mandatory ? 'red-txt' : ''} name='title' type="text" placeholder='Write title...'/>
                    </div>
                    
                    <div className='form-author'>
                        <label htmlFor="author">Author</label>
                        <input className={mandatory ? 'red-txt' : ''} id='author' name='author' type="text" placeholder='Write author...'/>
                    </div>

                    <div className='form-cover'>
                        <label htmlFor="cover">Cover</label>
                        <input id='cover' name='cover' type="text" placeholder='Write cover...'/>
                    </div>

                    <div className="form-synopsis">
                        <label>Synopsis</label>
                        <textarea id='synopsis' type="text" name="synopsis" placeholder="Add a synopsis..." />
                    </div>

                    <button disabled={btnNotAct} onClick={(e) => addBookHandler(e)}>{status === "loading" ? "Loading ..." : "Save book"}</button>
                </form>

                {
                    mandatory &&
                    <p className='mandatory-fields'>You need to fill the mandatory fields</p>
                }
            </section>
        </>
    )

}

export default AddBook