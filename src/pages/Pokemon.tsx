import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Button from "../components/button";
import { useNavigate } from "react-router-dom";
import "./pokemon.css";

export default function Pokemon() {
  const petResponses = [
    "purrs contentedly and leans into your hand.",
    "closes its eyes, enjoying the attention.",
    "makes a happy little chirp!",
    "nuzzles against your palm.",
    "wags its tail rapidly.",
    "seems to relax, its shoulders drooping happily.",
    "lets out a soft, pleased cry.",
    "tilts its head, asking for more.",
    "curls up slightly, savoring the moment.",
    "gives you a warm, trusting look.",
    "shivers with delight.",
    "flops over, wanting a belly rub.",
    "hums softly, clearly enjoying itself.",
    "presses its head into your hand.",
    "lets out a happy little squeak.",
    "sways gently, completely at ease.",
    "gazes up at you affectionately.",
    "seems to melt under your touch.",
    "does a small happy wiggle.",
    "blinks slowly — a sign of trust and comfort.",
  ];

  const [petText, setPetText] = useState("");
  const [showPetBox, setShowPetBox] = useState(false);

  function handlePet() {
    if (!selectedPokemon) return;
    setPetText(`${selectedPokemon.name} ${genPetResponse()}`);
    setShowPetBox(true);
  }

  function genPetResponse() {
    return petResponses[Math.floor(Math.random() * petResponses.length)];
  }

  const [pokemons, setPokemons] = useState<
    { pokemonid: number; name: string; sprite: string }[] | null
  >(null);
  const [selectedPokemon, setSelectedPokemon] = useState<{
    pokemonid: number;
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
        .select("pokemonid, name, sprite")
        .eq("auth_id", result.data.session.user.id) //filters for rows where id matches user
        .then((queryResult) => {
          if (queryResult.error) {
            console.error(queryResult.error.message);
            return;
          }
          setPokemons(
            queryResult.data as {
              pokemonid: number;
              name: string;
              sprite: string;
            }[],
          );
        });
    });
  }, []);

  async function sellPokemon() {
    if (!selectedPokemon) return;

    const { error } = await supabase
      .from("pokemon")
      .delete()
      .eq("pokemonid", selectedPokemon.pokemonid);

    if (error) {
      console.log("Failed to delete");
    }

    setPokemons(
      (oldPokemons) =>
        oldPokemons?.filter(
          (poke) => poke.pokemonid !== selectedPokemon.pokemonid,
        ) ?? null,
    );
    setSelectedPokemon(null);
  }

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
          <Button
            text="Feed"
            onClick={() => navigate("/food", { state: selectedPokemon })}
          />
          <Button
            text="Pet"
            onClick={() => {
              handlePet();
            }}
          />
          <Button
            text="Sell"
            onClick={() => {
              sellPokemon();
            }}
          />
        </div>
      </div>
      <div className="pokemon-bottom">
        {pokemons?.map((p, i) => (
          <div className="pokemon-box">
            <img
              key={i}
              src={p.sprite}
              onClick={() => {
                setSelectedPokemon(p);
                setShowPetBox(false);
              }}
            />
          </div>
        ))}
      </div>

      {showPetBox && (
        <div className="pet-container" onClick={() => setShowPetBox(false)}>
          <div className="typing-box">{genPetResponse()}</div>
        </div>
      )}
    </div>
  );
}
