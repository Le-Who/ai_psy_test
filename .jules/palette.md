## 2025-06-01 - Add explicit label associations in index.html
**Learning:** Found that the primary configuration form lacked explicit `for` attributes on its labels, preventing users from clicking labels to focus inputs and degrading screen reader accessibility. Explicitly linking labels to input IDs improves form usability.
**Action:** Added `for` attributes matching the corresponding input `id`s (`themeInput`, `notesInput`, `audienceInput`, `difficultyInput`, `qCountInput`, and `apiKeyInput`) to all labels in `index.html`.
