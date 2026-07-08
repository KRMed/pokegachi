import "./login_register.css";
import logo from "/pokegachi_logo.png";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      console.log(result);
    });
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    supabase.auth.signInWithPassword({ email, password }).then((result) => {
      console.log(result);

      if (result.error) {
        setErrorMessage(result.error.message);
      } else {
        navigate("/home");
      }
    });
  };

  console.log(email, password);

  return (
    <div className="login-page">
      <div className="login-focus">
        <img className="logo" src={logo} />
        <form className="panel" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Login</button>
        </form>
            Don't have an account?<br />
            <a href="register">Register</a>
      </div>
    </div>
  );
}
