import './OrderForm.css';
import {switchForm} from "./FormSwitcher.js";
import {useNavigate} from "react-router-dom";

export default function OrderForm() {
    const navigate = useNavigate();
    const getInputRegistration = async (e) => {
        e.preventDefault();
        const username2 = document.querySelector("#username2").value;
        const password2 = document.querySelector("#password2").value;
        const role = document.getElementById("person-role").value;
        const response = await fetch("http://localhost:9814/is-lab1-backend-1.0-SNAPSHOT/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username2,
                password: password2,
                role: role
            }),
        });
        if (!(response.ok)) {
            alert("Ошибка регистрации")
        } else {
            const data = await response.json();
            if (data.token === "Password must be at least 6 characters") {
                alert("Пароль должен быть минимум из 6 символов");
            } else if (data.token === "Username already exists") {
                alert("Пользователь с таким именем уже существвует");
            } else {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", "USER");
                navigate("/entity");
            }
        }
    }


    const getInputLogIn = async (e) => {
        e.preventDefault();
        const username1 = document.querySelector("#username1").value;
        const password1 = document.querySelector("#password1").value;
        const response = await fetch("http://localhost:9814/is-lab1-backend-1.0-SNAPSHOT/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username1,
                password: password1
            }),
        });

        if (!(response.ok)) {
            alert("Логин или пароль не корректны");
        } else {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            navigate("/entity");
        }
    }

    return (
        <>
            <div className="generalBlock" id="generalBlock">
                <label className="tab active" id="LogInTab" onClick={switchForm}>Log in</label>
                <label className="tab" id="SignUpTab" onClick={switchForm}>Sign up</label>
                <div className="tab-form active">
                    <div className="registrationFields">
                        <label className="text-field__label" htmlFor="username1"
                        >Имя пользователя
                        </label>
                        <br/>
                        <span className="text-field__icon input-item"
                        ><i className="fa fa-user-circle"></i
                        ></span>
                        <input
                            className="text-field__input order"
                            placeholder="Username"
                            type="text"
                            id="username1"
                        />
                        <div id="appNameSignUp"></div>
                        <br/>
                        <label className="text-field__label" htmlFor="password1">Пароль</label>
                        <br/>
                        <span className="text-field__icon input-item"
                        ><i className="fa fa-key"></i
                        ></span>
                        <input
                            className="text-field__input order"
                            placeholder="Password"
                            type="password"
                            id="password1"
                        />
                        <div id="appPasswordLogIn"></div>
                        <br/>
                    </div>
                    <button className="btn-new btnLogIn" id="logInBtn" onClick={getInputLogIn}>
                        <span>Log in</span>
                    </button>
                </div>

                <div className="tab-form">
                    <div className="registrationFields">
                        <label className="text-field__label" htmlFor="username2"
                        >Имя пользователя
                        </label>
                        <br/>
                        <span className="text-field__icon input-item"
                        ><i className="fa fa-user-circle"></i
                        ></span>
                        <input
                            className="text-field__input order"
                            placeholder="Username"
                            type="text"
                            id="username2"
                        />
                        <div id="appNameSignUp"></div>
                        <br/>
                        <label className="text-field__label" htmlFor="password2">Пароль</label>
                        <br/>
                        <span className="text-field__icon input-item"
                        ><i className="fa fa-key"></i
                        ></span>
                        <input
                            className="text-field__input order"
                            placeholder="Password"
                            type="password"
                            id="password2"
                        />
                        <div id="appPasswordSignUp"></div>
                        <br/>
                        <label>Роль:
                            <select id="person-role">
                                <option value="USER">Пользователь</option>
                                <option value="ADMIN">Администратор</option>
                            </select>
                        </label>
                    </div>
                    <button className="btn-new btnSignUp" id="signUpBtn" onClick={getInputRegistration}>
                        <span>Sign up</span>
                    </button>
                </div>
            </div>
        </>
    )
}