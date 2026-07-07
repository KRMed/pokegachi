import { test, expect, vi } from "vitest";
import { getPokemonList, getRandomPokemon } from "./pokeapi";

vi.stubGlobal("fetch", vi.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
        results: [{ name: "bulbasaur" }],
        }),
    })
));

test("returns a pokemon", async () => {
    await getPokemonList();
    const p = getRandomPokemon();
    expect(p.name).toBe("bulbasaur");
});