<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { user } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		user.subscribe((u) => {
			if (u) goto('/');
		});
	});
</script>

<div class="flex flex-col justify-center h-screen">
	<slot />
</div>
