import "./battle.css";
import { supabase } from "../lib/supabase.ts";
import { getQuestion, type Question } from "../lib/trivia";
import Button from "../components/button";
import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomPokemon } from "../lib/pokeapi.ts";

export default function Battle() {
  const [ourPokemon, setourPokemon] = useState<{
    name: string;
    sprite: string;
  } | null>(null);
  const [badPokemon, setbadPokemon] = useState<{
    name: string;
    sprite: string;
  } | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [response, setResponse] = useState<"Correct" | "Wrong" | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [authId, setAuthId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let hasQuestion = false;
    let retry = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    async function getBadPokemon() {
      const pokemon = await getRandomPokemon();
      if (!hasQuestion) setbadPokemon(pokemon);
    }
    async function loadQuestion() {
      try {
        const data = await getQuestion();
        if (!hasQuestion) setQuestion(data);
      } catch (error) {
        if (!hasQuestion && retry !== 1) {
          timeoutId = setTimeout(loadQuestion, 5000);
        }
      }
    }

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

      supabase
        .from("pokemon")
        .select("name, sprite")
        .eq("auth_id", result.data.session.user.id)
        .then((queryResult) => {
          if (queryResult.error) {
            console.error(queryResult.error.message);
            return;
          }
          const rows = queryResult.data as { name: string; sprite: string }[];
          if (rows.length === 0) return;
          const random = rows[Math.floor(Math.random() * rows.length)];
          setourPokemon(random);
        });
    });

    getBadPokemon();

    loadQuestion();
    return () => {
      hasQuestion = true;
      clearTimeout(timeoutId);
    };
  }, []);

  function shuffle(arr: string[]) {
    return arr
      .map((elem) => ({ elem, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ elem }) => elem);
  }

  const choices = useMemo(() => {
    if (!question) return [];
    return shuffle([question.correct_answer, ...question.incorrect_answers]);
  }, [question]);

  const isLoading = !question;
  const displayChoices = isLoading ? ["1", "2", "3", " 4"] : choices;

  async function handleChoice(choice: string) {
    if (isLoading || answer) return;
    setAnswer(choice);

    if (choice == question?.correct_answer) {
      setResponse("Correct");

      const { data: userData, error: fetchError } = await supabase
        .from("user")
        .select("currency")
        .eq("auth_id", authId)
        .single(); //gets it so its not in array

      if (fetchError) {
        console.log(fetchError.message);
        return;
      }

      const { error: updateError } = await supabase
        .from("user")
        .update({ currency: userData.currency + 10 })
        .eq("auth_id", authId);

      if (updateError) {
        console.log(updateError.message);
      }
    } else {
      setResponse("Wrong");
    }

    setTimeout(() => {
      navigate("/home");
    }, 4000);
  }

  return (
    <div className="battle-page">
      <img id="opp" className="battle-pokemon" src={badPokemon?.sprite} />
      <img id="user" className="battle-pokemon" src={ourPokemon?.sprite} />
      <div className="trivia">
        <div className="question-box">
          <h2>
            {isLoading
              ? "Loading..."
              : response == "Correct"
                ? `You've defeated ${badPokemon?.name}!`
                : response == "Wrong"
                  ? "You've been defeated"
                  : question.question}
          </h2>
        </div>

        <div className="choice-box">
          {displayChoices.map((choice, idx) => {
            let className = isLoading ? "disabled" : "";

            if (!isLoading && answer) {
              if (choice == question.correct_answer) {
                className = "correct";
              } else if (choice == answer) {
                className = "wrong";
              } else {
                className = "disabled";
              }
            } else {
              className = `choice-${idx}`;
            }

            return (
              <div key={isLoading ? idx : choice} className={className}>
                <Button text={choice} onClick={() => handleChoice(choice)} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
