import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Button from "../components/button";
import "./food.css";

export default function Food() {
  const navigate = useNavigate();

  return (
    <div className="food-page">
      <div className="title-container">
        <h1 className="title">Food</h1>
      </div>

      <div>
        <p>This is where we gunna put food </p>
      </div>

      <div className="button-container">
        <Button text="Back" onClick={() => navigate("/home")} />
      </div>
    </div>
  );
}
