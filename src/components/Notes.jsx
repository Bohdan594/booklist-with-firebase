import './Notes.scss'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase/config'
import { addDoc, deleteDoc, doc } from 'firebase/firestore';
import { selectErrorModal, activeError, activeModalError } from '../store/errorModalSlice';
import { useDispatch, useSelector } from 'react-redux';

function Notes(){

    const dispatch = useDispatch();
    const {id} = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isMandatory, setIsMandatory] = useState(false);
    const [bookNotes, setBookNotes] = useState([])
    const [status, setStatus] = useState("idle");
    const [areYouSure, setAreYouSure] = useState(false);
    const [note_id, setNote_id] = useState(null);
    const [addingStatus, setAddingStatus] = useState("idle");
    const err = useSelector(selectErrorModal).isActive;

    const eraseNoteHandler = async (noteId) => {
        try{
            await deleteDoc(doc(db, "notes", noteId));
            const newNotes = bookNotes.filter(note => note.id !== noteId);
            setBookNotes(newNotes);

            if(err === "err-erasing-note"){
                dispatch(activeError(null));
            }
        }catch(error){
            console.error(error);
            dispatch(activeError("err-erasing-note"));
            dispatch(activeModalError(true));
        }
    }

    const addNoteHandler = async (e, bookId) => {
        e.preventDefault();
        
        let note = {
            book_id: id,
            title: document.querySelector('input[name="title"]').value,
            text: document.querySelector('textarea[name="information"]').value
        };

        if(note.title && note.text){

            try{
                setAddingStatus("loading");

                const q = query(collection(db, "notes"), where("book_id", "==", bookId));
                const querySnapshot = await getDocs(q);
                let notesList = [];

                querySnapshot.forEach((doc) => {
                    notesList.push({id: doc.id, ...doc.data()});
                });

                const num = notesList.length === 0 ? 1 : Math.max(...notesList.map(note => note.note_num)) + 1;

                const noteWithNum = {...note, note_num: num};
                const docRef = await addDoc(collection(db, "notes"), noteWithNum);
                const noteWithId = {...noteWithNum, id: docRef.id}

                setBookNotes([...bookNotes, noteWithId].sort((a, b) => a.note_num - b.note_num));
                setIsMandatory(false);

                document.querySelector('input[name="title"]').value = '';
                document.querySelector('textarea[name="information"]').value = '';

                if(err === "err-adding-note"){
                    dispatch(activeError(null));
                }

                setAddingStatus("success");
            }catch(error){
                console.error(error);
                setAddingStatus("error");
                dispatch(activeError("err-adding-note"));
                dispatch(activeModalError(true));
            }

        } else {
            setIsMandatory(true);
        }
    }

    const fetchNotes = async (bookId) => {
        try{
            const q = query(collection(db, "notes"), where("book_id", "==", bookId));
            const querySnapshot = await getDocs(q);
            let notesList = [];

            querySnapshot.forEach((doc) => {
                notesList.push({id: doc.id, ...doc.data()});
            });

            setBookNotes([...notesList].sort((a, b) => a.note_num - b.note_num));
            setStatus("success");
        }catch(error){
            console.error(error);
            setStatus("error")
        }
    }

    useEffect(() => {
        if(status === "idle"){
            fetchNotes(id);
        }
    },[])

    return(
        <>

            <section className='notes'>
                {
                    areYouSure &&
                    <div className='are-you-sure'>
                        <div className='modal'>
                            <button onClick={() => setAreYouSure(false)} className="close-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                                <path fill="currentColor"
                                    d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z" />
                                </svg>
                            </button>
                            <h4>Are you sure you want to erase this note?</h4>
                            <div className='btns'>
                                <button className='yes' onClick={() => {eraseNoteHandler(note_id), setAreYouSure(false)}}>Yes</button>
                                <button className='no' onClick={() => setAreYouSure(false)}>No</button>
                            </div>
                        </div>
                    </div>
                }
                { bookNotes.length && status === "success" ?
                    bookNotes.map(note =>
                        <div className='note' key={note.id}>
                            <div className='erase-note' onClick={() => {setNote_id(note.id), setAreYouSure(true)}}>erase note</div>
                            <h3>{note.title}</h3>
                            <p>{note.text}</p>
                        </div>
                    ) :
                    bookNotes.length === 0 && status === "success" ?
                    <p className='notes-message'><i className="fa-solid fa-xmark" style={{color: 'tomato'}}></i> You don't have any notes for this book yet</p> :
                    status === "error" ?
                    <p className='notes-message notes-err'><i className="fa-solid fa-circle-exclamation" style={{color: 'tomato'}}></i> Error fetching the notes</p> :
                    <p className='notes-message'>Loading ...</p>
                }
                <div className='add-note'>
                    <div className='details' onClick={() => setIsOpen(!isOpen)}>
                        <p>Add note</p>
                        <div>{isOpen ? '▾' : '▸'}</div>
                    </div>
                    {isOpen && 
                        <div className='note-fields'>
                            <label htmlFor="title">Title</label>
                            <input className={isMandatory ? 'red' : ''} type="text" id='title' name='title' placeholder='Write a title...'/>
                            <label htmlFor="information">Information</label>
                            <textarea className={isMandatory ? 'red' : ''} type="text" id='information' name='information' placeholder='Write an information...'/>
                            <button disabled={addingStatus === "loading"} onClick={(e) => addNoteHandler(e, id)} className='note-btn'>{addingStatus === "loading" ? "Loading..." : "Save"}</button>
                            {
                                isMandatory &&
                                <p className='mandatory-note'>You need to fill the mandatory fields</p>
                            }
                        </div>
                    }
                </div>
            </section>
            
        </>
    )

}

export default Notes