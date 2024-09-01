<script lang="ts">
	import Bell from 'lucide-svelte/icons/bell';
	import BellDot from 'lucide-svelte/icons/bell-dot';

	import { goto } from '$app/navigation';
	import { trpc } from '$lib/trpc';
	import { Button } from '@eight/ui/components';
	import { onMount } from 'svelte';

	type Status = 'hanging' | 'down' | 'ghost';
	type Friend = {
		name: string;
		avatar: string;
		status: Status;
	};

	let friends: Friend[] | undefined = undefined;
	let hasRequests = false;

	onMount(async () => {
		const { friends: ids } = await trpc.friends.getAll.query();
		const { users } = await trpc.user.multiple.query(ids);
		const { requests: r } = await trpc.friends.requests.query();
		hasRequests = !!r && r.length > 0;

		friends = users?.map((user) => ({
			name: user.full_name ?? '',
			avatar: user.pfp ?? '',
			status: user.status
		}));
	});
</script>

<div class="flex flex-col gap-8">
	<div class="flex justify-between">
		<h1 class="text-3xl font-black">Friends</h1>

		<button on:click={() => goto('/friends/requests')} class="-m-6">
			{#if hasRequests}
				<BellDot class="w-6 h-6 m-6" />
			{:else}
				<Bell class="w-6 h-6 m-6" />
			{/if}
		</button>
	</div>

	<div class="flex flex-col gap-5">
		{#if friends === undefined}
			<p class="text-2xl text-gray-500">Loading...</p>
		{:else}
			{#each friends as friend}
				<div class="flex items-center gap-3 {friend.status == 'ghost' ? 'opacity-50' : ''}">
					<img src={friend.avatar} alt={friend.name} class="w-12 h-12 rounded-2xl" />
					<div>
						<p class="text-2xl font-black">{friend.name}</p>
						<p
							class="text-sm flex items-center gap-1.5 {friend.status === 'hanging'
								? 'text-green-500'
								: friend.status === 'down'
									? 'text-yellow-500'
									: 'text-gray-500'}"
						>
							<span
								class="w-2 h-2 rounded-sm block {friend.status === 'hanging'
									? 'bg-green-500'
									: friend.status === 'down'
										? 'bg-yellow-500'
										: 'bg-gray-500'}"
							/>

							{friend.status}
							{#if friend.status === 'hanging'}
								<span class="text-gray-500">2 km</span>
							{/if}
						</p>
					</div>
				</div>
			{/each}

			<!-- Add friend button, link to add friend page -->
			<Button variant="secondary" on:click={() => goto('/friends/add')} class="w-full">
				Search for friends
			</Button>
		{/if}
	</div>
</div>
