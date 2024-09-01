<script lang="ts">
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';

	import { goto } from '$app/navigation';
	import { user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import { Button, Input, Label, Separator } from '@eight/ui/components';
	import { onMount } from 'svelte';

	let pfp: string | null = null;
	let fullName: string | null = null;

	onMount(() => {
		fullName = $user?.full_name ?? '';
		pfp = $user?.pfp ?? null;
	});

	const onSubmit = async (
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) => {
		e.preventDefault();
		// form-data
		const formData = new FormData(e.currentTarget);

		const { success, error, pfpUploadUrl } = await trpc.user.updateProfile.mutate({
			full_name: formData.get('full_name') as string
		});

		if (!success || !pfpUploadUrl) return console.error(error);

		const pfp = formData.get('picture') as File;
		const res = await fetch(pfpUploadUrl, {
			method: 'PUT',
			body: pfp
		});

		if (!res.ok) console.error(await res.text());
		else goto('/');
	};
</script>

<button on:click={() => history.back()} class="flex items-center mb-4 -m-4">
	<ChevronLeft class="w-6 h-6 m-4" />

	<h1 class="text-3xl font-black">Settings</h1>
</button>

<form on:submit={onSubmit} class="flex flex-col py-12 m-auto max-w-80">
	<div class="flex-1">
		<label for="picture" class=" neu-up">
			{#if pfp}
				<img src={pfp} alt="Profile" class="object-cover w-40 h-40 m-auto rounded-full" />
			{:else}
				<div
					class="flex items-center justify-center w-40 h-40 m-auto text-center rounded-full bg-background"
				>
					Choose a picture
				</div>
			{/if}
		</label>

		<Separator class="box-content w-64 h-0.5 mx-auto my-12 rounded-full bg-background" />

		<Label for="full_name">Full Name</Label>
		<Input
			id="full_name"
			name="full_name"
			placeholder="Max Verstappen"
			required
			bind:value={fullName}
		/>
	</div>

	<input
		on:change={(e) => {
			var file = e.currentTarget.files?.[0];
			if (!file) return;

			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = function () {
				pfp = reader.result?.toString() ?? null;
			};
		}}
		class="hidden"
		id="picture"
		name="picture"
		type="file"
		accept="image/*"
		capture="user"
		required
	/>

	<Button
		disabled={!pfp || fullName == ''}
		class="box-border w-full h-20 text-2xl rounded-3xl neu-r neu-up"
		type="submit"
	>
		Send
	</Button>
</form>
