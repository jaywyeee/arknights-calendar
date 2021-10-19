<script>
	import eventNames from "../data/eventNames.js";
	import store from "../stores/store.js";

	export let div;

	const { event, text, rerun, order, overlap, styles } = div;


	// Copy permalink on click.
	const url = window.location.origin + window.location.pathname;
	const name = `${eventNames[event]}${rerun ? " Rerun" : ""}`;

	function getPermalink() {
		const copyUrl = url + `?schedule=${$store.activePage}&event=${event}${rerun ? ".rerun" : ""}`;
		const targets = document.querySelectorAll(`#${$store.activePage} .${event}${rerun ? ".rerun" : ":not(.rerun)"}`);

		// Copy to clipboard.
		navigator.clipboard.writeText(copyUrl);

		// Alert to user.
		for (const div of targets) {
			if (div.textContent) {
				div.textContent = "Copied!";
				setTimeout(() => { div.textContent = name }, 2000);
			};
		};
	};


	// Add title attribute on hover if text is overflowing.
	let element, title;

	function addTitle() {
		if (text) {
			title = (element.scrollWidth > element.offsetWidth) ? name : undefined;
		};
	};


	// Expand all overlapping divs on hover.
	function overlapHover() {
		if (overlap) {
			const targets = document.querySelectorAll(`#${$store.activePage} .${event}${rerun ? ".rerun" : ":not(.rerun)"}.${overlap}`);

			for (const div of targets) {
				div.classList.toggle("expand");
			};
		};
	};
</script>

<div
	bind:this={element}
	class="{event}"
	class:rerun={rerun === true}
	class:start={order === "start"}
	class:end={order === "end"}
	class:top={overlap === "top"}
	class:bottom={overlap === "bottom"}
	style="--grid-row:{styles.row}; --grid-column:{styles.col}"
	title={title}
	on:click={getPermalink}
	on:mouseenter={addTitle}
	on:mouseenter={overlapHover}
	on:mouseleave={overlapHover}>
		{#if text} {name} {/if}
</div>
