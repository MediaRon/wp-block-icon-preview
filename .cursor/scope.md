# WP Block Icon Preview Repository Brief

## Goal

Build a **single-block WordPress plugin** called **WP Block Icon Preview**.

This plugin should provide a **static block** that renders an interactive SVG utility for WordPress block developers. The tool helps users paste raw SVG code, preview it in two WordPress-oriented contexts, sanitize it, and copy multiple output formats.

This is an MVP. Keep it focused, practical, and fast to iterate on.

---

## Product Positioning

This is a **developer utility**, not a design toy and not a novelty app.

It should feel:

- WordPress-aware
- block developer friendly
- practical
- lightweight
- clear about limitations

Do **not** promise exact WordPress.org rendering.

Use language like:

- WordPress.org-safe preview
- sanitized preview
- compatibility-oriented preview
- approximate rendering

---

## Technical Direction

### Plugin architecture
- WordPress plugin
- single block
- static block
- block metadata in `block.json`
- JavaScript-driven UI
- no shortcode
- no dynamic block rendering
- no `ServerSideRender`

### Build tooling
Use modern WordPress block tooling:

- `@wordpress/scripts`
- block metadata via `block.json`
- build output into `build/`
- `npm run start` for development
- `npm run build` for production

### Metadata collection
Even though this plugin only has one block, use the **modern metadata collection / manifest workflow** as a default engineering habit.

Include:

- `wp-scripts build-blocks-manifest`
- generated `blocks-manifest.php`
- registration via metadata collection when available
- fallback registration for compatibility

### Registration strategy
Use this order of preference in PHP:

1. If available, register blocks through the metadata collection / manifest approach
2. Otherwise, fall back to `register_block_type()` using the block folder path

This keeps the plugin modern while preserving a simple compatibility path.

---

## Compatibility Expectations

Target modern WordPress first, but do not make the plugin reckless.

Use PSR-4 structure with a composer auto-loader, but follow WordPress development standards where it makes sense.

### Recommended assumptions
- modern block themes and classic themes should both work
- the block should register cleanly in current WordPress
- frontend should work without requiring editor context

---

## Suggested File Structure

```text
wp-block-icon-preview/
├── wp-block-icon-preview.php
├── readme.txt
├── package.json
├── package-lock.json
├── .editorconfig
├── .gitignore
├── phpcs.xml.dist
├── phpstan.dist.neon
├── src/
│   └── block/
│       ├── block.json
│       ├── index.js
│       ├── edit.js
│       ├── save.js
│       ├── style.scss
│       ├── editor.scss
│       ├── icon.js
│       └── components/
├── src/utilities/
│   ├── parse-svg.js
│   ├── sanitize-svg.js
│   ├── diagnostics.js
│   ├── to-jsx.js
│   ├── to-tsx.js
│   └── to-block-json-string.js
└── build/
    ├── blocks-manifest.php
    └── block/
```

---

## Block Requirements

Create one block only. Rennder placeholders where appropriate.

### Block details
- namespace: `dlxplugins` or project-specific namespace if preferred
- slug: `block-icon-preview`
- title: `WP Block Icon Preview`
- category: `widgets` or `design`
- icon: use a simple Dashicon or inline icon definition for now
- description: practical utility for previewing and sanitizing SVG block icons
- supports:
  - avoid unnecessary features
  - disable alignment options unless needed
  - disable reusable complexity unless there is a reason to keep defaults
- example:
  - optional, minimal

### Rendering model
- block is static
- saved markup should be a lightweight wrapper
- main interactivity should run in JS
- do not rely on PHP render callbacks for the block output

## Task is complete when:

1. Build tools and plugin scaffold are complete for the plugin.
2. Composer is configured, auto-loading is setup.
2. A functional block with placeholders for the editor and frontend is created.
3. A view.js that runs on the frontend with a console.log.
4. A render.js file that feeds into save.js, so that we output a React placeholder div.
5. Bonus, a functional React hello world when viewing the block on the frontend.