<script lang="ts">
	import { onMount } from 'svelte';

	type Status = 'hanging' | 'down' | 'ghost';
	type Friend = {
		name: string;
		avatar: string;
		status: Status;
	};

	let friends: Friend[] | undefined = undefined;

	onMount(async () => {
		friends = [
			{
				name: 'John Doe',
				avatar: await fetch('https://thispersondoesnotexist.com', {
					mode: 'cors'
				})
					.then((res) => res.blob())
					.then((blob) => URL.createObjectURL(blob)),
				status: 'hanging'
			},
			{
				name: 'John Doe',
				avatar: await fetch('https://thispersondoesnotexist.com', {
					mode: 'cors'
				})
					.then((res) => res.blob())
					.then((blob) => URL.createObjectURL(blob)),
				status: 'hanging'
			},
			{
				name: 'John Doe',
				avatar: await fetch('https://thispersondoesnotexist.com', {
					mode: 'cors'
				})
					.then((res) => res.blob())
					.then((blob) => URL.createObjectURL(blob)),
				status: 'hanging'
			},
			{
				name: 'John Doe',
				avatar: await fetch('https://thispersondoesnotexist.com', {
					mode: 'cors'
				})
					.then((res) => res.blob())
					.then((blob) => URL.createObjectURL(blob)),
				status: 'down'
			},
			{
				name: 'John Doe',
				avatar: await fetch('https://thispersondoesnotexist.com', {
					mode: 'cors'
				})
					.then((res) => res.blob())
					.then((blob) => URL.createObjectURL(blob)),
				status: 'ghost'
			},
			{
				name: 'John Doe',
				avatar: await fetch('https://thispersondoesnotexist.com', {
					mode: 'cors'
				})
					.then((res) => res.blob())
					.then((blob) => URL.createObjectURL(blob)),
				status: 'ghost'
			}
		];
	});
</script>

<h1 class="text-5xl font-black">Good morning!</h1>

<div class="flex flex-col gap-5">
	{#if friends === undefined}
		<p>Loading...</p>
	{:else}
		{#each friends as friend}
			<div class="flex items-center space-x-4">
				<img src={friend.avatar} alt={friend.name} class="w-12 h-12 rounded-full" />
				<div>
					<p class="text-lg font-semibold">{friend.name}</p>
					<p class="text-sm text-gray-500">{friend.status}</p>
				</div>
			</div>
		{/each}
	{/if}
</div>
