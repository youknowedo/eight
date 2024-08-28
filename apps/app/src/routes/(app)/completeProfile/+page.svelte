<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { trpc } from '$lib/trpc';
	import { Button, Input, Label, Separator } from '@eight/ui/components';

	let pfp: string | null = null;
	let fullName: string | null = null;

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

<!-- {#if onMobile()} -->
<form on:submit={onSubmit} class="flex flex-col h-screen py-12 m-auto max-w-80">
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
<!-- {:else}
	<p>
		Profile picture upload only available on mobile. Please login on your phone and continue from
		there.
	</p>
{/if} -->
