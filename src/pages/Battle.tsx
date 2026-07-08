import './battle.css';

import { getQuestion, type Question } from "../lib/trivia";
import Button from "../components/button";
import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Battle() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [response, setResponse] = useState<"Correct" | "Wrong" | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let hasQuestion = false;
    let retry = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

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

    loadQuestion();
    return () => {
      hasQuestion = true;
      clearTimeout(timeoutId);
    }
  }, []);

  function shuffle(arr: string[]) {
    return arr.map(elem => ({ elem, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ elem }) => elem);
  }
  const choices = useMemo(() => {
    if (!question) return [];
    return shuffle([question.correct_answer, ...question.incorrect_answers]);
  }, [question]);

  const isLoading = !question;
  const displayChoices = isLoading ? ["1", "2", "3", " 4"] : choices;

  function handleChoice(choice: string) {
    if (isLoading || answer) return;
    setAnswer(choice);

    if (choice == question?.correct_answer) {
      setResponse("Correct");
    } else {
      setResponse("Wrong");
    }

    setTimeout(() => {
      navigate("/home");
    }, 5000);
  }

  return (
    <div className="battle-page">
      <img id="opp" className="battle-pokemon" src="/pokegachi_logo.png" />
      <img id="user" className="battle-pokemon" src="/pokegachi_logo.png" />
      <div className="trivia">
        <div className="question-box">
          <h2>{isLoading ? "Loading..." : response == "Correct" ? "Your Pokemon defeats ..." : response == "Wrong" ? "Your Pokemon has been defeated." : question.question}</h2>
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