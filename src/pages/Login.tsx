import './login_register.css';
import logo from '/pokegachi_logo.png'

import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // TODO: Authentication w/ user db
    };

    return (
        <div className="login-page">
            <div className="login-focus">
                <img className="logo" src={logo} />
                <form className="panel" onSubmit={handleSubmit}>
                    <label>
                        Username
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </label>
                    <label>
                        Password
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </label>

                    <button type="submit" disabled={!username || !password}>
                        Login
                    </button>
                </form>
                Don't have an account?<br />
                <a href="register">Register</a>
            </div>
        </div>
    );
}