## 2024-05-22 - Likert Scale Accessibility
**Learning:** Custom interactive widgets (like Likert scales) built with `div`s completely exclude keyboard users. Converting them to `<button>` elements requires minimal CSS resets (`appearance: none`, `font: inherit`) but instantly provides tab navigation and enter/space support without custom key handlers.
**Action:** Always prefer native `<button>` elements for selection grids over `div`s with onclick handlers.

## 2024-05-23 - Keyboard Shortcuts for Frequent Actions
**Learning:** While semantic buttons enable tab navigation, repetitive tasks (like answering 50 Likert questions) are significantly faster with dedicated keyboard shortcuts (1-5).
**Action:** Add number key listeners for list/grid selections and provide a subtle visual hint to power users.
