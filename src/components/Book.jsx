import './Book.scss'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { changeIsRead, selectBooks, setScrollPos } from '../store/booksSlice'
import { useState } from 'react'
import { activeError } from '../store/errorModalSlice'
import { selectErrorModal } from '../store/errorModalSlice'

function Book({book}){

    const dispatch = useDispatch();
    const fallbackImage = '/bookImg.jpg';
    const [imgSrc, setImgSrc] = useState(book.cover ? book.cover : fallbackImage);
    const status = useSelector(selectBooks).status;
    const modal = useSelector(selectErrorModal).isActive

    function handleIsRead(e, id, isRead){
        e.preventDefault();
        dispatch(changeIsRead({id: id, isRead: isRead})).then((response) => {
            if(response.error){
                dispatch(activeError("err-changing-isRead"));
                console.error(error);
            } else {
                if(modal === "err-adding-book"){
                    dispatch(activeError(null));
                }
            }
        });
    }

    return(
        <>

            <div className='book-part'>

                <Link to={`/book/${book.id}`} onClick={() => dispatch(setScrollPos(window.scrollY))}>

                    <div className='book-image'>
                        {
                            book.isRead &&
                            <i onClick={(e) => handleIsRead(e, book.id, book.isRead)} className="fa-solid fa-eye icon" style={{color: '#ffffff'}}></i>
                        }  
                        <img src={imgSrc} alt="book" onError={() => setImgSrc(fallbackImage)}/>
                        {imgSrc === '/bookImg.jpg' && <p className='book-title'>{book.title.length > 50 ? book.title.slice(0, 50).trim() + '...' : book.title}</p>}
                        <button onClick={(e) => handleIsRead(e, book.id, book.isRead)} className={`${book.isRead ? 'isRead' : ''}`}>
                            <p>{status === 'isRead-loading' ? "Loading ..." : book.isRead ? "You already read it" : "You didn't read it"}</p>
                        </button>
                    </div>

                </Link>

                <div className='book-information'>
                    <h3>{book.author.length > 20 ? book.author.slice(0, 20).trim() + '...' : book.author}</h3>
                    <p>{book.title.length > 25 ? book.title.slice(0, 25).trim() + '...' : book.title}</p>
                </div>
                    
            </div>
            
        </>
    )

}

export default Book