<script lang="ts">
	import Bell from 'lucide-svelte/icons/bell';
	import DoorOpen from 'lucide-svelte/icons/door-open';
	import UserRoundPlus from 'lucide-svelte/icons/user-round-plus';

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

	onMount(async () => {
		const { friends: ids } = await trpc.friends.getAll.query();
		const { users } = await trpc.user.getMultiple.query(ids);

		friends = users?.map((user) => ({
			name: user.full_name ?? '',
			avatar: user.pfp ?? '',
			status: user.status
		}));
	});
</script>

<div class="flex flex-col gap-8">
	<div class="flex justify-between">
		<h1 class="text-5xl font-black">Good morning!</h1>

		<Button on:click={() => goto('/requests')} variant="ghost">
			<Bell class="w-6 h-6" />
		</Button>
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
		{/if}
	</div>
</div>

<div class="absolute right-0 flex flex-col gap-4 bottom-40">
	<button on:click={() => goto('/add')} class="rounded-full bg-muted neu-up">
		<UserRoundPlus class="w-6 h-6 m-4 stroke-muted-foreground" />
	</button>
	<button class="rounded-full bg-primary neu-r">
		<DoorOpen class="w-6 h-6 m-4" />
	</button>
</div>
