import './SingleBookPage.scss'
import { Link, useParams } from 'react-router-dom'
import Notes from '../components/Notes'
import { useSelector, useDispatch } from 'react-redux'
import Modal from '../components/modals/Modal'
import AreYouSure from '../components/modals/AreYouSure'
import { selectModal } from '../store/modalSlice'
import { changeIsActive } from '../store/modalSlice'
import { useEffect, useState } from 'react'
import { doc, getDoc } from "firebase/firestore"
import { db } from '../firebase/config'
import ErrorModal from '../components/modals/errorModal'
import { selectErrorModal } from '../store/errorModalSlice'

function SingleBook(){

    const {id} = useParams();
    const dispatch = useDispatch();
    const fallbackImage = '/bookImg1.jpg';
    const [status, setStatus] = useState("idle");
    const [book, setBook] = useState(null);
    const [fullInfo, setFullInfo] = useState(false);
    const modal = useSelector(selectModal);
    const error = useSelector(selectErrorModal).isActive;
    const errorIs = useSelector(selectErrorModal).isActiveModal;

    function handleIsActive(){
        dispatch(changeIsActive());
    }

    async function fetchBook(book_id){
        try{
            const docRef = doc(db, "books", book_id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setBook({...docSnap.data(), id: docSnap.id, cover: docSnap.data().cover ? docSnap.data().cover : fallbackImage});
            }

            setStatus("success");
        } catch(err) {
            console.log(err)
            setStatus("error");
        }
    }

    useEffect(() => {
        if(status === "idle"){
            fetchBook(id);
        }
    },[])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return(
        <>
            <section className='container'>
                <div className='single-book'>

                    {error === "err-erasing-book" && errorIs && <ErrorModal>
                        Error erasing the book
                    </ErrorModal>}

                    { error === "err-changing-isRead" && errorIs && <ErrorModal>
                        Error changing the property
                    </ErrorModal>}

                    { error === "err-adding-note" && errorIs && <ErrorModal>
                        Error adding the note
                    </ErrorModal>}

                    { error === "err-erasing-note" && errorIs && <ErrorModal>
                        Error erasing the note
                    </ErrorModal>}

                    {fullInfo && <div className='full-info'>
                        <div className='main-info-section'>
                            <button onClick={() => setFullInfo(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                                <path fill="currentColor"
                                    d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z" />
                                </svg>
                            </button>
                            <p className='author'>Author: {book.author}</p>
                            <p className='title'>Title: {book.title}</p>
                            <p className='synopsis'>{book.synopsis}</p>
                        </div>
                    </div>}

                    {
                        modal.isActive &&
                        <Modal>
                            <AreYouSure/>
                        </Modal>
                    }
                    <Link to='/'>
                        <button className='btn-back'>
                            ← Back
                        </button>
                    </Link>
                {
                    book ? (
                        <>
                            <div className='book-info'>
                                <div className='book-img'>
                                    <img src={book.cover} alt="book" onError={() => setBook({...book, cover: fallbackImage})}/>
                                    {book.cover === '/bookImg1.jpg' && <p>{book.title.length > 60 ? book.title.slice(0, 60).trim() + '...' : book.title}</p>}
                                </div>
                                <div className='text'>
                                    <h2>{book.author.length > 25 ? book.author.slice(0, 25).trim() + '...' : book.author}</h2>
                                    <h3>{book.title.length > 60 ? book.title.slice(0, 60).trim() + '...' : book.title}</h3>
                                    {book.synopsis && <p>{book.synopsis.length > 450 ? book.synopsis.slice(0, 450).trim() + '...' : book.synopsis}</p>}
                                    {(book.author.length > 25 ||
                                    book.title.length > 60 ||
                                    book.synopsis.length > 250) && (
                                        <div onClick={() => setFullInfo(true)} className='see-full'>See full information</div>
                                    )}
                                    <div onClick={() => handleIsActive()} className='erase-btn'>Erase book</div>
                                </div>
                            </div>

                            <Notes/>
                        </>) : status === 'success' && !book ?
                    (<p className='err'>This book was not found</p>) :
                    status === 'error' ?
                    (<p className='err'>Error fetching the book</p>) :
                    (<p className='err'>Loading ...</p>)
                }

                </div>
            </section>
        </>
    )

}

export default SingleBook