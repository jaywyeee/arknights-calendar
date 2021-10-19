<script>
	import store from "../stores/store.js";

	export let page;

	const url = window.location.origin + window.location.pathname;

	function changePage() {
		// Save scroll position of previous page.
		$store.scrollPosition[$store.activePage] = window.scrollY;

		$store.activePage = page.id;

		// Restore scroll position of destination page.
		requestAnimationFrame(() => window.scrollTo(0, $store.scrollPosition[page.id]));

		// Edit URL to match page.
		const parameters = (page.id === "pr") ? "" : `?schedule=${page.id}`;
		window.history.replaceState({}, "", url + parameters);
		console.log($store.scrollPosition)
	};
</script>

<button
	type="button"
	class:active={$store.activePage === page.id}
	on:click={changePage}>
		{page.name}
</button>
