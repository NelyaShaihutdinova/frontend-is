import OrderForm from "../OrderForm/OrderForm.jsx";
import './FormContainer.css'

export default function FormContainer() {
    return (
        <>
            <div className="form-container">
                <img src="../../../public/images/right.png" alt="blur" className="main-image-right"/>
                <OrderForm/>
                <img src="../../../public/images/left.png" alt="blur" className="main-image-left"/>
            </div>
        </>
    )
}