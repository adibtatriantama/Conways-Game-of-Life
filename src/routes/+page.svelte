<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { World } from './world';

	let world = World.random(200, 200);

	let zoomableContainer: HTMLDivElement;
	let zoomable: HTMLDivElement;
	let currentScale = 1;

	let isDragging = false;
	let initialMouseX: number,
		initialMouseY: number,
		initialContentX: number,
		initialContentY: number;
	let currentContentX = 0,
		currentContentY = 0;

	let intervalId: string | number | NodeJS.Timeout | undefined;
	let isRunning: boolean;

	function start() {
		isRunning = true;
		intervalId = setInterval(async () => {
			world.advance();
			world = world;
		}, 1000);
	}

	function stop() {
		isRunning = false;
		if (intervalId) {
			clearInterval(intervalId);
		}
	}

	function clear() {
		stop();
		world.clear();
		world = world;
	}

	function toggleState(x: number, y: number) {
		world.toggleCellState(x, y);
		world = world;
	}

	function zoom(e: { deltaY: number }) {
		const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
		const calculatedScale = scaleChange * currentScale;
		console.log(calculatedScale);
		if (calculatedScale < 1) {
			currentScale = 1;
		} else if (calculatedScale > 8) {
			currentScale = 8;
		} else {
			currentScale = calculatedScale;
		}

		// Update content position for the new scale to maintain the current view
		currentContentX = currentContentX * scaleChange;
		currentContentY = currentContentY * scaleChange;
	}

	function onMouseDown(e) {
		isDragging = true;
		initialMouseX = e.clientX;
		initialMouseY = e.clientY;
		initialContentX = currentContentX;
		initialContentY = currentContentY;
		zoomable.style.cursor = 'grabbing';
	}

	function onMouseMove(e) {
		if (!isDragging) return;

		const offsetX = e.clientX - initialMouseX;
		const offsetY = e.clientY - initialMouseY;

		const newContentX = initialContentX + offsetX / currentScale; // Adjust for current scale
		const newContentY = initialContentY + offsetY / currentScale; // Adjust for current scale

		// Calculate the maximum allowed pan
		const maxContentX = Math.max(zoomableContainer.clientWidth - zoomable.offsetWidth, 0);
		const maxContentY = Math.max(zoomableContainer.clientHeight - zoomable.offsetHeight, 0);

		// Ensure that the panning does not exceed content boundaries
		currentContentX = Math.min(Math.max(newContentX, -maxContentX), 0);
		currentContentY = Math.min(Math.max(newContentY, -maxContentY), 0);

		zoomable.style.transform = `scale(${currentScale}) translate(${newContentX}px, ${newContentY}px)`;
		currentContentX = newContentX;
		currentContentY = newContentY;
	}

	function onMouseUp(e) {
		isDragging = false;
		zoomable.style.cursor = 'grab';
	}

	function onSelectStart(e) {
		if (isDragging) {
			e.preventDefault();
		}
	}

	onMount(() => start());

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<svelte:body on:mousemove={onMouseMove} on:mouseup={onMouseUp} on:selectstart={onSelectStart} />

<div
	bind:this={zoomableContainer}
	class="fixed top-0 bottom-0 left-0 right-0 overflow-hidden"
	style="user-drag: none; user-select:none"
>
	<div
		bind:this={zoomable}
		on:wheel|preventDefault={zoom}
		on:mousedown|preventDefault={onMouseDown}
		class="absolute grid w-full h-full"
		style="grid-template-columns: repeat({world.x}, 10px); grid-template-rows: repeat({world.y}, 10px); transform: scale({currentScale}); transform-origin: 0 0; cursor: grab;"
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
</div>

<div class="fixed font-bold right-4 top-2">Generation: {world.generation}</div>

<div class="fixed left-0 right-0 flex flex-col items-center bottom-4">
	{#if isRunning}
		<button class="w-16 p-2 font-semibold text-white bg-red-700" on:click={stop}>Stop</button>
	{:else if isRunning === false}
		<button class="w-16 p-2 font-semibold bg-green-700" on:click={start}>Start</button>
	{/if}
	<button class="w-16 p-2 mt-2 font-semibold bg-gray-200 rounded" on:click={clear}>Clear</button>
</div>
