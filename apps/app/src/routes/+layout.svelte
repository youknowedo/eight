<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { offline, user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import { AlertDialog, Button, Card, Input, Label, Toaster } from '@eight/ui/components';
	import '@eight/ui/styles.css';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	onMount(async () => {
		offline.set(false);

		const { user: u } = await trpc.user.getSingle
			.query()
			.catch(
				() => (offline.set(true), { user: JSON.parse(localStorage.getItem('user') ?? 'null') })
			);
		user.set(u ?? null);

		if (u) localStorage.setItem('user', JSON.stringify(u));
	});

	const verify = async (e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const { success, error } = await trpc.auth.codes.verify.mutate(formData.get('code') as string);

		if (!success) {
			toast.error(error ?? '');
			return;
		}

		const { user: u } = await trpc.user.getSingle.query();
		user.set(u);

		toast.success('Email verified!');
		invalidateAll();
	};

	const resend = async () => {
		const { success, error } = await trpc.auth.codes.resend.mutate();

		if (!success) {
			toast.error(error ?? '');
			return;
		}

		toast.success('Email sent!');
		console.log('Email sent!');
	};
</script>

<Toaster />

{#if $user !== undefined}
	{#if $user !== null && !$user?.email_verified}
		<div class="flex flex-col justify-center h-screen">
			<Card.Root class="max-w-sm mx-auto">
				<Card.Header>
					<Card.Title class="text-2xl">Verify email</Card.Title>
					<Card.Description>
						Your email hasn't been verified yet. Check your email and input the code here to start!
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<form on:submit={verify}>
						<div class="grid gap-4">
							<div class="grid gap-2">
								<Label for="code">Code</Label>
								<Input id="code" name="code" type="number" placeholder="12345678" required />
							</div>

							<div class="flex justify-end gap-2">
								<Button on:click={resend} variant="secondary" class="w-full">Resend email</Button>
								<Button type="submit" class="w-full">Verify</Button>
							</div>
						</div>
					</form>
				</Card.Content>
			</Card.Root>
		</div>
	{:else}
		<slot />
	{/if}
{:else}
	<div class="flex items-center justify-center w-screen h-screen">Loading...</div>
{/if}

{#if $offline}
	<div
		class="absolute inset-x-0 bottom-0 flex items-center justify-center text-center text-white bg-primary"
	>
		offline
	</div>
{/if}
