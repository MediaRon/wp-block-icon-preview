# WP Block Icon Preview — Styling and Component Spec

## Purpose

Define the frontend and editor UI architecture for **WP Block Icon Preview**.

This spec is intended for Cursor/Copilot when scaffolding the React app inside a single-block WordPress plugin.

The goal is to keep the UI:

- lightweight
- maintainable
- frontend-safe
- editor-safe
- independent from `@wordpress/components`

---

## Core Decision

Do **not** use WordPress UI components for the app interface.

Use:

- custom React components
- SCSS for styling
- CSS custom properties for design tokens
- optional headless primitives only when accessibility is annoying to build by hand

This tool should be able to render consistently:

- inside the block editor
- on the frontend

without depending on WordPress component styles.

---

## Styling Philosophy

The UI should feel like a clean developer utility.

### Priorities
- strong visual hierarchy
- minimal chrome
- clear status feedback
- readable code input/output
- zero global style leakage

### Avoid
- overdesigned cards
- heavy gradients
- WordPress admin component lookalikes
- frontend dependency on wp-admin styles
- utility-class soup unless absolutely necessary

---

## Styling Stack

### Required
- SCSS
- CSS custom properties
- BEM-style or component-scoped class naming

### Optional
- `clsx` for conditional class names
- Radix Primitives only for very small accessibility-heavy cases like:
  - tabs
  - tooltip
  - dialog

### Not recommended
- `@wordpress/components`
- Tailwind for this project
- large UI kits
- CSS-in-JS unless there is a very strong reason

---

## Root Scope

All styles should be scoped under one app root class:

```css
.wbip-app { ... }
```

This is required to avoid style leakage in both:

- block editor (note: styles not needed in the block editor)
- frontend render

Every component class should be nested or prefixed under this root.

---

## Design Tokens

Create a shared token file for colors, spacing, borders, and typography.

### Suggested tokens
- background colors
- surface colors
- border colors
- text colors
- success / warning / danger colors
- spacing scale
- border radius
- font sizes
- line heights
- shadows

### Example naming
```scss
:root {
	--wbip-color-bg: #f6f7f7;
	--wbip-color-surface: #ffffff;
	--wbip-color-border: #dcdcde;
	--wbip-color-text: #1e1e1e;
	--wbip-color-muted: #50575e;
	--wbip-color-success: #0a7f3f;
	--wbip-color-warning: #b26200;
	--wbip-color-danger: #b32d2e;
	--wbip-color-accent: #3858e9;

	--wbip-radius-sm: 4px;
	--wbip-radius-md: 6px;

	--wbip-space-1: 4px;
	--wbip-space-2: 8px;
	--wbip-space-3: 12px;
	--wbip-space-4: 16px;
	--wbip-space-5: 24px;
	--wbip-space-6: 32px;
}
```

---

## File Structure

Suggested UI structure:

```text
src/
├── components/
│   ├── App/
│   │   ├── App.js
│   │   └── App.scss
│   ├── Layout/
│   │   ├── AppLayout.js
│   │   └── AppLayout.scss
│   ├── InputPanel/
│   │   ├── InputPanel.js
│   │   └── InputPanel.scss
│   ├── CodeTextarea/
│   │   ├── CodeTextarea.js
│   │   └── CodeTextarea.scss
│   ├── StatusBadge/
│   │   ├── StatusBadge.js
│   │   └── StatusBadge.scss
│   ├── PreviewStack/
│   │   ├── PreviewStack.js
│   │   └── PreviewStack.scss
│   ├── PreviewCard/
│   │   ├── PreviewCard.js
│   │   └── PreviewCard.scss
│   ├── DiagnosticsPanel/
│   │   ├── DiagnosticsPanel.js
│   │   └── DiagnosticsPanel.scss
│   ├── IssueList/
│   │   ├── IssueList.js
│   │   └── IssueList.scss
│   ├── OutputPanel/
│   │   ├── OutputPanel.js
│   │   └── OutputPanel.scss
│   ├── OutputTabs/
│   │   ├── OutputTabs.js
│   │   └── OutputTabs.scss
│   ├── CopyButton/
│   │   ├── CopyButton.js
│   │   └── CopyButton.scss
│   ├── Button/
│   │   ├── Button.js
│   │   └── Button.scss
│   ├── Card/
│   │   ├── Card.js
│   │   └── Card.scss
│   └── SectionHeading/
│       ├── SectionHeading.js
│       └── SectionHeading.scss
├── styles/
│   ├── tokens.scss
│   ├── base.scss
│   ├── utilities.scss
│   └── editor.scss
```

---

## Layout Specification

### Overall layout
Use a two-column layout.

### Left column
Primary workspace:
- section label
- SVG textarea input

### Right column
Support and result panel:
- compatibility status
- block editor preview
- WordPress.org preview
- diagnostics
- output actions

### Layout behavior
- desktop: two-column layout
- tablet/mobile: stack vertically
- keep the right column narrower than the left column

### Recommended ratio
- left: 65–70%
- right: 30–35%

---

## Component Specs

## 1. App
Top-level orchestrator.

### Responsibilities
- manage shared state
- compose layout
- pass sanitized/original SVG data to child components
- pass diagnostics and status to sidebar sections
- does not parse in real-time, there is a sidebar option to process the pasted SVG. This is to prevent debounce issues.

### Styling notes
- root wrapper for all app styles
- vertical spacing between major sections
- responsive container handling

---

## 2. AppLayout
Handles two-column layout.

### Responsibilities
- render input column and sidebar column
- collapse to single column on smaller screens

### Styling notes
- CSS grid preferred
- gap between columns should be generous but not oversized
- sidebar should feel like a utility rail, not a dashboard

---

## 3. InputPanel
Wraps the SVG input area.

### Responsibilities
- section label
- helper text
- textarea container

### Styling notes
- keep this visually prominent
- minimal framing
- do not make it look like a modal or code editor clone

---

## 4. CodeTextarea
Raw SVG input field.

### Responsibilities
- multiline raw SVG input
- placeholder text
- optional validation messaging

### Styling notes
- monospace font
- visible border
- medium radius
- comfortable padding
- min-height large enough for real SVG pasting
- resize vertically only

### Placeholder suggestion
```text
Paste SVG code here...
```

---

## 5. StatusBadge
Compatibility status indicator.

### Responsibilities
- show one of:
  - Safe
  - Risky
  - Likely to break

### Styling notes
- compact but highly visible
- color-coded
- should sit near top of sidebar
- should read like a quick diagnostic verdict, not a marketing badge

### Variants
- success
- warning
- danger

---

## 6. PreviewStack
Wrapper for preview cards.

### Responsibilities
- stack preview cards vertically
- maintain consistent spacing

### Styling notes
- modest gap
- align card widths
- previews should feel contained and comparable

---

## 7. PreviewCard
Shared preview container.

### Responsibilities
- render preview title
- render small contextual sample
- render icon within the target environment

### Two required instances
- Toolbar Preview
- WordPress.org Preview

### Styling notes
- subtle bordered card
- neutral background
- inner content framed separately
- preview icon should be shown at realistic icon size

### Important
Do not render giant artwork previews.
The preview should simulate icon usage (max 24px on .org and block editor), not display full illustration detail.

---

## 8. DiagnosticsPanel
Displays compatibility issues.

### Responsibilities
- group warnings and errors
- show short, human-readable explanations

### Styling notes
- compact list format
- allow this section to collapse if needed
- warnings should not dominate the UI, but should be easy to scan

---

## 9. IssueList
Renders issue items.

### Responsibilities
- output issue rows
- allow severity icon or tone

### Styling notes
- simple vertical list
- severity markers should be subtle but obvious
- text should remain developer-friendly and concise

### Example issues
- Multiple fill colors detected
- Missing `viewBox`
- Nested `<g>` elements
- Unsupported `<defs>` found

---

## 10. OutputPanel
Holds actions and export utilities.

### Responsibilities
- render buttons for JSX / TSX export
- render `block.json` copy area
- render copy action

### Styling notes
- keep buttons grouped logically
- do not make output actions louder than the status and preview sections

---

## 11. OutputTabs
Optional component.

### Responsibilities
- switch between output formats if you decide not to show separate buttons and boxes

### Use only if
- output area becomes crowded
- you want a cleaner export experience

### Styling notes
- very lightweight tabs
- no complex tab framework needed unless accessibility becomes annoying

---

## 12. CopyButton
Small action button.

### Responsibilities
- copy current value to clipboard
- reflect success state briefly

### Styling notes
- use size variants if needed
- short-lived “Copied” feedback is enough
- avoid toast spam for a simple copy interaction

---

## 13. Button
Shared button component.

### Variants
- primary
- secondary
- subtle

### Styling notes
- simple rectangular or softly rounded buttons
- clear focus styles
- no flashy effects

---

## 14. Card
Shared layout primitive.

### Responsibilities
- consistent surface wrapper
- reused for previews, outputs, and diagnostics if needed

### Styling notes
- one border system
- one background system
- one spacing system

---

## 15. SectionHeading
Small heading component.

### Responsibilities
- consistent section titles
- optional small helper text

### Styling notes
- semantically appropriate heading tags
- restrained typography
- slightly stronger than body text, not oversized

---

## Visual Hierarchy

The UI should read in this order:

1. paste SVG
2. see compatibility status
3. compare previews
4. review issues
5. copy output

If the export buttons visually dominate the status and previews, the hierarchy is wrong.

---

## Preview Styling Guidance

### Toolbar Preview
Simulate how the icon feels in a block-toolbar-like environment.

### WordPress.org Preview
Simulate how the icon might appear in a simplified `.org` listing context.

### Shared rules
- show icon at realistic size
- use constrained preview frame
- avoid large decorative display
- keep labels clear and explicit

---

## Responsive Behavior

### Desktop
- two-column layout
- textarea left, utility rail right

### Tablet
- reduce gaps
- keep previews readable
- allow stacked or semi-stacked layout

### Mobile
- stack all sections vertically
- input first
- status second
- previews next
- actions last

---

## Accessibility Requirements

Even though this is a small tool, do not skip basics.

### Required
- visible focus styles
- label the textarea properly
- buttons should have accessible names
- status should not rely on color alone
- issue list should be readable by screen readers

### Optional
- aria-live feedback for copy action
- collapsible diagnostics section with proper button semantics

---

## Editor vs Frontend Styling

The Editor doesn't need to load any front-end styling.

### Shared styles
Most component styles will be rendered on the frontend.

### Editor-only additions
- skip editor styles where possible
- keep placheolder content

### Frontend-only additions
- Where possible.

---

## SCSS Rules

### Naming
Use component-based class names such as:

```scss
.wbip-app {}
.wbip-layout {}
.wbip-input-panel {}
.wbip-code-textarea {}
.wbip-status-badge {}
.wbip-preview-card {}
.wbip-diagnostics-panel {}
.wbip-output-panel {}
```

### Avoid
- deep selector nesting
- tag-based overrides
- `!important`
- styling generic classes like `.button` globally

---

## Suggested Base Styles

Create a shared base file with:

- `box-sizing: border-box`
- base font family
- line-height defaults
- button and textarea resets scoped to `.wbip-app`

Do not create global resets for the whole site.

---

## Suggested Tone of the UI

This should feel like:

- technical but approachable
- modern but not trendy
- clean but not sterile
- helpful, not flashy

Think:
- developer utility
- not SaaS dashboard
- not WordPress admin clone
- not design system showcase

---

## Nice-to-Have Enhancements

These are optional and should not block MVP:

- collapsible diagnostics
- icon size toggle
- dark mode awareness through CSS variables
- small inline help tooltips
- output format tabs

---

## Non-Goals

Do not overbuild the UI with:

- full design systems
- complex theme engines
- drag-and-drop layout tools
- CSS-in-JS experiments
- animation-heavy interactions
- frontend dependence on WordPress admin CSS

---

## Implementation Guidance for Cursor

When generating the UI layer:

1. Build custom React components for the core interface.
2. Use SCSS modules or component-scoped SCSS files.
3. Scope all styles under `.wbip-app`.
4. Do not use `@wordpress/components` for visible UI controls.
5. Use a two-column responsive layout.
6. Keep the input area visually primary.
7. Put compatibility status at the top of the sidebar.
8. Keep previews small and realistic to icon usage.
9. Make diagnostics compact and useful.
10. Keep export actions straightforward and visually secondary to evaluation.

---

## First Styling Milestone

The first UI milestone should be:

- clean two-column layout
- large SVG textarea on the left
- status badge on the right
- two preview cards in the sidebar
- diagnostics list below previews
- export actions below diagnostics
- frontend and editor styles look nearly identical

That is enough for v1.
