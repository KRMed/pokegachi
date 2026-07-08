import { test, expect, vi } from "vitest";
import { getRandomPokemon } from "./pokeapi";

vi.stubGlobal("fetch", vi.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
        results: [{ name: "bulbasaur" }],
        }),
    })
));

test("returns a pokemon", async () => {
    const p = await getRandomPokemon();
    expect(p.name).toBe("bulbasaur");
});