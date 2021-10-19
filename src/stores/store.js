import { writable } from "svelte/store";

export default writable({
	activePage: undefined,
	scrollPosition: {}
});
