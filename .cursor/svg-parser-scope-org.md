# SVG Compatibility Spec — WordPress Block Icons

## Purpose

Define the **practical SVG constraints** for WordPress block icons viewed on `.org`. For block icons that are rendered via React, we'll use SVGR to convert the SVGs for preview, JSX, and TypeScript expots.

This is not an official spec.

This is a **real-world compatibility guideline** based on how WordPress.org and the block editor behave with SVGs.

---

## Core Principle

WordPress block icons work best when SVGs are:

- simple
- flat
- predictable
- attribute-driven (not style-driven)

The goal is not perfection.

The goal is:
> “Make this SVG render reliably in block.json and WordPress.org contexts.”

---

## Supported (Safe) SVG Features

### Structure
- `<svg>`
- `<path>`
- `<g>`

### Attributes
- `viewBox`
- `d`
- `fill`
- `stroke`
- `stroke-width`

### Colors
- solid colors only
- `currentColor` preferred
- hex values (e.g. `#000`, `#333`)

---

## Risky / Problematic Features

### Styling
- `style` attributes
- embedded CSS
- class-based styling

### Advanced SVG features
- `<defs>`
- `<clipPath>`
- `<mask>`
- `<filter>`
- `<pattern>`
- `<linearGradient>` / `<radialGradient>`

### Structural complexity
- deeply nested `<g>` elements
- transforms on groups
- excessive path complexity

### External / unsafe content
- `<script>`
- external references
- embedded images

---

## Disallowed (Should Be Removed)

- `<script>`
- `<style>`
- XML declarations (`<?xml ... ?>`)
- `<!DOCTYPE>`
- event handler attributes (`onclick`, etc.)
- unknown / unsafe attributes

---

## Normalization Rules

### ViewBox
- REQUIRED for reliable rendering
- If missing: attempt to infer, otherwise warn

### Width / Height
- Remove or ignore for preview
- Use `viewBox` for scaling

### Fill Handling
Preferred:
`fill="currentColor"`

If multiple fills exist:
- warn
- normalize

### Stroke Handling
- allowed but discouraged
- warn if inconsistent or stroke-only

### Groups (`<g>`)
- flatten where possible
- preserve only if necessary

---

## Complexity Heuristics

Flag SVG as “complex” if:

- more than ~10 `<path>` elements
- nested groups > 2 levels deep
- large file size
- excessive decimal precision

---

## Compatibility Levels

### ✅ Safe
- simple shapes
- single color
- clean structure

### ⚠️ Risky
- multiple fills
- moderate complexity
- nested groups
- non `path` markup.

### ❌ Likely to Fail
- gradients
- masks
- defs-heavy SVGs
- style-driven SVGs
- complex shapes

---

## Preview Modes

### Block Editor Preview
- simulates inline SVG rendering
- uses `currentColor`
- mimics block icon sizing

### WordPress.org-Safe Preview
- applies sanitization
- removes unsupported features
- approximates rendering

---

## Output Constraints

### block.json SVG
- inline SVG string
- minimal attributes
- no styles
- no scripts
- simplified structure

---

## Developer Notes

- Favor predictability over fidelity
- Do not attempt full SVG parsing perfection
- Keep transformations explainable
- Prefer warnings over silent mutation

---

## UX Guidance

Example warning:

> ⚠️ Multiple fill colors detected. WordPress icons usually work best with a single color.

---

## Key Philosophy

This tool is not an SVG editor.

It is:

> A compatibility checker and normalizer for WordPress block icons.
