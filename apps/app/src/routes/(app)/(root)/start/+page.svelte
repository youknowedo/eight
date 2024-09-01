<script lang="ts">
	import { location, sessionStarted } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import { updateLocations } from '$lib/utils';
	import { Button } from '@eight/ui/components';

	const toggleSession = async () => {
		sessionStarted.set(!$sessionStarted);

		if ($sessionStarted) {
			await updateLocations();
			trpc.location.start.mutate($location!);
		} else trpc.location.stop.mutate();
	};
</script>

<h1 class="mb-4 text-3xl font-black">Hang out!</h1>

<Button
	variant={$sessionStarted ? 'secondary' : undefined}
	class="duration-200"
	on:click={toggleSession}>{$sessionStarted ? 'Stop' : 'Start'} Session</Button
>
