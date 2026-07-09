import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { foods } from "../lib/food";
import { getRandomPokemon } from "../lib/pokeapi";
import Button from "../components/button";
import pokemart from "/pokemart.png";
import "./store.css";

export default function Store() {
  const navigate = useNavigate();
  const [authId, setAuthId] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);
  const [currency, setCurrency] = useState<number>(0);
  const [foodCounts, setFoodCounts] = useState<Record<string, number>>({});
  const [rolledPokemon, setRolledPokemon] = useState<{
    name: string;
    sprite: string;
  } | null>(null);
  const [rollStatus, setRollStatus] = useState<string | null>(null);
  const ROLL_PRICE = 100;

  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      if (result.error || !result.data.session) return;
      const id = result.data.session.user.id;
      setAuthId(id);

      supabase
        .from("user")
        .select("currency")
        .eq("auth_id", id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) return;
          setCurrency(data.currency);
        });

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

  async function spendCurrency(amount: number): Promise<boolean> {
    if (!authId) return false;
    if (currency < amount) return false;

    const { data, error } = await supabase
      .from("user")
      .update({ currency: currency - amount })
      .eq("auth_id", authId)
      .select("currency")
      .single();

    if (error) {
      console.error("Currency deduction failed:", error.message);
      return false;
    }

    setCurrency(data.currency);
    return true;
  }

  async function handleBuy(name: string, price: number) {
    if (!authId || buying) return;
    setBuying(true);

    const spent = await spendCurrency(price);
    if (!spent) {
      setBuying(false);
      return;
    }

    const currentCount = foodCounts[name] || 0;

    if (currentCount > 0) {
      const { data, error } = await supabase
        .from("food")
        .update({ amount: currentCount + 1 })
        .eq("auth_id", authId)
        .eq("name", name)
        .select("amount")
        .single();

      if (error) {
        console.error("Update failed:", error.message);
      } else {
        setFoodCounts((prev) => ({ ...prev, [name]: data.amount }));
      }
    } else {
      const { data, error } = await supabase
        .from("food")
        .insert({ name, amount: 1, auth_id: authId })
        .select("amount")
        .single();

      if (error) {
        console.error("Insert failed:", error.message);
      } else {
        setFoodCounts((prev) => ({ ...prev, [name]: data.amount }));
      }
    }

    setBuying(false);
  }

  async function handleRoll() {
    if (!authId || buying) return;
    setBuying(true);
    setRollStatus(null);
    setRolledPokemon(null);

    const spent = await spendCurrency(ROLL_PRICE);
    if (!spent) {
      setRollStatus("Not enough coins!");
      setBuying(false);
      return;
    }

    const pokemon = await getRandomPokemon();
    setRolledPokemon(pokemon);

    const { error } = await supabase
      .from("pokemon")
      .insert({ name: pokemon.name, auth_id: authId, sprite: pokemon.sprite });

    if (error) {
      setRollStatus(error.message);
      setRolledPokemon(null);
    } else {
      setRollStatus(`You got ${pokemon.name}!`);
    }

    setBuying(false);
  }

  return (
    <div className="store-page">
      <div className="pokemart-container">
        <img className="pokemart" src={pokemart} />
        <div className="wallet">
          <span className="wallet-label">Your Wallet</span>
          <span className="wallet-amount">{currency} coins</span>
        </div>
      </div>

      <div className="title-container">
        <h1 className="title">PokeStore</h1>
      </div>
      <div className="ball-food">
        <div className="balls">
          <h1 className="section-title">Berries</h1>
          <div className="items">
            {foods.map((item, i) => (
              <div key={i} className="item-part">
                <img src={item.sprite} alt={item.name} />
                <span className="item-count">x{foodCounts[item.name] || 0}</span>
                <span className="item-price">{item.price} coins</span>
                <Button text="Buy" onClick={() => handleBuy(item.name, item.price)} />
              </div>
            ))}
          </div>
        </div>

        <div className="roll">
          <h1 className="section-title">Roll for a Pokemon</h1>
          <div className="roll-row">
            <div className="items">
              <div className="item-part roll-item">
                {rolledPokemon ? (
                  <img src={rolledPokemon.sprite} alt={rolledPokemon.name} />
                ) : (
                  <img src="/mystery.png" alt="Mystery Pokemon" />
                )}
                <span className="item-price">{ROLL_PRICE} coins</span>
                <Button text="Roll" onClick={handleRoll} />
              </div>
            </div>
            {rollStatus && <p className="roll-status">{rollStatus}</p>}
          </div>
        </div>
      </div>

      <div className="button-container">
        <Button text="Back" onClick={() => navigate("/home")} />
      </div>
    </div>
  );
}