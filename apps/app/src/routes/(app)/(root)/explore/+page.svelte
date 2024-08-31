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

		leaflet
			.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			})
			.addTo(map);

		map.eachLayer((layer) => map.removeLayer(layer));
		leaflet
			.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			})
			.addTo(map);

		await updateLocations();
		leaflet
			.marker([$location?.latitude ?? 0, $location?.longitude ?? 0])
			.addTo(map)
			.bindPopup('You are here!');
		map.setView([$location?.latitude ?? 0, $location?.longitude ?? 0], 13);

		if (map) {
			for (const element of Object.entries($friendLocations)) {
				const [id, location] = element;
				const marker = leaflet.marker([location.latitude, location.longitude]).addTo(map);
				marker.bindPopup(`<b>${id}</b><br>${location.latitude}, ${location.longitude}`);
			}
		}
	});

	friendLocations.subscribe(async (locations) => {
		if (!map) return;

		const leaflet = await import('leaflet');

		map.eachLayer((layer) => map.removeLayer(layer));
		leaflet
			.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			})
			.addTo(map);

		leaflet
			.marker([$location?.latitude ?? 0, $location?.longitude ?? 0])
			.addTo(map)
			.bindPopup('You are here!');

		if (map) {
			for (const element of Object.entries(locations)) {
				const [id, location] = element;
				const marker = leaflet.marker([location.latitude, location.longitude]).addTo(map);
				marker.bindPopup(`<b>${id}</b><br>${location.latitude}, ${location.longitude}`);
			}
		}
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
</script>

<div class="absolute top-0 bottom-0 left-0 right-0 z-0" bind:this={mapElement}></div>
