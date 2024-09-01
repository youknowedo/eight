<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import { Button } from '@eight/ui/components';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';

	const logout = async () => {
		await trpc.auth.logout.mutate();
		user.set(null);
	};
</script>

<button on:click={() => history.back()} class="flex items-center mb-4 -m-4">
	<ChevronLeft class="w-6 h-6 m-4" />

	<h1 class="text-3xl font-black">Profile</h1>
</button>

<div class="flex flex-col items-center gap-4">
	<img
		src={$user?.pfp}
		alt={$user?.full_name}
		class="object-cover w-24 h-24 mx-auto rounded-full bg-background"
	/>

	<div class="flex flex-col items-center">
		<h3 class="text-xl">{$user?.full_name}</h3>
		<p class="opacity-50">@{$user?.username}</p>
	</div>
</div>

<div class="flex flex-col gap-4 mt-8">
	<Button on:click={() => goto('/settings')} variant="ghost">Settings</Button>
	<Button on:click={logout}>Log out</Button>
</div>
