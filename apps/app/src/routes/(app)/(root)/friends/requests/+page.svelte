<script lang="ts">
	import { goto } from '$app/navigation';
	import { trpc } from '$lib/trpc';
	import { Button, Input } from '@eight/ui/components';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import Search from 'lucide-svelte/icons/search';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	type Request = {
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
			name: user.full_name ?? '',
			username: user.username,
			avatar: user.pfp ?? '',
			status: user.status
		}));
	});

	const accept = async (id: string) => {};
	const reject = async (id: string) => {};
</script>

<button on:click={() => goto('/')} class="flex items-center -m-4 mb-4">
	<ChevronLeft class="w-6 h-6 m-4" />

	<h1 class="text-3xl font-black">Friend Requests</h1>
</button>

<div class="flex flex-col gap-5">
	{#if requests === undefined}
		<p class="text-2xl text-gray-500">Loading...</p>
	{:else}
		{#each requests as request}
			<div class="flex items-center gap-3 {request.status == 'ghost' ? 'opacity-50' : ''}">
				<img src={request.avatar} alt={request.name} class="w-12 h-12 rounded-2xl" />
				<div class="flex-1">
					<p class="text-2xl font-black">{request.name}</p>
					<p class="text-sm">
						@{request.username}
					</p>
				</div>
				<div class="flex items-center">
					<Button variant="destructive">Reject</Button>
					<Button>Accept</Button>
				</div>
			</div>
		{/each}
	{/if}
</div>
