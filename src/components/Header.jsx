import './Header.scss'
import { NavLink } from 'react-router-dom'
import { auth } from '../firebase/config'
import { signOut } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { changeActiveUser } from '../store/userSlice';
import { useState } from 'react';
import { setScrollPos } from '../store/booksSlice';

function Header(){

    const [activeLogout, setActiveLogout] = useState(false);
    const dispatch = useDispatch();

    function handleSignOut(){
        signOut(auth)
            .then(() => {
                dispatch(changeActiveUser(null));
            }).catch((error) => {
                alert(error);
            }
        );
    }

    return(
        <>
            <nav className='nav-section'>

                {activeLogout && <div className='modal-logout'>
                    <div className='inner-logout'>
                        <button onClick={() => setActiveLogout(false)} className="close-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                            <path fill="currentColor"
                                d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z" />
                            </svg>
                        </button>
                        <h4>Are you sure you want to logout</h4>
                        <div className='btns'>
                            <button onClick={() => {handleSignOut(), setActiveLogout(false)}} className='yes-lg'>Yes</button>
                            <button onClick={() => setActiveLogout(false)} className='no-lg'>No</button>
                        </div>
                    </div>
                </div>}

                <div className='nav-text'>
                    <i className="fa-solid fa-book fa-xl" style={{color: '#a12b2b'}}></i>
                    <h1>Your list of books. Read and relax</h1>
                </div>

                <div className='btns'>
                    <NavLink to="/"><button className='books-btn'>Books</button></NavLink>
                    <NavLink to="/add-book"><button className='add-book-btn' onClick={() => dispatch(setScrollPos(window.scrollY))}>Add Book</button></NavLink>
                    <p onClick={() => setActiveLogout(true)} className='logout-btn'>Logout</p>
                </div>
                
            </nav>
        </>
    )

}

export default Header