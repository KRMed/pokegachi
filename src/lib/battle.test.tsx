import { test, expect, vi } from "vitest";
import { getQuestion } from "./trivia";

const mockResponse = {
    "response_code":0,
    "results":[{
        "type":"multiple",
        "difficulty":"medium",
        "category":"Entertainment: Japanese Anime &amp; Manga",
        "question":"Which character in Touhou is able to control dolls?",
        "correct_answer":"Alice Margatroid",
        "incorrect_answers":["Marisa Kirisame","Clownpiece","Flandre Scarlet"]
    }]
};

test('Correct Parsing of API Response', async () => {
    // fakes the API call
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
        json: async () => mockResponse,
    } as Response);

    const question = await getQuestion();
    expect(question).toEqual({
        question: "Which character in Touhou is able to control dolls?",
        correct_answer: "Alice Margatroid",
        incorrect_answers: [
            "Marisa Kirisame",
            "Clownpiece",
            "Flandre Scarlet"
        ]
    })
});