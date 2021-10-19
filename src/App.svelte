<script>
	import { onMount } from "svelte";
	import Button from "./components/Button.svelte";
	import Schedule from "./components/Schedule.svelte";
	import store from "./stores/store.js";

	// Disable persistent scroll position across refreshes.
	history.scrollRestoration = "manual";


	const pages = [
		{ id: "pr", name: "Projection", description: "This is a tentative projection based on the CN schedule and past trends which will be updated to reflect new information as it becomes available." },
		{ id: "cn", name: "CN", description: "This is a complete timeline of the CN schedule." },
		{ id: "en", name: "EN", description: "This is a complete timeline of the EN schedule." }
	];

	$store.activePage = pages[0].id;
	for (const page of pages) { $store.scrollPosition[page.id] = 0 }


	// Permalinks
	const params = new URLSearchParams(window.location.search);

	if (params.get("schedule")) {
		$store.activePage = params.get("schedule");

		onMount(() => {
			if (params.get("event")) {
				setTimeout(() => {
					const targetEvent = document.querySelector(`#${params.get("schedule")} .${params.get("event")}`);
					targetEvent.scrollIntoView();
				}, 0);
			};
		});
	};
</script>

<nav>
	{#each pages as page}
		<Button {page}/>
	{/each}
</nav>
<main>
	{#each pages as page}
		<Schedule {page}/>
	{/each}
</main>
<aside><a href="https://github.com/jaywyeee/arknights-calendar"> </a></aside>
