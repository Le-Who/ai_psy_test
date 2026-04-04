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

## 2024-04-04 - [Explicit Label Accessibility]
**Learning:** Depending on wrapping text and inputs isn't always possible (e.g., specific layout constraints), and screen readers benefit from an explicit `for` attribute on `<label>` elements linking them to input `id`s. This explicit association also provides a larger clickable area for focusing inputs (such as tiny radio buttons/checkboxes), which dramatically improves the experience for users on mobile or those with motor difficulties.
**Action:** Always include a `for` attribute on `<label>` elements that matches the corresponding `<input>`, `<select>`, or `<textarea>` `id` to ensure proper click-to-focus behavior and semantic screen reader linkage.
