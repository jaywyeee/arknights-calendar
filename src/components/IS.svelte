<script>
	export let div;

	const { id, styles } = div;
	let text = id.toUpperCase();
</script>

<div
	class="inst"
	style="--grid-row:{styles.row}; --grid-column:{styles.col}; --name:'{id}'">
</div>
