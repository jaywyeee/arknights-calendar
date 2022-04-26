<script>
	import Month from "./Month.svelte";
	import episodeData from "../data/episodes.json";
	import eventData from "../data/events.json";
	import isData from "../data/is.json";
	import { activePage, opacity, travel } from "../stores/store.js";
	import { setContext } from "svelte";
	import { cubicOut } from "svelte/easing";

	export let page;

	setContext("id", page.id);
	const schedule = eventData[page.id];


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
	let eventCache = [];
	let topOverlap, lastDate;

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
				lastEventDiv.col = `1 / span ${lastEventDiv.col.match(/\d+$/)[0] - 1}`;

				if (topOverlap) {
					topOverlap.styles.col = `1 / span ${topOverlap.styles.col.match(/\d+$/)[0] - 1}`;
				};
			};

			topOverlap = null;


			let nextEventCache = [];

			for (const [index, { len, start }] of parts.entries()) {
				const [y, m, d] = start;


				let week = weekStarts[y][m].findIndex((date) => date > d);
				week = (week !== -1) ? week : weekStarts[y][m].length;

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
						if (new Date(...start).getTime() < new Date(...div.end).getTime()) {
							div.overlap = "top";
							overlap = "bottom";

							if (order === "end") {
								topOverlap = div;
							};
						};
					};

					if (eventCache[0].start.toString() === start.toString() && eventCache[0].order === "start") {
						col = eventCache[0].styles.col;
					};
				};


				eventDivs[y] ??= {};
				eventDivs[y][m] ??= [];

				eventDivs[y][m].push({
					event: event.event,
					name: index === 0 ? true : false,
					rerun: event.rerun || false,
					order: order || null,
					overlap: overlap || null,
					styles: {row, col},
					start,
					end: [y, m, d + len - 1]
				});

				nextEventCache.push(eventDivs[y][m][eventDivs[y][m].length - 1]);
			};

			eventCache = nextEventCache;
			lastDate = new Date(...endDate);
		};
	};


	// Generate div elements for permanent events (e.g. Episodes, Integrated Strategies)
	function createPermanents(data) {
		const pageData = data[page.id];
		const divs = {};

		if (pageData) {
			for (const { id, date } of pageData) {
				let [y, m, d] = date;
				m--;

				const scheduleStart = new Date(months[0][0], months[0][1]).getTime();
				const eventStart = new Date(y, m).getTime();

				if (scheduleStart <= eventStart) {
					let week = weekStarts[y][m].findIndex((date) => date > d);
					week = (week !== -1) ? week : weekStarts[y][m].length;

					const day = new Date(date).getDay();

					const row = week;
					const col = `${day * 2 + 1} / span 2`;

					divs[y] ??= {};
					divs[y][m] ??= [];

					divs[y][m].push({
						id,
						styles: {row, col}
					});
				};
			};
		};

		return divs;
	};

	const episodeDivs = createPermanents(episodeData);
	const isDivs = createPermanents(isData);


	// Drop first month of future schedule if mostly empty.
	if (page.id === "pr") {
		const [y, m] = startDate;
		const firstDiv = eventDivs[y][m][0];
		const lastDiv = eventDivs[y][m][eventDivs[y][m].length - 1];
		const sundayStart = new Date(y, m + 1, 1).getDay() === 0;
		const nextMonth = m !== 11 ? eventDivs[y][m + 1] : eventDivs[y + 1][0];

		if (firstDiv.styles.row >= 3) {
			months.shift();
			lastDiv.styles.row = "1";

			if (lastDiv.order === "end") {
				lastDiv.name = true;
			} else if (!lastDiv.order || (sundayStart && lastDiv.order === "start")) {
				const endDiv = nextMonth.find(div => {
					return div.event === lastDiv.event && div.order === "end";
				});

				endDiv.name = true;
			};

			if (!sundayStart) {
				nextMonth.unshift(lastDiv);
			};
		};
	};


	// Swipe handling
	let startX, startY, currentX, currentY, isChanging, notScrolling, pageChanged;
	const thresholdX = 25;
	const thresholdY = 50;

	const tweenOptions = { duration: 120, easing: cubicOut };
	let direction;
	// $: direction = (startX > currentX) ? "left" : "right";
	$: pageExists = (direction === "left" && page.next) || (direction === "right" && page.prev);

	function handleTouchstart(e) {
		startX = e.touches[0].clientX;
		startY = e.touches[0].clientY;
	};

	function handleTouchmove(e) {
		currentX = e.touches[0].clientX;
		currentY = e.touches[0].clientY;

		direction = (startX > currentX) ? "left" : "right";
		notScrolling = isChanging || ((currentY < startY + thresholdY) && (currentY > startY - thresholdY));

		if ((currentX > startX + thresholdX || currentX < startX - thresholdX) && notScrolling && pageExists) {
			travel.set((Math.abs(startX - currentX) - thresholdX) / 100);
			isChanging = true;

			if ($travel >= 1) {
				$activePage = (direction === "left") ? page.next : page.prev;
				pageChanged = true;
			};
		};
	};

	async function handleTouchend() {
		if (notScrolling && !pageChanged && pageExists && $travel > 0.15) {
			await travel.set(1, tweenOptions);
			$activePage = (direction === "left") ? page.next : page.prev;
			travel.set(0, tweenOptions);
		} else if ((isChanging || pageChanged) && pageExists && $travel > 0.15) {
			travel.set(2, tweenOptions);
		} else {
			travel.set(0);
		};

		isChanging = notScrolling = pageChanged = null;
	};
</script>

<article
	style={$activePage === page.id ? `opacity: ${$opacity}` : undefined}
	id={page.id}
	class:active={$activePage === page.id}
	on:touchstart|passive={handleTouchstart}
	on:touchmove|passive={handleTouchmove}
	on:touchend={handleTouchend}>
		<div>
			{#each page.description as description}
				<p>{description}</p>
			{/each}
			{#each months as month}
				<Month date={month} {eventDivs} {episodeDivs} {isDivs}/>
			{/each}
		</div>
</article>
