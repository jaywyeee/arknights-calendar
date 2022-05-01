<script>
	import { activePage } from "../stores/store.js";

	export let page;

	const url = window.location.origin + window.location.pathname;

	function changePage() {
		$activePage = page.id;

		// Edit URL to match page.
		const parameters = (page.id === "pr") ? "" : `?schedule=${page.id}`;
		window.history.replaceState({}, "", url + parameters);
	};
</script>

<button
	type="button"
	class:active={$activePage === page.id}
	on:click={changePage}>
		<div class="icon {page.icon}"></div>
		{page.name || page.id.toUpperCase()}
</button>
