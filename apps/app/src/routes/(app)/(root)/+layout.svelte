<script lang="ts">
	import Compass from 'lucide-svelte/icons/compass';
	import User from 'lucide-svelte/icons/user';

	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	let switching = false;
</script>

<div class="flex flex-col items-center h-screen pt-12 pb-32 overflow-x-hidden">
	<slot />

	<div
		class="absolute flex items-center justify-around h-20 bottom-12 rounded-3xl bg-background w-80 neu-up"
	>
		<div
			class="absolute w-16 h-16 rounded-full bg-primary neu-r -z-10 duration-500 {$page.url.pathname.startsWith(
				'/explore'
			)
				? 'mr-[13.25rem]'
				: $page.url.pathname.startsWith('/profile')
					? '-mr-[13.25rem]'
					: 'mr-0'} {switching ? 'elongate' : ''}"
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
				goto('/');
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
				goto('/profile');
			}}
		>
			<User class="w-6 h-6 m-6" />
		</button>
	</div>
</div>
