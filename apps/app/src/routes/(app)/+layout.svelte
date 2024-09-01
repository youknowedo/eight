<script lang="ts">
	import { goto } from '$app/navigation';
	import { sessionStarted, user } from '$lib/stores.js';
	import { trpc } from '$lib/trpc';
	import { updateLocations } from '$lib/utils';
	import { onMount } from 'svelte';

	onMount(() => {
		user.subscribe(async (u) => {
			if (u === null) goto('/login');
			if (!u) return;

			if (!u.completed_profile) return goto('/completeProfile');

			const { success, error, location } = await trpc.location.single.query();
			if (!success) return console.error(error);

			sessionStarted.set(!!location);
		});

		setInterval(updateLocations, 60 * 1000);
	});
</script>

<div class="mx-auto max-w-80">
	<slot />
</div>
