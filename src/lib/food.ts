 const list: { name: string; sprite: string }[] = [
    { name: "Oran Berry", sprite: "https://raw.githubusercontent.com/msikma/pokesprite/master/items/berry/oran.png" },
    { name: "Pecha Berry", sprite: "https://raw.githubusercontent.com/msikma/pokesprite/master/items/berry/pecha.png" },
    { name: "Fancy Apple", sprite:
  "https://raw.githubusercontent.com/msikma/pokesprite/master/items/curry-ingredient/fancy-apple.png" },
  ];

export function getRandomFood() {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

export function getFood(name:string) {
  for(let i=0;i<list.length;i++){
    if(list[i].name==name){
        return list[i]
    }
  }
  return null;https://github.com/msikma/pokesprite/blob/master/items/berry/oran.png
}
