<script>
	export let div;

	const { episode, styles } = div;
	let number = episode.toString();

	if (number.length === 1) {
		number = "0" + number;
	}
</script>

<div
	class="episode"
	style="--grid-row:{styles.row}; --grid-column:{styles.col}">
		EP<br>{number}
</div>
