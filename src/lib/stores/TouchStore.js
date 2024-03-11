import { persisted } from "svelte-persisted-store";

export const touchEnabled = persisted("touchEnabled", false);
