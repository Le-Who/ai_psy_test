## 2026-02-01 - [Form Validation & Feedback]
**Learning:** Standard HTML5 `required` attribute allows whitespace, which can lead to empty submissions. Replacing intrusive `alert()` calls with Toasts and focus management creates a much smoother flow.
**Action:** Always combine `required` attributes with explicit JS validation (`.trim()`) for text inputs, and use visual indicators (asterisks) to make expectations clear upfront.

## 2024-05-21 - [Accessible Glassmorphism Menus]
**Learning:** For glassmorphism menus implemented with `div`s, replacing them with semantic `<button`> tags plus a CSS reset (`background: transparent; border: none; text-align: left`) is the most robust way to add accessibility without breaking the visual design.
**Action:** Use the `.theme-opt` CSS reset pattern for any new interactive list items in the design system.

## 2025-05-23 - [Input Group Styling]
**Learning:** Global styles on inputs (like `margin-top`) can break layout when wrapping inputs for icons.
**Action:** Move spacing properties to the wrapper container (`.input-group`) and reset them on the child input.

## 2025-05-23 - [Dynamic Button States]
**Learning:** When a button's visual text changes to convey a new state (like "Delete" -> "Confirm?"), the `aria-label` MUST update simultaneously. Screen reader users miss the context switch if the label remains static.
**Action:** Use `dataset` to store the original label, update `aria-label` during the confirmation state, and restore it on timeout or cancellation.
## 2024-03-22 - Add ARIA label relationships to inputs

**Learning:** It's important that form labels are explicitly associated with their input fields using the `for` attribute (matching the input `id`). Not only does this improve screen-reader accessibility by correctly announcing input names, but it also increases the click target size. Users can click the label text to focus the associated input field, improving usability especially on mobile.

**Action:** Always ensure any `<label>` tag has a `for` attribute and points to the `id` of an existing `<input>`, `<select>`, or `<textarea>` in the DOM. Avoid implicit labeling (wrapping input inside label) unless it's necessary, as explicit `for` bindings are generally better supported by screen readers in complex forms.
