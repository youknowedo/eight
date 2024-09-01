<script lang="ts">
	import Compass from 'lucide-svelte/icons/compass';
	import Users from 'lucide-svelte/icons/users';

	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { sessionStarted, user } from '$lib/stores';
	import { onMount } from 'svelte';

	let switching = false;

	onMount(() => {
		if (!$user?.completed_profile) goto('/completeProfile');
	});
</script>

<div class="flex flex-col h-screen pb-20">
	<slot />
</div>
<div
	class="absolute z-50 flex items-center justify-around border bg-background h-20 duration-200 bottom-12 rounded-3xl w-80 neu-up {$sessionStarted
		? 'border-primary'
		: 'border-background'}"
>
	<div
		class="absolute w-16 h-16 rounded-full bg-primary neu-r -z-10 duration-500 {$page.url.pathname.startsWith(
			'/explore'
		)
			? 'mr-[13.25rem]'
			: $page.url.pathname.startsWith('/social')
				? '-mr-[13.25rem]'
				: $page.url.pathname.startsWith('/start')
					? 'mr-0'
					: 'hidden'} {switching ? 'elongate' : ''}"
	/>

	<button
		on:click={() => {
			switching = true;
			setTimeout(() => {
				switching = false;
			}, 500);
			goto('/explore');
		}}
	>
		<Compass class="w-6 h-6 m-6" />
	</button>
	<button
		on:click={() => {
			switching = true;
			setTimeout(() => {
				switching = false;
			}, 500);
			goto('/start');
		}}
	>
		<img class="w-6 h-6 m-6" src="{base}/logo.svg" alt="" />
	</button>
	<button
		on:click={() => {
			switching = true;
			setTimeout(() => {
				switching = false;
			}, 500);
			goto('/social');
		}}
	>
		<Users class="w-6 h-6 m-6" />
	</button>
</div>
