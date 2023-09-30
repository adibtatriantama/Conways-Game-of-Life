<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { World } from './world';

	let world = World.random(150, 75);

	let intervalId: string | number | NodeJS.Timeout | undefined;

	function start() {
		intervalId = setInterval(async () => {
			world.advance();
			world = world;
		}, 200);
	}

	function stop() {
		if (intervalId) {
			clearInterval(intervalId);
		}
	}

	function clear() {
		if (intervalId) {
			clearInterval(intervalId);
		}
		world.clear();
		world = world;
	}

	function toggleState(x: number, y: number) {
		world.toggleCellState(x, y);
		world = world;
	}

	onMount(() => start());

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<div>{world.generation}</div>
<button on:click={start}>Start</button>
<button on:click={stop}>Stop</button>
<button on:click={clear}>Clear</button>
<div
	class="grid"
	style="grid-template-columns: repeat({world.x}, 8px); grid-template-rows: repeat({world.y}, 8px);"
>
	{#each { length: world.y } as _, i}
		{#each { length: world.x } as __, j}
			<button
				class="border {world.data[j][i].state ? 'bg-green-600' : 'bg-white'}"
				on:click={() => toggleState(j, i)}
			/>
		{/each}
	{/each}
</div>
