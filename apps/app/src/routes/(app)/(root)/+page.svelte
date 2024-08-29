<script lang="ts">
	type Status = 'hanging' | 'down' | 'ghost';
	type Friend = {
		name: string;
		avatar: string;
		status: Status;
	};

	const friends: Friend[] = [
		{
			name: 'John Doe',
			avatar: 'https://thispersondoesnotexist.com/',
			status: 'hanging'
		},
		{
			name: 'John Doe',
			avatar: 'https://thispersondoesnotexist.com/',
			status: 'hanging'
		},
		{
			name: 'John Doe',
			avatar: 'https://thispersondoesnotexist.com/',
			status: 'hanging'
		},
		{
			name: 'John Doe',
			avatar: 'https://thispersondoesnotexist.com/',
			status: 'down'
		},
		{
			name: 'John Doe',
			avatar: 'https://thispersondoesnotexist.com/',
			status: 'ghost'
		},
		{
			name: 'John Doe',
			avatar: 'https://thispersondoesnotexist.com/',
			status: 'ghost'
		}
	] as const;
</script>

<div class="flex flex-col gap-8">
	<h1 class="text-5xl font-black">Good morning!</h1>

	<div class="flex flex-col gap-5">
		{#each friends as friend}
			<div class="flex items-center gap-3">
				<img src={friend.avatar} alt={friend.name} class="w-12 h-12 rounded-2xl" />
				<div>
					<p class="text-2xl font-black">{friend.name}</p>
					<p
						class="text-sm flex items-center gap-1.5 {friend.status === 'hanging'
							? 'text-green-500'
							: friend.status === 'down'
								? 'text-yellow-500'
								: 'text-gray-500'}"
					>
						<span
							class="w-2 h-2 rounded-sm block {friend.status === 'hanging'
								? 'bg-green-500'
								: friend.status === 'down'
									? 'bg-yellow-500'
									: 'bg-gray-500'}"
						/>

						{friend.status}
						{#if friend.status === 'hanging'}
							<span class="text-gray-500">2 km</span>
						{/if}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>
