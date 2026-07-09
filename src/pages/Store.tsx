import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { pokeballs } from "../lib/pokeball";
import { foods } from "../lib/food";
import Button from "../components/button";
import pokemart from "/pokemart.png";
import "./store.css";

export default function Store() {
  const navigate = useNavigate();

  return (
    <div className="store-page">
      <div>
        <img className="pokemart" src={pokemart} />
      </div>

      <div className="title-container">
        <h1 className="title">PokeStore</h1>
      </div>

      <div className="ball-food">
        <div className="balls">
          <h1 className="section-title">POKEBALLS</h1>
          <div className="items">
            {foods.map((item, i) => (
              <div key={i} className="item-part">
                <img src={item.sprite} alt={item.name} />
              </div>
            ))}
          </div>
        </div>

        <div className="food">
          <h1 className="section-title">FOOD</h1>
          <div className="items">
            {pokeballs.map((item, i) => (
              <div key={i} className="item-part">
                <img src={item.sprite} alt={item.name} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="button-container">
        <Button text="Back" onClick={() => navigate("/home")} />
      </div>
    </div>
  );
}
