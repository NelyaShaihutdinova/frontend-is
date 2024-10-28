import './OrderForm.css';

export default function OrderForm() {
    return (
        <>
            <div className="order-form-container">
                <div className="order-inputs">
                    <input type="text" placeholder="Name" className="inputs-form"/>
                    <input type="password" placeholder="Password" className="inputs-form"/>
                    <label htmlFor="admin"><input type="checkbox" id="admin" name="admin"/>Admin</label>
                    <button className="button login">Login</button>
                </div>
            </div>
        </>
    )
}