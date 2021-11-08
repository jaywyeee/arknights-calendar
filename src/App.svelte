<script>
	import { onMount } from "svelte";
	import Button from "./components/Button.svelte";
	import Schedule from "./components/Schedule.svelte";
	import { activePage } from "./stores/store.js";

	const pages = [
		{ id: "pr", name: "Pr.", description: "This is a tentative projection based on the CN schedule and past trends which will be updated to reflect new information as it becomes available." },
		{ id: "cn", name: "CN", description: "This is a complete timeline of the CN schedule." },
		{ id: "en", name: "EN", description: "This is a complete timeline of the EN schedule." },
		{ id: "tw", name: "TW", description: "This is a complete timeline of the TW schedule." }
	];

	$activePage = pages[0].id;


	// Permalinks
	const params = new URLSearchParams(window.location.search);

	if (params.get("schedule")) {
		$activePage = params.get("schedule");

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


<div class="bar">
	<!-- <img src="images/calendar.svg" aria-hidden="true"> -->
	<nav>
		{#each pages as page}
			<Button {page}/>
		{/each}
	</nav>
	<aside>
		<a href="https://github.com/jaywyeee/arknights-calendar"> </a>
	</aside>
</div>
<main>
	{#each pages as page}
		<Schedule {page}/>
	{/each}
</main>
