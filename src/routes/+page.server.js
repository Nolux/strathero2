import { error } from "@sveltejs/kit";
import stratagems from "$lib/stratagems.json";

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateRounds = () => {
  let maxTime = 15;
  let rounds = [];
  for (let i = 1; i < 99; ) {
    rounds.push({
      roundNumber: i,
      stratagems: [shuffle(stratagems), shuffle(stratagems)]
        .flat()
        .slice(0, 5 + i),
      totalTime:
        ((maxTime - i + Math.abs(maxTime - i)) / 2 +
          Math.floor(Math.random() * 10) +
          3) *
        1000,
    });
    i++;
  }
  return rounds;
};

export async function load({ params }) {
  return { stratagems, rounds: generateRounds() };
}
