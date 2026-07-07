import "./login_register.css";
import logo from "/pokegachi_logo.png";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      console.log(result);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    supabase.auth.signUp({ email, password }).then((result) => {
      console.log(result);
    });
  };

  return (
    <div className="login-page">
      <div className="focus">
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
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}
