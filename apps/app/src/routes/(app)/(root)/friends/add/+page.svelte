<script lang="ts">
	import { goto } from '$app/navigation';
	import { trpc } from '$lib/trpc';
	import { Input } from '@eight/ui/components';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import Search from 'lucide-svelte/icons/search';
	import { toast } from 'svelte-sonner';

	const request = async (e: Event) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const username = formData.get('username') as string;

		const { success, error } = await trpc.friends.request.mutate(username);

		if (success) toast.success('Friend request sent!');
		else toast.error(error ?? 'An error occurred');
	};
</script>

<button on:click={() => goto('/')} class="flex items-center mb-4 -ml-4">
	<ChevronLeft class="w-6 h-6 m-4" />

	<h1 class="text-3xl font-black">Add friend</h1>
</button>

<form class="flex gap-2" on:submit={request}>
	<Input id="username" name="username" placeholder="Enter username" />

	<button type="submit" class="h-10 rounded-md bg-primary">
		<Search class="w-4 h-4 m-3" />
	</button>
</form>
