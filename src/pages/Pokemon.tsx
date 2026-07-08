import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Button from "../components/button";
import { useNavigate } from "react-router-dom";

export default function Pokemon() {
  const [pokemons, setPokemons] = useState<
    { name: string; sprite: string }[] | null
  >(null);
  const [selectedPokemon, setSelectedPokemon] = useState<{
    name: string;
    sprite: string;
  } | null>(null);
  const navigate = useNavigate();

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

  return (
    <div className="pokemon-page">
      <div className="back">
        <Button text="Back" onClick={() => navigate("/home")} />
      </div>
      <div className="pokemon-top">
        <div className="pokemon-info">
          <div className="selected-img">
            {selectedPokemon ? (
              <img src={selectedPokemon.sprite} alt={selectedPokemon.name} />
            ) : null}
          </div>
          <h3>
            {selectedPokemon
              ? `Name: ${selectedPokemon.name}`
              : "No pokemon selected"}
          </h3>
        </div>
        <div className="menu-actions">
          <Button text="Fight" onClick={() => navigate("/battle")} />
          <Button text="Feed" onClick={() => {}} />
          <Button text="Pet" onClick={() => {}} />
          <Button text="Sell" onClick={() => {}} />
        </div>
      </div>
      <div className="pokemon-bottom">
        {pokemons?.map((p, i) => (
          <img key={i} src={p.sprite} onClick={() => setSelectedPokemon(p)} />
        ))}
      </div>
    </div>
  );
}
