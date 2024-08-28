/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from '$service-worker';
import { precacheAndRoute } from 'workbox-precaching';

const precache_list = ['./', './profile', './explore', ...build, ...files, ...prerendered].map(
	(s) => ({
		url: s,
		revision: version
	})
);

precacheAndRoute(precache_list);
