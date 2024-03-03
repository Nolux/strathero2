import { error } from "@sveltejs/kit";
import stratagems from "$lib/stratagems.json";

export async function load({ params }) {
  console.log(stratagems);
  return { stratagems };
}
