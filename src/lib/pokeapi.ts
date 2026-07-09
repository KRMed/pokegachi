let list: { name: string }[] = [];

async function getPokemonList() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();
  list = data.results;
}

export async function getRandomPokemon() {
  await getPokemonList();
  const randomIndex = Math.floor(Math.random() * list.length);
  return {
    name: list[randomIndex].name,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomIndex + 1}.png`,
  };
}

export async function getNextEvolution(
  name: string,
): Promise<{ name: string; sprite: string } | null> {
  const speciesRes = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${name}`,
  );
  const species = await speciesRes.json();

  const chainRes = await fetch(species.evolution_chain.url);
  const chainData = await chainRes.json();

  function findNextStage(pokemon: any): any {
    if (pokemon.species.name === species.name) {
      return pokemon.evolves_to[0] ?? null;
    }
    //The evolution goes through trying to find the correct one if the first one is no the correct one
    for (const child of pokemon.evolves_to) {
      const result = findNextStage(child);
      if (result) return result;
    }
    return null;
  }

  const nextPokemon = findNextStage(chainData.chain);
  if (!nextPokemon) return null;

  const pokemonRes = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${nextPokemon.species.name}`,
  );
  const pokemonData = await pokemonRes.json();

  return {
    name: nextPokemon.species.name,
    sprite: pokemonData.sprites.front_default,
  };
}
