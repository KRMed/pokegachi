import Button from '../components/button';
import './first.css';
import { useState, useEffect } from 'react';
import { getPokemonList, getRandomPokemon } from '../lib/pokeapi.ts';

export default function First() {
    const [pokemon, setPokemon] = useState<{ name: string; sprite: string } | null>(null);

    useEffect(() => {
        getPokemonList();
    }, []);

    return (
    <div className="page">
      <div className="stuff">
        <h1 className="text-box">
            {pokemon ? `You got ${pokemon.name}!` : "It's time to roll for your first Pokemon!"}
        </h1>
        <img 
            className="pokemon-img"
            src={pokemon ? pokemon.sprite : "/mystery.png"} 
        />
        <Button text="Roll" onClick={() => setPokemon(getRandomPokemon())} />
      </div>
    </div>
  );
 
}