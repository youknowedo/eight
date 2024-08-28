<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { base } from '$app/paths';
	import { user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import { Button, Separator } from '@eight/ui/components';

	const logout = async () => {
		await trpc.auth.logout.mutate();
		user.set(null);
	};
</script>

<div class="flex flex-col items-center gap-4">
	<img
		src={$user?.pfp}
		alt="Profile"
		class="object-cover w-32 h-32 mx-auto rounded-full bg-background"
	/>

	<h3 class="text-xl">{$user?.full_name}</h3>
</div>

<Separator class="box-content w-64 h-0.5 mx-auto my-12 rounded-full bg-background" />

<Button on:click={logout}>Log out</Button>
