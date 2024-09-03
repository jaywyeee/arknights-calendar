<script>
	import Banner from "./components/Banner.svelte";
	import Button from "./components/Button.svelte";
	import Schedule from "./components/Schedule.svelte";
	import pages from "./data/pages.json";
	import { activePage } from "./stores/store.js";
	import { onMount } from "svelte";

	$activePage = pages[0].id;

	for (const [index, page] of pages.entries()) {
		page.prev = pages[index - 1]?.id;
		page.next = pages[index + 1]?.id;
	};

	const base = import.meta.env.MODE === "production" ? import.meta.env.BASE_URL : "";


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

<svelte:head>
	<link rel="icon" href="{base}images/calendar.svg">
	<link rel="preload" href="{base}images/github.svg" as="image">
</svelte:head>
<div class="bar">
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
	<Banner text="This website will not be updated any longer. Forking is welcomed. Thank you for the support all this time, it was fun."/>
	{#each pages as page}
		<Schedule {page}/>
	{/each}
</main>
