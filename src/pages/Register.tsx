import "./login_register.css";
import logo from "/pokegachi_logo.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Register() {
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

    supabase.auth.signUp({ email, password }).then((result) => {
      console.log(result);

      if (result.error) {
        setErrorMessage(result.error.message);
        return;
      }

      if (!result.data.user) {
        setErrorMessage("Something went wrong, please try again.");
        return;
      }

      supabase
        .from("user")
        .insert({ email, auth_id: result.data.user.id })
        .then((insertResult) => {
          if (insertResult.error) {
            setErrorMessage(insertResult.error.message);
          } else {
            navigate("/register/first-pokemon");
          }
        });
    });
  };

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
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}
