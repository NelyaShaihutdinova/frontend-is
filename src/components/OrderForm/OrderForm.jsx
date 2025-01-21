import './OrderForm.css';
import {switchForm} from "./FormSwitcher.js";
import {useNavigate} from "react-router-dom";
import {useRef} from "react";
import {postData} from "../utils/fetch.js";

export default function OrderForm() {
    const navigate = useNavigate();
    const usernameRegRef = useRef(null);
    const passwordRegRef = useRef(null);
    const usernameLoginRef = useRef(null);
    const passwordLoginRef = useRef(null);
    const roleRef = useRef(null);
    const getInputRegistration = async () => {
        const usernameReg = usernameRegRef.current.value;
        const passwordReg = passwordRegRef.current.value;
        const role = roleRef.current.value;
        const url = '/auth/register';
        const response = await postData(url, {
            username: usernameReg,
            password: passwordReg,
            role: role
        });
        if (!(response.ok)) {
            const data = await response.json();
            alert(data.message);
        } else {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", "USER");
            localStorage.setItem("username", usernameReg);
            navigate("/entity");
        }
    }

    const getInputLogIn = async () => {
        const usernameLogin = usernameLoginRef.current.value;
        const passwordLogin = passwordLoginRef.current.value;
        const url = '/auth/login';
        const response = await postData(url,{
            username: usernameLogin,
            password: passwordLogin
        });
        if (!(response.ok)) {
            alert("The password or username is incorrect");
        } else {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", usernameLogin)
            navigate("/entity");
        }
    }

    return (
        <>
            <div className="form-container">
                <img src="../../../public/images/right.png" alt="blur" className="main-image-right"/>
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
                                className="text-field__input order username"
                                placeholder="Username"
                                type="text"
                                ref={usernameLoginRef}
                            />
                            <div id="appNameSignUp"></div>
                            <br/>
                            <label className="text-field__label" htmlFor="password1">Пароль</label>
                            <br/>
                            <span className="text-field__icon input-item"
                            ><i className="fa fa-key"></i
                            ></span>
                            <input
                                className="text-field__input order password"
                                placeholder="Password"
                                type="password"
                                ref={passwordLoginRef}
                            />
                            <div id="appPasswordLogIn"></div>
                            <br/>
                        </div>
                        <button className="btn-order btnLogIn" id="logInBtn" onClick={getInputLogIn}>
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
                                className="text-field__input order username"
                                placeholder="Username"
                                type="text"
                                ref={usernameRegRef}
                            />
                            <div id="appNameSignUp"></div>
                            <br/>
                            <label className="text-field__label" htmlFor="password2">Пароль</label>
                            <br/>
                            <span className="text-field__icon input-item"
                            ><i className="fa fa-key"></i
                            ></span>
                            <input
                                className="text-field__input order password"
                                placeholder="Password"
                                type="password"
                                ref={passwordRegRef}
                            />
                            <div id="appPasswordSignUp"></div>
                            <br/>
                            <label>Роль:
                                <select ref={roleRef}>
                                    <option value="USER">Пользователь</option>
                                    <option value="ADMIN">Администратор</option>
                                </select>
                            </label>
                        </div>
                        <button className="btn-order btnSignUp" id="signUpBtn" onClick={getInputRegistration}>
                            <span>Sign up</span>
                        </button>
                    </div>
                </div>
                <img src="../../../public/images/left.png" alt="blur" className="main-image-left"/>
            </div>
        </>
    )
}