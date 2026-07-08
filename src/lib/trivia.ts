import he from "he";

export type Question = {
    // difficulty: number;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export async function getQuestion() {
    const response = await fetch('https://opentdb.com/api.php?amount=1&category=31&type=multiple');
    const data = await response.json();

    let question = data.results[0];
    question = {
        question: he.decode(question.question),
        correct_answer: he.decode(question.correct_answer),
        incorrect_answers: question.incorrect_answers.map((choice: string) => he.decode(choice))
    };

    return question;
}
