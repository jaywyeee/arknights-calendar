import { writable } from "svelte/store";

// let eventSchedules;

// fetch('data/episodeSchedules.json')
// 	.then(response => response.json())
// 	.then(data => eventSchedules = data);

// export default writable({
// 	activePage: undefined,
// 	// eventSchedules
// });

export const activePage = writable()
