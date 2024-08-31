<script lang="ts">
	import { friendLocations, location } from '$lib/stores';
	import { updateLocations } from '$lib/utils';
	import type { Map } from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { onDestroy, onMount } from 'svelte';

	let mapElement: HTMLDivElement;
	let map: Map;

	onMount(async () => {
		const leaflet = await import('leaflet');

		map = leaflet.map(mapElement);

		await updateLocations(map);
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
</script>

<div class="absolute top-0 bottom-0 left-0 right-0 z-0" bind:this={mapElement}></div>
