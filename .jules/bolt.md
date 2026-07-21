## 2024-05-22 - [Synchronous LocalStorage & String Concatenation]
**Learning:** This app uses `localStorage` for potentially large datasets and generates UI via massive string concatenation in `storage.js`.
**Action:** Always look for caching opportunities in `Storage` methods (like `renderLibraryHTML`) to avoid repeated expensive serialization/deserialization and string operations on the main thread.

## 2024-05-23 - [Render Cache Optimization]
**Learning:** Caching the final joined HTML string in `Storage` reduces render time from O(N) to O(1).
**Action:** When managing list rendering with incremental updates (`unshift`/`push`), update the cached HTML string incrementally instead of rebuilding it entirely.
## 2024-10-24 - [Inefficient String Escaping in Hot Paths]
**Learning:** The `escapeHtml` utility used multiple chained `.replace()` calls, causing redundant string traversals. This utility is heavily used in rendering loops (e.g., `renderLibraryHTML`), making it a hidden CPU sink.
**Action:** Use a single regex replace with a callback for string sanitization functions to ensure O(n) complexity instead of O(n * k) passes.
## 2026-02-06 - [Inefficient Naming Collision Check]
**Learning:** `Storage.save` used a `while` loop with `array.some` to check for unique names, resulting in O(N*K) complexity which spiked to ~760ms for 1000 items.
**Action:** Use a `Set` for O(1) existence checks when validating uniqueness against a large list of items.
## 2026-03-01 - [DOM Query Optimization]
**Learning:** Frequent `document.getElementById` and `querySelectorAll` calls inside rendering loops (`renderQ`) add measurable overhead, especially for static elements like views and button containers.
**Action:** Cache DOM elements in an `app.ui` object during initialization (`initUI`) and reuse these references in render methods to ensure O(1) access.

## 2024-05-25 - [Persistent Set Cache for Collision Checks]
**Learning:** Even with O(1) lookups via `Set`, rebuilding the `Set` from a large array on every `save()` operation remains O(N) and blocks the main thread during bulk operations or frequent saves.
**Action:** Maintain a persistent `_themesCache` (Set) in the `Storage` class and update it incrementally (add/delete) to keep `save()` complexity closer to O(1).

## 2026-03-01 - [Inefficient Regex Backtracking and Switch Execution]
**Learning:** `safeParseJSON` used a greedy regex `match(/\{[\s\S]*\}$/)` which is extremely slow on large text blobs when the structure fails to match immediately, and `escapeHtml` used a switch statement inside its `.replace()` callback which limits JS engine optimizations compared to an object map.
**Action:** Always prefer `indexOf`/`lastIndexOf` or constrained matching when extracting large blocks like JSON from markdown, and use static object mapping (`const MAP = { ... }; match => MAP[match];`) instead of `switch` for basic character replacements in hot loops.

## 2024-11-20 - [Optimizing Sanitization in Hot Paths]
**Learning:** `Utils.escapeHtml` is extensively used in rendering loops (like `renderLibraryHTML`). While mapping objects reduces operations, calling `.replace` unnecessarily on clean strings still carries measurable overhead (over 2x slower for safe strings).
**Action:** Implement early-return fast-paths using non-global regex checks (e.g., `!/[&<>"]/.test(str)`) to bypass replacements in hot paths for safe inputs, dramatically improving overall render times since most text doesn't contain HTML entities.
