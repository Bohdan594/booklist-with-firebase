import './Modal.scss';
import { changeIsActive } from '../../store/modalSlice';
import { useDispatch } from 'react-redux';
 
function Modal({children}) {

    const dispatch = useDispatch();

    return (
        <>
            <div className="modal-wrapper" aria-modal="true"
            role="dialog" tabIndex="-1">
                <div className="inner">
                    <button onClick={() => dispatch(changeIsActive())} className="close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                        <path fill="currentColor"
                            d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z" />
                        </svg>
                    </button>
                    {children}
                </div>
            </div>
        </>
    )
}
  
export default Modal