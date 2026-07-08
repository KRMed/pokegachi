export const foods: { name: string; sprite: string }[] = [
  {
    name: "Oran Berry",
    sprite:
      "https://raw.githubusercontent.com/msikma/pokesprite/master/items/berry/oran.png",
  },
  {
    name: "Pecha Berry",
    sprite:
      "https://raw.githubusercontent.com/msikma/pokesprite/master/items/berry/pecha.png",
  },
  {
    name: "Fancy Apple",
    sprite:
      "https://raw.githubusercontent.com/msikma/pokesprite/master/items/curry-ingredient/fancy-apple.png",
  },
];

export function getRandomFood() {
  const randomIndex = Math.floor(Math.random() * foods.length);
  return foods[randomIndex];
}

export function getFood(name: string) {
  for (let i = 0; i < foods.length; i++) {
    if (foods[i].name == name) {
      return foods[i];
    }
  }
  return null;
}
