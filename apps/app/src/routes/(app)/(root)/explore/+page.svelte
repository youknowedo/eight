<script lang="ts">
	import type { Map } from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { onDestroy, onMount } from 'svelte';

	let mapElement: HTMLDivElement;
	let map: Map;

	onMount(async () => {
		const leaflet = await import('leaflet');

		map = leaflet.map(mapElement).setView([51.505, -0.09], 13);

		leaflet
			.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			})
			.addTo(map);

		leaflet
			.marker([51.5, -0.09])
			.addTo(map)
			.bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
			.openPopup();
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
</script>

<div class="absolute top-0 bottom-0 left-0 right-0 z-0" bind:this={mapElement}></div>
