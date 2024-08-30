<script>
	import { MapLibre } from 'svelte-maplibre';
</script>

<MapLibre
	center={[50, 20]}
	zoom={7}
	class="fixed top-0 left-0 w-full h-full"
	standardControls
	style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
/>
