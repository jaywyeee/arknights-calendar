<script>
	import names from "../data/names.json";
	import { activePage } from "../stores/store.js";
	import { getContext } from "svelte";

	export let div;

	const { event, name, rerun, order, overlap, styles } = div;
	const id = getContext("id");


	// Copy permalink on click.
	const url = window.location.origin + window.location.pathname;
	const text = `${names[event]}${rerun ? " (Rerun)" : ""}`;

	function getPermalink() {
		const copyUrl = url + `?schedule=${$activePage}&event=${event}${rerun ? ".rerun" : ""}`;
		const targets = document.querySelectorAll(`#${$activePage} .${event}${rerun ? ".rerun" : ":not(.rerun)"}`);

		// Copy to clipboard.
		navigator.clipboard.writeText(copyUrl);

		// Alert to user.
		for (const div of targets) {
			if (div.textContent) {
				div.textContent = "Copied!";
				setTimeout(() => { div.textContent = text }, 2000);
			};
		};
	};


	// Add title attribute on hover if text is overflowing.
	let element, title;

	function addTitle() {
		if (name) {
			title = (element.scrollWidth > element.offsetWidth) ? text : undefined;
		};
	};


	// Expand all overlapping divs on hover.
	function overlapHover() {
		const targets = document.querySelectorAll(`#${$activePage} .${event}${rerun ? ".rerun" : ":not(.rerun)"}`);

		for (const div of targets) {
			const classes = div.classList;

			if (classes.contains("top") || classes.contains("bottom")) {
				classes.toggle("expand");
			};
		};
	};
</script>

<div
	bind:this={element}
	class={event}
	class:rerun
	class:start={order === "start"}
	class:end={order === "end"}
	class:top={overlap === "top"}
	class:bottom={overlap === "bottom"}
	class:hidden={name && $activePage !== id}
	style="--grid-row: {styles.row}; --grid-column: {styles.col}"
	title={title}
	on:click={getPermalink}
	on:mouseenter={addTitle}
	on:mouseenter={overlapHover}
	on:mouseleave={overlapHover}>
		{#if name} {text} {/if}
</div>
