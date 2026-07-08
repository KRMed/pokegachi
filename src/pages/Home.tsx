import logo from "/pokegachi_logo.png";
import Button from "../components/button";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const navigate = useNavigate();
  // Temporary until we start storing the user's pokemon party in the database
  const [pokemons, setPokemons] = useState<
    { name: string; sprite: string }[] | null
  >(null);

  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      if (result.error) {
        console.error(result.error.message);
        return;
      }
      if (!result.data.session) {
        console.error("session not active for some reason");
        return;
      }

      supabase
        .from("pokemon")
        .select("name, sprite")
        .eq("auth_id", result.data.session.user.id) //filters for rows where id matches user
        .then((queryResult) => {
          if (queryResult.error) {
            console.error(queryResult.error.message);
            return;
          }
          setPokemons(queryResult.data as { name: string; sprite: string }[]);
        });
    });
  }, []);

  const handleLogout = () => {
    supabase.auth.signOut().then((result) => {
      if (result.error) {
        console.error(result.error.message);
        return;
      }
      navigate("/");
    });
  };

  const trainer = "/trainer.png";

  return (
    <div className="home-page">
        <div className="logo-container">
            <img className="pokegachi-logo" src={logo} />
        </div>
        <div className="group-container">
            <div className="group">
                <div className="party">
                    <div className="party-side">
                        {pokemons?.slice(0, 3).map((p, i) => (
                        <img key={i} className="pokemon-home" src={p.sprite} />
                    ))}
                    </div>
                    <img className="trainer" src={trainer} />
                    <div className="party-side">
                        {pokemons?.slice(3, 6).map((p, i) => (
                        <img key={i} className="pokemon-home" src={p.sprite} />
                        ))}
                    </div>
                </div>
                <div className="menu">
                    <Button text="Battle" onClick={() => navigate("/battle")} />
                    <Button text="Pokemon" onClick={() => navigate("/pokemon")} />
                    <Button text="Store" onClick={() => navigate("/store")} />
                    <Button text="Logout" onClick={handleLogout} />
                </div>
            </div>
        </div>
    </div>
  );
}
