const CACHE_NAME = "ai-psy-test-v3";
const ASSETS_TO_CACHE = [
	"./",
	"./index.html",
	"./style.css",
	"./src/app.js",
	"./src/api.js",
	"./src/app-settings.js",
	"./src/scoring.js",
	"./src/storage.js",
	"./src/store.js",
	"./src/utils.js",
	"./src/validator.js",
	"./src/lib/lz-string.js",
	"./src/lib/confetti.js",
	"./manifest.json",
	"./icon.svg",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(ASSETS_TO_CACHE);
		}),
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((cacheName) => cacheName !== CACHE_NAME)
					.map((cacheName) => caches.delete(cacheName)),
			);
		}),
	);
	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	// Only intercept GET requests
	if (event.request.method !== "GET") return;

	// Skip cross-origin requests, like API calls to OpenAI/Gemini
	if (!event.request.url.startsWith(self.location.origin)) return;

	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			if (cachedResponse) {
				return cachedResponse;
			}
			return fetch(event.request).then((response) => {
				// Cache new assets dynamically if needed (optional, keeping it simple here)
				return response;
			});
		}),
	);
});
