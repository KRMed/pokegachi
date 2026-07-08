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
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomIndex + 1}.png`
  };
}