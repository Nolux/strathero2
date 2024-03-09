import { persisted } from "svelte-persisted-store";

export const audioMuted = persisted("audioMuted", false);
