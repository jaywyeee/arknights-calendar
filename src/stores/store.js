import { tweened } from "svelte/motion";
import { derived, writable } from "svelte/store";

export const activePage = writable();
export const travel = tweened(0, { duration: 0 });
export const opacity = derived(travel, $travel => ($travel < 1) ? 1 - $travel : ($travel >= 1) ? $travel - 1 : 1);
