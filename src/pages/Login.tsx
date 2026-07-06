import './login_register.css';
import logo from '/pokegachi_logo.png'

export default function Login() {

  return (
    <div className="login-page">
        <div className="focus">
            <img className="logo" src={logo} />
            <form className="panel">
                <label>
                    Username
                    <input type="text" />
                </label>
                <label>
                    Password
                    <input type="password" />
                </label>

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    </div>
  );
}