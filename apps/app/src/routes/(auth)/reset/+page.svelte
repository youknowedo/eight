<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import { Button, Card, Input, Label } from '@eight/ui/components';

	let email: string | null = null;

	const reset = async (
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) => {
		const formData = new FormData(e.currentTarget);
		email = formData.get('email') as string;

		const { success, error } = await trpc.auth.reset.send.mutate(email);

		if (!success) {
			alert(error);
			return;
		}
	};
</script>

<Card.Root class="max-w-sm mx-auto">
	{#if email}
		<Card.Header>
			<Card.Title class="text-xl">I forgot my password</Card.Title>
			<Card.Description>
				The reset link has been sent to <strong>{email}</strong>.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="mt-4 text-sm text-center">
				Wrong email?
				<button on:click={() => (email = null)} class="underline"> Go back </button>
			</div>
		</Card.Content>
	{:else}
		<Card.Header>
			<Card.Title class="text-xl">I forgot my password</Card.Title>
			<Card.Description>
				No worries! Enter your email below and we'll get you back into your account in no time.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form on:submit={reset}>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input id="email" name="email" type="email" placeholder="m@example.com" required />
					</div>
					<Button type="submit" class="w-full">Send reset link</Button>
				</div>
				<div class="mt-4 text-sm text-center">
					Know your password?
					<button on:click={() => goto('/login')} class="underline"> Login </button>
				</div>
			</form>
		</Card.Content>
	{/if}
</Card.Root>
