import Button from "../components/button";
import "./first.css";
import { useState, useEffect } from "react";
import { getPokemonList, getRandomPokemon } from "../lib/pokeapi.ts";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function First() {
  const [pokemon, setPokemon] = useState<{
    name: string;
    sprite: string;
  } | null>(null);

  const [authId, setAuthId] = useState<string | null>(null);
  const navigate = useNavigate();

  //We get the Authid
  useEffect(() => {
    getPokemonList();

    supabase.auth.getSession().then((result) => {
      if (result.error) {
        console.error(result.error.message);
        return;
      }
      if (!result.data.session) {
        console.error("No active session");
        return;
      }
      setAuthId(result.data.session.user.id);
    });
  }, []);

  //inserts the pokemon, authid, and sprite
  const handleGoHome = () => {
    if (!pokemon || !authId) return;

    supabase
      .from("pokemon")
      .insert({ name: pokemon.name, auth_id: authId, sprite: pokemon.sprite })
      .then((insertResult) => {
        if (insertResult.error) {
          console.log(insertResult.error.message);
          return;
        }
        navigate("/home");
      });
  };

  return (
    <div className="page">
      <div className="stuff">
        <h1 className="text-box">
          {pokemon
            ? `You got ${pokemon.name}!`
            : "It's time to roll for your first Pokemon!"}
        </h1>
        <img
          className="pokemon-img"
          src={pokemon ? pokemon.sprite : "/mystery.png"}
        />
        {pokemon ? (
          <Button text="Go to Home" onClick={handleGoHome} />
        ) : (
          <Button text="Roll" onClick={() => setPokemon(getRandomPokemon())} />
        )}
      </div>
    </div>
  );
}
