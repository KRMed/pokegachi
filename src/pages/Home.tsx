import logo from '/pokegachi_logo.png'
import Button from '../components/button';
import './home.css';
import { useNavigate } from 'react-router-dom';
import { getPokemonList, getRandomPokemon } from '../lib/pokeapi.ts';
import { useState, useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  // Temporary until we start storing the user's pokemon party in the database
  const [pokemons, setPokemons] = useState<{ name: string; sprite: string }[] | null>(null);
  useEffect(() => {
    getPokemonList().then(() => {
      setPokemons(Array.from({ length: 6 }, () => getRandomPokemon()));
    });
  }, []);

//   const pokemons: string[] = [
//     '/first_roll.png',
//     '/pokegachi_logo.png',
//     '/login_page.png'
//   ];
  const trainer = '/trainer.png';

  return (
    <div className="home-page">
        <div className="logo-container">
            <img className="logo" src={logo} />
        </div>
        <div className="group-container">
            <div className="group">
                <div className="party">
                    <div className="party-side">
                        {pokemons?.slice(0, 3).map((p, i) => (
                        <img key={i} className="pokemon" src={p.sprite} />
                    ))}
                    </div>
                    <img className="trainer" src={trainer} />
                    <div className="party-side">
                        {pokemons?.slice(3, 6).map((p, i) => (
                        <img key={i} className="pokemon" src={p.sprite} />
                        ))}
                    </div>
                </div>
                <div className="menu">
                    <Button text="Battle" onClick={() => navigate("/battle")} />
                    <Button text="Pokemon" onClick={() => navigate("/pokemon")} />
                    <Button text="Store" onClick={() => navigate("/store")} />
                </div>
            </div>
        </div>
    </div>
  );
}