import "./ErrorModal.scss";
import { useDispatch } from "react-redux";
import { activeModalError } from "../../store/errorModalSlice";

function ErrorModal({children}){

    const dispatch = useDispatch();

    const handleErrorIsActive = () => {
        dispatch(activeModalError(false));
    }

    return(
        <>
            <section className="error">
                <div className="main-error">
                    <h4><i className="fa-solid fa-exclamation" style={{ color: "#ff0000" }}></i>{children}</h4>
                    <button onClick={() => handleErrorIsActive()}>Close</button>
                </div>
            </section>
        </>
    )
}

export default ErrorModal