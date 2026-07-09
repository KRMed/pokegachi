import { describe, test, expect, vi } from "vitest";
import { getQuestion } from "./trivia";
import { shuffle } from "../pages/Battle";

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

describe('Correct shuffle', () => {
    const choices = [
        "Alice Margatroid",
        "Marisa Kirisame",
        "Clownpiece",
        "Flandre Scarlet"
    ];

    test("Same number of elements returned", () => {
        const shuffled = shuffle(choices);
        expect(shuffled).toHaveLength(choices.length);
    });

    test("Elements haven't been modified", () => {
        const shuffled = shuffle(choices);
        expect(shuffled.slice().sort()).toEqual(choices.slice().sort())
    });

    test("Different orderings", () => {
        let differentOrder = false;
        for (let idx = 0; idx < 5; idx++) {
            const shuffled = shuffle(choices);
            if (!shuffled.every((val, i) => val === choices[i])) {
                differentOrder = true;
                break;
            }
        }
        expect(differentOrder).toBe(true);
    });
})