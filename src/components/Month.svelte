<script>
	import Episode from "./Episode.svelte";
	import Event from "./Event.svelte";

	export let date, eventDivs, episodeDivs;

	const y = date[0];
	const m = date[1];
	const days = new Date(y, m + 1, 0).getDate();

	date = new Date(...date);
	const monthName = date.toLocaleString("en", { month: "long" });
	const firstDay = date.getDay();
	const sundayStart = firstDay === 0;

	const events = eventDivs?.[y]?.[m];
	const episodes = episodeDivs?.[y]?.[m];
</script>

<section class:no-margin={sundayStart}>
	<h1>{monthName} <span>{y}</span></h1>
	<div class="calendar">
		{#each Array(days) as _, index}
			{#if (index === 0 && !sundayStart)}
				<div style="--grid-start:{firstDay + 1}"></div>
			{:else}
				<div></div>
			{/if}
		{/each}
	</div>
	{#if events || episodes}
		<div class="overlay">
			{#if events}
				{#each events as event}
					<Event div={event}/>
				{/each}
			{/if}
			{#if episodes}
				{#each episodes as episode}
					<Episode div={episode}/>
				{/each}
			{/if}
		</div>
	{/if}
</section>
