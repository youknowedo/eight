import type { User } from '@eight/shared';
import { writable } from 'svelte/store';

export const user = writable<User | null | undefined>(undefined);

export const offline = writable(false);

type Location = {
	latitude: number;
	longitude: number;
};

export const location = writable<Location | null | undefined>(undefined);
export const friendLocations = writable<{ [userId: string]: Location }>({});

export const sessionStarted = writable(false);
