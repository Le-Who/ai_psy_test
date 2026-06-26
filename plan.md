1. **Accessibility update for mode tabs**: Currently, the mode tabs (`tabPsy`, `tabQuiz`) in `index.html` act as a segmented control but lack appropriate ARIA roles and state attributes (`role="tablist"`, `role="tab"`, `aria-selected`). This makes them less accessible to screen readers, which won't announce their state correctly.
2. **Update index.html**:
   - Add `role="tablist"` and `aria-label="Режим генерации"` to `<div class="mode-tabs">`.
   - Add `role="tab"`, `aria-selected="true"`, and `aria-controls="setupView"` (or similar conceptual target) to `tabPsy`.
   - Add `role="tab"`, `aria-selected="false"`, and `aria-controls="setupView"` to `tabQuiz`.
3. **Update src/app.js**:
   - Update `app.setMode()` and the state proxy listener to toggle `aria-selected` alongside the `active` class for these tabs.
4. **Pre-commit**: Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
5. **Submit**: Submit the PR with the required details.
