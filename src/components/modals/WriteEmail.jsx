import "./WriteEmail.scss";

function WriteEmail({children}){
    return(
        <>
            <section className="modal-write-email">
                <div className="write-email">
                    {children}
                </div>
            </section>
        </>
    )
}

export default WriteEmail