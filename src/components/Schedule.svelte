<script>
	import Month from "./Month.svelte";
	import episodeSchedules from "../data/episodeSchedules.js";
	import eventSchedules from "../data/eventSchedules.js";
	import { activePage } from "../stores/store.js";

	export let page;

	const schedule = eventSchedules[page.id];


	// Generate list of months.
	const years = Object.keys(schedule).map((year) => parseInt(year));

	const startYear = years[0];
	const startDate = [startYear, schedule[startYear][0].start[0] - 1];

	const endYear = years[years.length - 1];
	const endEvents = schedule[endYear];
	const lastEvent = endEvents[endEvents.length - 1];
	let endDate = [endYear, lastEvent.start[0] - 1]
	endDate = [...endDate, lastEvent.start[1] + lastEvent.duration];

	const months = [];

	for (
		let date = new Date(...startDate), end = new Date(...endDate);
		date <= end;
		date.setMonth(date.getMonth() + 1)
	) {
		const y = date.getFullYear();
		const m = date.getMonth();
		months.push([y, m]);
	};


	// Generate list of Sundays.
	const weekStarts = {};

	for (const month of months) {
		const [y, m] = month;

		weekStarts[y] ??= {};
		weekStarts[y][m] ??= [];

		for (
			let date = new Date(y, m), end = new Date(y, m + 1), first = true;
			date < end;
			date.setDate(date.getDate() + 1), first = false
		) {
			// Add incomplete first week then subsequent Sundays.
			if (first || date.getDay() === 0) {
				weekStarts[y][m].push(date.getDate());
			};
		};
	};


	// Generate elements of events.
	const eventDivs = {}
	let lastDate;
	let eventCache = [];

	for (const year in schedule) {
		for (const event of schedule[year]) {
			let startDate = [parseInt(year), ...event.start];
			startDate[1]--;

			let endDate = [...startDate];
			endDate[2] += event.duration;


			// Calculate length of elements.
			const parts = [{ len: 0, start: startDate }];

			for (
				let date = new Date(...startDate), end = new Date(...endDate), index = 0, first = true;
				date <= end;
				date.setDate(date.getDate() + 1), first = false
			) {
				// Move to next week if Sunday and not first iteration.
				if (date.getDay() === 0 && !first) {
					parts.push({len: 0, start: [date.getFullYear(), date.getMonth(), date.getDate()]});
					index++;
					parts[index].len++;
				} else {
					parts[index].len++;
				};
			};


			// Offset if event starts directly after the previous event.
			let offset = false;

			if (lastDate?.getTime() === new Date(...startDate).getTime()) {
				offset = true;

				let lastEventDiv = eventCache[eventCache.length - 1].styles;
				lastEventDiv.col = `1 / span ${lastEventDiv.col.match(/\d+$/)[0] - 1}`
			};


			let nextEventCache = [];

			for (const [index, { len, start }] of parts.entries()) {
				const [y, m, d] = start;


				let week = weekStarts[y][m].findIndex((date) => date > d);
				week = (week != -1) ? week : weekStarts[y][m].length;

				let col, row;

				if (index === 0) {
					row = week;
					col = `span ${len * 2 - (offset ? 1 : 0)} / -1`;
				} else {
					row = week;
					col = `1 / span ${len * 2}`;
				};


				let order;

				switch (index) {
					case 0:
						order = "start";
						break;
					case parts.length - 1:
						order = "end";
						break;
				};

				let overlap;

				if (lastDate?.getTime() > new Date(...startDate).getTime()) {
					for (const div of eventCache) {
						if (new Date(y, m, d).getTime() < new Date(...div.end).getTime()) {
							div.overlap = "top";
							overlap = "bottom";
						};
					};
				};


				eventDivs[y] ??= {}
				eventDivs[y][m] ??= []

				eventDivs[y][m].push({
					event: event.event,
					name: index === 0 ? true : false,
					rerun: event.rerun || false,
					order: order || null,
					overlap: overlap || null,
					styles: {row, col},
					end: [y, m, d + len - 1]
				});

				nextEventCache.push(eventDivs[y][m][eventDivs[y][m].length - 1])
			};

			eventCache = nextEventCache;
			lastDate = new Date(...endDate);
		};
	};


	// Generate episode div elements.
	const episodes = episodeSchedules[page.id];
	const episodeDivs = {};

	for (const { date, episode } of episodes) {
		let [y, m, d] = date;
		m--;

		let week = weekStarts[y][m].findIndex((date) => date > d);
		week = (week != -1) ? week : weekStarts[y][m].length;

		const day = new Date(date).getDay();

		const row = week;
		const col = `${day * 2 + 1} / span 2`;

		episodeDivs[y] ??= {};
		episodeDivs[y][m] ??= [];

		episodeDivs[y][m].push({
			episode,
			styles: {row, col}
		});
	};


	// Exclude first month of future schedule if mostly empty.
	if (page.id === "pr") {
		const [y, m] = startDate;

		const firstDiv = eventDivs[y][m][0];

		if (firstDiv.styles.row >= 4) {
			const lastDiv = eventDivs[y][m][eventDivs[y][m].length - 1];

			months.shift();
			lastDiv.styles.row = "1";
			lastDiv.name = true;
			eventDivs[y][Object.keys(eventDivs[y])[1]].unshift(lastDiv);
		};
	};
</script>

<article id={page.id} class:active={$activePage === page.id}>
	<div>
		<p>{page.description}</p>
		{#each months as month}
			<Month date={month} {eventDivs} {episodeDivs}/>
		{/each}
	</div>
</article>
