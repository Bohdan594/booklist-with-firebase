import { useDispatch } from "react-redux"
import { changeIsActive } from "../../store/modalSlice"
import { useNavigate, useParams } from "react-router-dom";
import { eraseBook } from "../../store/booksSlice";
import { activeError } from "../../store/errorModalSlice";
import { activeModalError } from "../../store/errorModalSlice";
import { useSelector } from "react-redux";
import { selectErrorModal } from "../../store/errorModalSlice";
import { setScrollPos } from "../../store/booksSlice";

function AreYouSure(){

    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const error = useSelector(selectErrorModal).isActive;

    function deleteBook(book_id){
        dispatch(changeIsActive());
        dispatch(eraseBook({id: book_id})).then((response) => {
            if(response.error){
                dispatch(activeError("err-erasing-book"));
                dispatch(activeModalError(true));
            } else {
                dispatch(setScrollPos(0));
                navigate("/");
                if(error === "err-erasing-book"){
                   dispatch(activeError(null)); 
                }
            }
        });  
    }

    return(
        <>
            <div className="sure-modal">
                <h3>Are you sure you want to delete this book from your list</h3>
                <div className="sure-btns">
                    <button className="yes" onClick={() => deleteBook(id)}>Yes</button>
                    <button onClick={() => dispatch(changeIsActive())} className="no">No</button>
                </div>
            </div>
        </>
    )

}

export default AreYouSure