import type { User } from '@eight/shared';
import { writable } from 'svelte/store';

export const user = writable<User | null | undefined>(undefined);

export const offline = writable(false);
