<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { trpc } from '$lib/trpc';
	import { Button, Card, Input, Label } from '@eight/ui/components';

	const verificationToken = $page.url.searchParams.get('token');

	const reset = async (
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) => {
		if (!verificationToken) {
			alert('No token');
			return;
		}

		const formData = new FormData(e.currentTarget);
		const password = formData.get('password') as string;

		const { success, error } = await trpc.auth.reset.withToken.mutate({
			verificationToken,
			password
		});

		if (!success) {
			alert(error);
			return;
		}

		goto('/login');
	};
</script>

<Card.Root class="max-w-sm mx-auto">
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
					<Label for="password">Password</Label>
					<Input id="password" name="password" type="password" placeholder="" required />
				</div>
				<Button type="submit" class="w-full">Reset password</Button>
			</div>
			<div class="mt-4 text-sm text-center">
				Know your password?
				<button on:click={() => goto('/login')} class="underline"> Login </button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
