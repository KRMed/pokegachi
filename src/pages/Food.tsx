import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { foods } from "../lib/food";
import { useLocation } from "react-router-dom";
import { getNextEvolution } from "../lib/pokeapi";
import Button from "../components/button";
import "./food.css";

export default function Food() {
  const location = useLocation();
  const selectedPokemon = location.state as {
    pokemonid: number;
    name: string;
    sprite: string;
  } | null;

  const [foodCounts, setFoodCounts] = useState<Record<string, number>>({});
  const [pokemon, setPokemon] = useState(selectedPokemon);
  const [message, setMessage] = useState<string | null>(null);
  const [authId, setAuthId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      if (result.error || !result.data.session) return;
      const id = result.data.session.user.id;
      setAuthId(id);

      supabase
        .from("food")
        .select("name, amount")
        .eq("auth_id", id)
        .then(({ data, error }) => {
          if (error || !data) return;
          const counts: Record<string, number> = {};
          data.forEach((row) => {
            counts[row.name] = row.amount;
          });
          setFoodCounts(counts);
        });
    });
  }, []);

  async function handleFeed(name: string) {
    if (!authId || !pokemon) return;

    setMessage("+10 EXP!");

    const currentCount = foodCounts[name] || 0;

    //We only update food if the current count is greater than one
    if (currentCount > 0) {
      const { data, error } = await supabase
        .from("food")
        .update({ amount: currentCount - 1 })
        .eq("auth_id", authId)
        .eq("name", name)
        .select("amount")
        .single();

      if (error) {
        console.error("Update failed:", error.message);
      } else {
        setFoodCounts((prev) => ({ ...prev, [name]: data.amount }));
        //We then edit the exp of the pokemon increasing it by 10
        const { data: pokedata, error: pokeerror } = await supabase
          .from("pokemon")
          .select("experience")
          .eq("pokemonid", pokemon.pokemonid)
          .single();

        if (pokeerror) {
          console.error("Update failed:", pokeerror.message);
          return;
        }

        const newExp = pokedata.experience + 10;

        if (newExp >= 100) {
          const evolution = await getNextEvolution(pokemon.name);

          if (evolution) {
            const { error: evolveError } = await supabase
              .from("pokemon")
              .update({
                name: evolution.name,
                sprite: evolution.sprite,
                experience: newExp - 100,
              })
              .eq("pokemonid", pokemon.pokemonid);

            if (evolveError)
              console.error("Evolution update failed:", evolveError.message);
            else {
              setMessage(
                "+10 EXP! " +
                  pokemon.name +
                  " evolved into " +
                  evolution.name +
                  "!",
              );
              setPokemon({
                ...pokemon,
                name: evolution.name,
                sprite: evolution.sprite,
              });
            }

            console.log("pokemon evolved");
            return;
          }
        }

        const { error: expError } = await supabase
          .from("pokemon")
          .update({ experience: newExp })
          .eq("pokemonid", pokemon.pokemonid);
        if (expError)
          console.error("Experience update failed:", expError.message);
        else {
          console.log("added 10 exp to pokemon");
        }
      }
    }
  }

  return (
    <div className="food-page">
      <div className="title-container">
        <h1 className="title">Food</h1>
      </div>

      <div className="items">
        {foods.map((item, i) => (
          <div key={i} className="item-part">
            <img src={item.sprite} alt={item.name} />
            <span className="item-count">x{foodCounts[item.name] || 0}</span>
            <Button text="Feed" onClick={() => handleFeed(item.name)} />
          </div>
        ))}
      </div>

      <div className="pokemon-container">
        <img className="pokemon-img" src={pokemon.sprite} alt={pokemon.name} />
      </div>

      {message && (
        <div className="exp-text">
          <p>{message}</p>
        </div>
      )}

      <div className="button-container">
        <Button text="Back" onClick={() => navigate("/pokemon")} />
      </div>
    </div>
  );
}
