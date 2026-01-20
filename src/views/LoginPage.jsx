import './LoginPage.scss'
import { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         sendPasswordResetEmail,
         onAuthStateChanged
 } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { changeActiveUser } from '../store/userSlice';
import Loading from '../components/modals/Loading';
import WriteEmail from '../components/modals/WriteEmail';

function LoginPage(){

    const dispatch = useDispatch();
    const [resetingIsActive, setResetingIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeBtn, setActiveBtn] = useState('login');
    const [error, setError] = useState('');
    const [userCredentials, setUserCredentials] = useState({});
    const [userEmail, setUserEmail] = useState();
    const [emailNotWritten, setEmailNotWritten] = useState(false);
    const [showedPass, setShowedPass] = useState(false);

    function handleCredentials(e){
        setUserCredentials({...userCredentials, [e.target.name]: e.target.value});
    }

    function handleUserEmail(e){
        setUserEmail(e.target.value);
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            dispatch(changeActiveUser({id: user.uid, email: user.email}));
        } else {
            dispatch(changeActiveUser(null));
        }
        if(isLoading){setIsLoading(false)};
    });

    function handleSignup(e){
        e.preventDefault();
        setError('');

        createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
        .catch((error) => {
            setError(error.message);
        });
    }

    function handleLogin(e){
        e.preventDefault();
        setError('');

        signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
        .catch((error) => {
            setError(error.message);
        });
    }

    function forgotPassword(){
        setResetingIsActive(true);
        setEmailNotWritten(false);
    }

    function resetPassword(){
        const email = userEmail;
        if(email){
            sendPasswordResetEmail(auth, email)
            setUserEmail();
            setResetingIsActive(false);
        } else {
            setEmailNotWritten(true);
        }
    }
    
    return(
        <>
            {
                resetingIsActive &&
                <WriteEmail>
                    <button onClick={() => setResetingIsActive(false)} className="close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
                        <path fill="currentColor"
                            d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z" />
                        </svg>
                    </button>
                    <div className="password-reset">
                        <h3>Write your email to change the password</h3>
                        <input onChange={(e) => handleUserEmail(e)} className='email-reseting' id='email-reseting' name='email' type="email" autoComplete="email" placeholder='Email...' required/>
                        <p className='checkSpam'>if you don't see the message, check your spam folder</p>
                        <button onClick={() => resetPassword()}>Send</button>
                        {
                            emailNotWritten &&
                            <p className='writeEmail'>Write your email</p>
                        }
                    </div>
                </WriteEmail>
            }
            {isLoading && <Loading/>}
            <section className='container centre'>
                <div className='login'>
                    <div className='text-welcome'>
                        <h1>Welcome to your book list</h1>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Placeat corrupti aliquam id amet est ad nemo explicabo accusamus, beatae autem, praesentium earum voluptates ab magni, similique eius a quis culpa?</p>
                    </div>
                    <div className='btns-login'>
                        <button onClick={() => {setActiveBtn('login'), activeBtn === 'signin' && setError('')}} className={`login-btn ${activeBtn === 'login' ? 'active' : ''}`}>Login</button>
                        <button onClick={() => {setActiveBtn('signin'), activeBtn === 'login' && setError('')}} className={`signin-btn ${activeBtn === 'signin' ? 'active' : ''}`}>Sign in</button>
                    </div>
                    <form className='form'>
                        <div className='form-part'>
                            <label htmlFor="email">Email</label>
                            <input onChange={(e) => handleCredentials(e)} className='email' id='email' name='email' type="email" autoComplete="email" placeholder='Email...' required/>
                        </div>
                        <div className='form-part'>
                            <label htmlFor="password">Password</label>
                            <div className='pass-form'><input onChange={(e) => handleCredentials(e)} className='password' id='password' name='password' type={showedPass ? "text" : "password"} placeholder='Password...' required/><div onClick={() => setShowedPass(!showedPass)} className='but-pass'>{showedPass ? <i class="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}</div></div>
                        </div>
                        {
                            activeBtn === 'login' ?
                            <button onClick={(e) => handleLogin(e)} className='confirm-login'>Login</button> :
                            <button onClick={(e) => handleSignup(e)} className='confirm-login'>Sign in</button>
                        }
                        {
                            error &&
                            <p className='error-login'>{error}</p>
                        }
                        {
                            activeBtn === 'login' &&
                            <p onClick={() => forgotPassword()} className='forgot-password'>Forgot password?</p>
                        }
                    </form>
                </div>
            </section>
        </>
    )
}

export default LoginPage;