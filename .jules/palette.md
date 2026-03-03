## 2024-05-22 - Likert Scale Accessibility
**Learning:** Custom interactive widgets (like Likert scales) built with `div`s completely exclude keyboard users. Converting them to `<button>` elements requires minimal CSS resets (`appearance: none`, `font: inherit`) but instantly provides tab navigation and enter/space support without custom key handlers.
**Action:** Always prefer native `<button>` elements for selection grids over `div`s with onclick handlers.

## 2024-05-15 - [Form Input Accessibility]
**Learning:** Explicit label-to-input associations using `for` and `id` are critical for click-to-focus behavior and screen-reader accessibility in this app. Form labels without `for` attributes fail to focus their corresponding inputs when clicked.
**Action:** Always ensure every form `<label>` has a `for` attribute matching the exact `id` of its corresponding input, select, or textarea element.
