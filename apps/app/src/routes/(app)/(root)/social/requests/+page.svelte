<script lang="ts">
	import { goto } from '$app/navigation';
	import { trpc } from '$lib/trpc';
	import { Button, Input } from '@eight/ui/components';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import Search from 'lucide-svelte/icons/search';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	type Request = {
		id: string;
		name: string;
		username: string;
		avatar: string;
		status: 'hanging' | 'down' | 'ghost';
	};

	let requests: Request[] | undefined = undefined;

	onMount(async () => {
		const { requests: ids } = await trpc.friends.requests.query();
		const { users } = await trpc.user.multiple.query(ids);

		requests = users?.map((user) => ({
			id: user.id,
			name: user.full_name ?? '',
			username: user.username,
			avatar: user.pfp ?? '',
			status: user.status
		}));
	});

	const accept = async (id: string) => {
		const { success, error } = await trpc.friends.accept.mutate(id);

		if (success) {
			toast.success('Friend request accepted!');
			requests = requests?.filter((request) => request.username !== id);
		} else toast.error(error ?? 'An error occurred');
	};
	const reject = async (id: string) => {
		const { success, error } = await trpc.friends.reject.mutate(id);

		if (success) {
			toast.success('Friend request rejected!');
			requests = requests?.filter((request) => request.username !== id);
		} else toast.error(error ?? 'An error occurred');
	};
</script>

<button on:click={() => history.back()} class="flex items-center mb-4 -m-4">
	<ChevronLeft class="w-6 h-6 m-4" />

	<h1 class="text-3xl font-black">Friend Requests</h1>
</button>

<div class="flex flex-col gap-5">
	{#if requests === undefined}
		<p class="text-2xl text-gray-500">Loading...</p>
	{:else}
		{#each requests as requestUser}
			<div class="flex items-center gap-3">
				<img src={requestUser.avatar} alt={requestUser.name} class="w-12 h-12 rounded-2xl" />
				<div class="flex-1">
					<p class="text-2xl font-black">{requestUser.name}</p>
					<p class="text-sm">
						@{requestUser.username}
					</p>
				</div>
				<div class="flex items-center">
					<Button on:click={() => reject(requestUser.id)} variant="destructive">Reject</Button>
					<Button on:click={() => accept(requestUser.id)}>Accept</Button>
				</div>
			</div>
		{/each}
	{/if}
</div>
