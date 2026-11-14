/**
 * Nebula Glass — a deep-space glass skin for the DSH Web client.
 *
 * The Client half does two things, both reversible through `ctx.effect`:
 *
 * 1. Token overlay — `ctx.theme.overrideTokens(source, tokens)` stacks one
 *    token layer over the active theme. It registers no theme and touches no
 *    theme preference: the user's Appearance choice
 *    (Light / Dark / System) keeps working and selecting a built-in scheme
 *    never drops the skin.
 * 2. Backdrop — one fixed, inert wallpaper layer behind the app (an original
 *    generated nebula, embedded as an SVG data URI) plus a small scoped
 *    stylesheet that clears the two host surfaces painting the canvas. Theme
 *    tokens are never made translucent, so masks, sticky headers and the
 *    terminal keep their opaque fill. No network request; reduced-motion
 *    users get a still image.
 *
 * Disabling the bundle disposes both effects and restores the stock look.
 * Every entry is a `{ light, dark }` pair — the theme runtime picks one per
 * active color scheme, so the same skin has a cosmic dark palette and a frost
 * light palette. Token groups:
 * - canvas/surfaces: three stacked glass planes with deliberate separation
 * - borders: periwinkle hairline ramp, cyan selection edge
 * - text: cool-white → periwinkle → slate (dark) and ink → slate (light)
 * - brand/buttons: solid primary action, teal send/info action
 * - interaction: cyan-tinted hover/active washes (the signature glow)
 * - states: mint success, amber warn, rose error, lavender done
 * - code/markdown: code planes, inline code, diff fills, Shiki syntax colors
 * - scrollbars, cards, hovercards (dark in both schemes), toasts, tooltips
 * - specific layer: sidebar, user bubble, major input, menu glass
 */
window.__ModuleLoader__.load({
  id: 'dsh-theme-nebula-glass',
  factory(require) {
    /** One row per token: [name, light value, dark value]. */
    const PALETTE = [
      // ---- Canvas and layered surfaces ----
      ['--dsw-alias-bg-base', '#EEF1FA', '#06090F'],
      ['--dsw-alias-bg-layer-1', '#FFFFFF', '#101830'],
      ['--dsw-alias-bg-layer-2', '#F3F6FE', '#182242'],
      ['--dsw-alias-bg-layer-3', '#EBEFFA', '#222D58'],
      ['--dsw-alias-bg-overlay', '#FFFFFF', '#2C3A6E'],
      ['--dsw-alias-bg-document-preview', '#F0F4FC', '#070A12'],
      ['--dsw-alias-bg-module-platform', '#F4F7FE', '#0D1428'],
      ['--dsw-alias-bg-multi-select', '#EBEFFA', '#222D58'],
      ['--dsw-alias-bg-document-selection', 'rgba(8, 145, 178, 0.28)', 'rgba(34, 211, 238, 0.30)'],
      ['--dsw-alias-bg-skeleton', 'rgba(30, 39, 72, 0.06)', 'rgba(126, 152, 255, 0.08)'],

      // ---- Scrims ----
      ['--dsw-alias-bg-mask-1', 'rgba(15, 23, 42, 0.24)', 'rgba(2, 4, 10, 0.55)'],
      ['--dsw-alias-bg-mask-2', 'rgba(15, 23, 42, 0.12)', 'rgba(2, 4, 10, 0.22)'],
      ['--dsw-alias-bg-mask-3', 'rgba(15, 23, 42, 0.48)', 'rgba(2, 4, 10, 0.50)'],
      ['--dsw-alias-bg-mask-drop', 'rgba(255, 255, 255, 0.72)', 'rgba(8, 12, 26, 0.72)'],

      // ---- Borders ----
      ['--dsw-alias-border-l1', 'rgba(28, 40, 94, 0.08)', 'rgba(126, 152, 255, 0.12)'],
      ['--dsw-alias-border-l2', 'rgba(28, 40, 94, 0.13)', 'rgba(126, 152, 255, 0.18)'],
      ['--dsw-alias-border-l3', 'rgba(28, 40, 94, 0.18)', 'rgba(126, 152, 255, 0.24)'],
      ['--dsw-alias-border-l4', 'rgba(28, 40, 94, 0.24)', 'rgba(126, 152, 255, 0.32)'],
      ['--dsw-alias-border-l2-darkmode-thin', 'rgba(28, 40, 94, 0.08)', 'rgba(126, 152, 255, 0.12)'],
      ['--dsw-alias-border-selected', '#0891B2', '#67E8F9'],

      // ---- Text ----
      ['--dsw-alias-label-primary', '#1B2242', '#E9EEFF'],
      ['--dsw-alias-label-secondary', '#46506F', '#B6C1E4'],
      ['--dsw-alias-label-tertiary', '#5E6A8C', '#8E9AC2'],
      ['--dsw-alias-label-caption', '#616D8C', '#7E8BB8'],
      ['--dsw-alias-label-dimmed', '#C9CFE4', '#414B6D'],
      ['--dsw-alias-label-primary-dimmed', '#2C3456', '#D8E1FB'],
      ['--dsw-alias-label-primary-inverted', '#F7F9FF', '#1A2138'],
      ['--dsw-alias-label-primary-bluish', '#232D5A', '#DCE6FF'],
      ['--dsw-alias-label-primary-foreground', '#FFFFFF', '#05080F'],
      ['--dsw-alias-label-on-color', '#FFFFFF', '#FFFFFF'],
      ['--dsw-alias-label-shimmer', 'rgba(2, 6, 23, 0.30)', 'rgba(255, 255, 255, 0.45)'],
      ['--dsw-alias-label-document-preview', '#46506F', '#B6C1E4'],
      ['--dsw-alias-label-deep-diving', '#0E7490', '#9FEBFF'],
      ['--dsw-alias-label-deep-diving-shimmer', '#0891B2', '#67E8F9'],
      ['--dsw-alias-menu-icon', '#3A4466', '#C9D4F4'],

      // ---- Brand and action fills ----
      ['--dsw-alias-brand-primary', '#1E2748', '#E9EEFF'],
      ['--dsw-alias-brand-primary-invert', '#10162E', '#F4F7FF'],
      ['--dsw-alias-button-contrast-fill', '#1E2748', '#E9EEFF'],
      ['--dsw-alias-brand-primary-new-colorprimary-new-color', '#0891B2', '#22D3EE'],
      ['--dsw-alias-brand-text', '#10162E', '#F3F7FF'],
      ['--dsw-alias-button-primary-fill', '#1E2748', '#E9EEFF'],
      ['--dsw-alias-button-primary-hover', '#2A3560', '#D9E4FF'],
      ['--dsw-alias-button-primary-dimmed', '#E4E9F7', '#2A3355'],
      ['--dsw-alias-button-info-fill', '#0891B2', '#0891B2'],
      ['--dsw-alias-button-info-hover', '#0E7490', '#0E7490'],
      ['--dsw-alias-button-elevated-fill', '#FFFFFF', '#222D58'],
      ['--dsw-alias-button-floating-fill', '#FFFFFF', '#182242'],
      ['--dsw-alias-button-floating-hover', '#F2F5FC', '#222D58'],
      ['--dsw-alias-button-ghost-active-fill', '#E9EEF9', '#2A3766'],
      ['--dsw-alias-button-ghost-active-hover', '#DFE6F7', '#303F74'],
      ['--dsw-alias-button-ghost-active-border', '#7E89AC', '#5B6B9E'],
      ['--dsw-alias-link', '#0E7490', '#67E8F9'],

      // ---- Interaction washes ----
      ['--dsw-alias-interactive-bg-hover', 'rgba(8, 145, 178, 0.06)', 'rgba(103, 232, 249, 0.08)'],
      ['--dsw-alias-interactive-bg-hover-accent', 'rgba(8, 145, 178, 0.12)', 'rgba(103, 232, 249, 0.18)'],
      ['--dsw-alias-interactive-bg-active', 'rgba(8, 145, 178, 0.10)', 'rgba(103, 232, 249, 0.13)'],
      ['--dsw-alias-interactive-bg-hover-solid', '#F2F5FC', '#26325C'],
      ['--dsw-alias-interactive-bg-hover-danger', 'rgba(190, 24, 60, 0.06)', 'rgba(251, 113, 133, 0.14)'],

      // ---- Semantic states ----
      ['--dsw-alias-state-business-primary', '#0E7490', '#22D3EE'],
      ['--dsw-alias-state-business-tertiary', '#E0F2FA', '#0B2A36'],
      ['--dsw-alias-state-idle-primary', '#B9C1D6', '#6B7699'],
      ['--dsw-alias-state-success-primary', '#047857', '#34D399'],
      ['--dsw-alias-state-success-secondary', '#059669', '#6EE7B7'],
      ['--dsw-alias-state-success-tertiary', '#D1FAE5', '#0C2A25'],
      ['--dsw-alias-state-warn-primary', '#92400E', '#FBBF24'],
      ['--dsw-alias-state-warn-label', '#92400E', '#FCD34D'],
      ['--dsw-alias-state-warn-secondary', '#B45309', '#FCD34D'],
      ['--dsw-alias-state-warn-tertiary', '#FEF3C7', '#2C2310'],
      ['--dsw-alias-state-error-primary', '#BE123C', '#F43F5E'],
      ['--dsw-alias-state-error-secondary', '#E11D48', '#FB7185'],
      ['--dsw-alias-state-done-primary', '#6D28D9', '#A78BFA'],

      // ---- Code planes, inline code, diffs ----
      ['--dsw-alias-markdown-code-block', '#F3F6FD', '#101830'],
      ['--dsw-alias-markdown-code-block-banner', '#EAF0FA', '#141E3C'],
      ['--dsw-alias-markdown-code-segment-selected', '#E2E9F8', '#222D58'],
      ['--dsw-alias-markdown-code-segment-unselected', '#F3F6FD', '#101830'],
      ['--dsw-alias-markdown-inline-code', '#EAF0FA', '#151F3E'],
      ['--dsw-alias-markdown-placeholder', '#EEF2FB', '#141E3C'],
      ['--dsw-alias-markdown-tag', '#EAF0FA', '#151F3E'],
      ['--dsw-alias-markdown-citation', '#E2E9F8', '#222D58'],
      ['--dsw-alias-code-diff-added', 'rgba(5, 150, 105, 0.10)', 'rgba(52, 211, 153, 0.13)'],
      ['--dsw-alias-code-diff-deleted', 'rgba(190, 18, 60, 0.10)', 'rgba(251, 113, 133, 0.13)'],
      ['--dsw-alias-file-diff-added-bg', '#E9F7EF', '#0F241F'],
      ['--dsw-alias-file-diff-added-gutter', '#DFF3E7', '#081511'],
      ['--dsw-alias-file-diff-added-marker', '#059669', '#34D399'],
      ['--dsw-alias-file-diff-deleted-bg', '#FDECEC', '#26131B'],
      ['--dsw-alias-file-diff-deleted-gutter', '#F8DEDE', '#150A0F'],
      ['--dsw-alias-file-diff-deleted-marker', '#BE123C', '#FB7185'],

      // ---- Cards, hovercards, toasts, tooltips ----
      ['--dsw-alias-card-fill', '#FFFFFF', '#182242'],
      ['--dsw-alias-card-fill-hover', '#F6F8FF', '#222D58'],
      ['--dsw-alias-card-tile-fill', 'rgba(28, 40, 94, 0.04)', 'rgba(255, 255, 255, 0.04)'],
      ['--dsw-alias-hovercard-bg', '#171F40', '#131B36'],
      ['--dsw-alias-hovercard-label-primary', '#FFFFFF', '#E9EEFF'],
      ['--dsw-alias-hovercard-label-secondary', '#B6C1E4', '#B6C1E4'],
      ['--dsw-alias-hovercard-label-tertiary', '#8E9AC2', '#8E9AC2'],
      ['--dsw-alias-hovercard-state-done', '#A78BFA', '#A78BFA'],
      ['--dsw-alias-hovercard-state-error', '#FB7185', '#FB7185'],
      ['--dsw-alias-toast-bg', '#1A2242', '#1A2242'],
      ['--dsw-alias-toast-label', '#FFFFFF', '#F2F6FF'],
      ['--dsw-alias-toast-action', '#67E8F9', '#67E8F9'],
      ['--dsw-alias-tooltip-bg', '#1C2448', '#1C2448'],
      ['--dsw-alias-tooltip-label', '#FFFFFF', '#F2F6FF'],
      ['--dsw-alias-switch-thumb', '#FFFFFF', '#C4CFF2'],

      // ---- Scrollbars ----
      ['--dsw-alias-scrollbar-bg-l1', '#C9D2E8', '#2A3459'],
      ['--dsw-alias-scrollbar-bg-l2', '#D3DBEE', '#323E68'],
      ['--dsw-alias-scrollbar-hover-l1', '#AEB9D8', '#3A4777'],
      ['--dsw-alias-scrollbar-hover-l2', '#B8C3DF', '#44528A'],

      // ---- Charts, trajectory, illustrations ----
      ['--dsw-alias-chart-messages', '#0891B2', '#22D3EE'],
      ['--dsw-alias-chart-system', '#7E89AC', '#8E9AC2'],
      ['--dsw-alias-chart-tools', '#7C3AED', '#A78BFA'],
      ['--dsw-alias-trajectory-accent', '#0891B2', '#22D3EE'],
      ['--dsw-alias-illustration-background', '#EEF2FB', '#0C1224'],
      ['--dsw-alias-illustration-backing', '#D8DFF2', '#1A2342'],
      ['--dsw-alias-illustration-detail', '#9AA6C8', '#8E9AC2'],
      ['--dsw-alias-illustration-surface', '#E4E9F7', '#222C50'],

      // ---- JSON tree syntax ----
      ['--dsw-alias-json-tree-hover', 'rgba(28, 40, 94, 0.04)', 'rgba(126, 152, 255, 0.06)'],
      ['--dsw-alias-json-tree-icon', '#6D789C', '#8E9AC2'],
      ['--dsw-alias-json-tree-keyword', '#0E7490', '#7DD3FC'],
      ['--dsw-alias-json-tree-number', '#6D28D9', '#A78BFA'],
      ['--dsw-alias-json-tree-property', '#B45309', '#67E8F9'],
      ['--dsw-alias-json-tree-punctuation', '#1B2242', '#E9EEFF'],
      ['--dsw-alias-json-tree-string', '#BE123C', '#6EE7B7'],

      // ---- Syntax highlighting (Shiki CSS variables consumed by CodeBlock) ----
      ['--shiki-token-constant', '#0E7490', '#67E8F9'],
      ['--shiki-token-string', '#047857', '#6EE7B7'],
      ['--shiki-token-comment', '#6B7694', '#7E8BB8'],
      ['--shiki-token-keyword', '#BE123C', '#F0ABFC'],
      ['--shiki-token-parameter', '#B45309', '#FCD34D'],
      ['--shiki-token-function', '#6D28D9', '#C4B5FD'],
      ['--shiki-token-string-expression', '#065F46', '#86EFAC'],
      ['--shiki-token-punctuation', '#5E6A8C', '#8E9AC2'],
      ['--shiki-token-link', '#0E7490', '#67E8F9'],

      // ---- Toolbar fills ----
      ['--dsw-alias-button-tool-bar-fill', 'rgba(241, 244, 252, 0.72)', 'rgba(84, 91, 120, 0.50)'],
      ['--dsw-alias-button-tool-bar-fill-invisible', 'rgba(255, 255, 255, 0.36)', 'rgba(20, 24, 40, 0.36)'],
      ['--dsw-alias-button-tool-bar-hover', 'rgba(232, 237, 249, 0.85)', 'rgba(84, 91, 120, 0.62)'],

      // ---- Specific layer: sidebar, bubble, input, menu glass ----
      ['--dsw-specific-sidebar-fill', '#E5EAF6', '#0C1224'],
      ['--dsw-specific-sidebar-nav-item-active', '#FFFFFF', '#222D58'],
      ['--dsw-specific-sidebar-nav-item-active-accent', 'rgba(8, 145, 178, 0.10)', 'rgba(34, 211, 238, 0.16)'],
      ['--dsw-specific-bubble', '#DFE7F9', '#1A2446'],
      ['--dsw-specific-bubble-highlight', '#D2DEF6', '#24305A'],
      ['--dsw-specific-input-major', '#FFFFFF', '#141E3C'],
      ['--dsw-specific-selector', '#E7EDF9', '#26325C'],
      ['--dsw-specific-tip', '#F1F5FC', '#182244'],
      ['--dsw-specific-menu', 'rgba(255, 255, 255, 0.94)', 'rgba(12, 17, 34, 0.94)'],
      ['--dsw-menu-surface-fill', 'rgba(255, 255, 255, 0.72)', 'rgba(14, 19, 40, 0.66)'],
      ['--dsw-alias-menu-group-header-fill', 'rgba(252, 253, 255, 0.94)', 'rgba(14, 19, 40, 0.94)'],
    ]

    /** The theme runtime consumes one value per active color scheme. */
    const TOKENS = Object.fromEntries(
      PALETTE.map(([name, light, dark]) => [name, { light, dark }]),
    )

    /** Layer identity; one layer per source, replaced on re-registration. */
    const SOURCE = 'dsh-theme-nebula-glass'

    // ---------------------------------------------------------------------
    // Backdrop: an original generated nebula wallpaper behind the app.
    // ---------------------------------------------------------------------

    /**
     * Scoped presentation for the wallpaper: clear the two host surfaces that
     * paint the canvas, so the artwork shows through without touching the
     * palette tokens. Masks, sticky headers, the terminal and the composer
     * fade keep their opaque `--dsw-alias-bg-base` fill and therefore never
     * ghost scrolled content. Selectors use host structure rather than hashed
     * class names: the app frame is the element holding the shell overlay,
     * and the conversation root is the non-editable element carrying its
     * phase attribute. If a future host changes that structure the rules stop
     * matching and the wallpaper is simply not revealed; nothing else breaks.
     */
    const BACKDROP_CSS = [
      // Specificity (0,1,2) beats the host's `.frame { background: ... }` (0,1,0)
      // even when the host stylesheet is injected after this one.
      'html body *:has(> [data-shell-overlay]) { background: transparent; }',
      'html body [data-phase]:not([contenteditable]) { background: transparent; }',
      '@media (forced-colors: active) { [data-nebula-glass-backdrop] { display: none; } }',
      '@media print { [data-nebula-glass-backdrop] { display: none; } }',
    ].join('\n')

    /** Readability veils painted between the artwork and the UI. */
    const VEIL = {
      dark: 'radial-gradient(120% 92% at 50% -8%, rgba(5, 8, 18, 0) 0%, rgba(5, 8, 18, 0.18) 46%, rgba(5, 8, 18, 0.46) 100%), linear-gradient(180deg, rgba(5, 8, 18, 0.04) 0%, rgba(4, 6, 12, 0.30) 100%)',
      light: 'radial-gradient(120% 92% at 50% -8%, rgba(243, 246, 252, 0) 0%, rgba(243, 246, 252, 0.14) 46%, rgba(238, 243, 251, 0.36) 100%), linear-gradient(180deg, rgba(244, 247, 254, 0.04) 0%, rgba(236, 241, 250, 0.24) 100%)',
    }

    /** Generated, license-free artwork (design/generate-wallpaper.mjs). */
    const BACKDROP_DARK = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCAxNjAwIDEwMDAiPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwNTA3MEYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjMyIiBzdG9wLWNvbG9yPSIjMDkxMDI2Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC42MiIgc3RvcC1jb2xvcj0iIzBBMEYyQSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwNDA2MEQiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9ImN5YW4iPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzIyRDNFRSIgc3RvcC1vcGFjaXR5PSIwLjQ0Ii8+PHN0b3Agb2Zmc2V0PSIwLjQ4IiBzdG9wLWNvbG9yPSIjMDg5MUIyIiBzdG9wLW9wYWNpdHk9IjAuMjAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwODkxQjIiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InZpb2xldCI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjQTc4QkZBIiBzdG9wLW9wYWNpdHk9IjAuNDAiLz48c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iIzdDM0FFRCIgc3RvcC1vcGFjaXR5PSIwLjE3Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjN0MzQUVEIiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJtYWdlbnRhIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNGNDcyQjYiIHN0b3Atb3BhY2l0eT0iMC4yNiIvPjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjQkUxODVEIiBzdG9wLW9wYWNpdHk9IjAuMTEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNCRTE4NUQiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9ImJsdWUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzNCODJGNiIgc3RvcC1vcGFjaXR5PSIwLjMwIi8+PHN0b3Agb2Zmc2V0PSIwLjU1IiBzdG9wLWNvbG9yPSIjMUQ0RUQ4IiBzdG9wLW9wYWNpdHk9IjAuMTMiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxRDRFRDgiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InBhbGUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI0E1RjNGQyIgc3RvcC1vcGFjaXR5PSIwLjIyIi8+PHN0b3Agb2Zmc2V0PSIwLjU1IiBzdG9wLWNvbG9yPSIjMjJEM0VFIiBzdG9wLW9wYWNpdHk9IjAuMDgiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyMkQzRUUiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9Imdsb3ciPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI0VBRjhGRiIgc3RvcC1vcGFjaXR5PSIwLjk1Ii8+PHN0b3Agb2Zmc2V0PSIwLjMiIHN0b3AtY29sb3I9IiNBNUYzRkMiIHN0b3Atb3BhY2l0eT0iMC41NSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1RjNGQyIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmFuZCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjAiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNDN0QyRkUiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuNDUiIHN0b3AtY29sb3I9IiNDN0QyRkUiIHN0b3Atb3BhY2l0eT0iMC4wNyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuNiIgc3RvcC1jb2xvcj0iI0E1RjNGQyIgc3RvcC1vcGFjaXR5PSIwLjA2Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0M3RDJGRSIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGZpbHRlciBpZD0ic29mdCIgeD0iLTMwJSIgeT0iLTMwJSIgd2lkdGg9IjE2MCUiIGhlaWdodD0iMTYwJSI+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjM0Ii8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjE2MDAiIGhlaWdodD0iMTAwMCIgZmlsbD0idXJsKCNiZykiLz4KICA8ZyB0cmFuc2Zvcm09InJvdGF0ZSgtMjQgODAwIDUwMCkiIG9wYWNpdHk9IjAuODUiPgogICAgPHJlY3QgeD0iLTI0MCIgeT0iMzUyIiB3aWR0aD0iMjA4MCIgaGVpZ2h0PSIyNTAiIGZpbGw9InVybCgjYmFuZCkiLz4KICA8L2c+CiAgPGVsbGlwc2UgY3g9IjMzMCIgY3k9IjIxMCIgcng9IjY0MCIgcnk9IjUwMCIgZmlsbD0idXJsKCNjeWFuKSIvPgogIDxlbGxpcHNlIGN4PSIxMjYwIiBjeT0iMTQwIiByeD0iNjAwIiByeT0iNDUwIiBmaWxsPSJ1cmwoI3Zpb2xldCkiLz4KICA8ZWxsaXBzZSBjeD0iMTA0MCIgY3k9Ijg4MCIgcng9IjcwMCIgcnk9IjQ3MCIgZmlsbD0idXJsKCNtYWdlbnRhKSIvPgogIDxlbGxpcHNlIGN4PSIxMTAiIGN5PSI4ODAiIHJ4PSI1NjAiIHJ5PSI0MjAiIGZpbGw9InVybCgjYmx1ZSkiLz4KICA8ZWxsaXBzZSBjeD0iODIwIiBjeT0iNTAwIiByeD0iNzgwIiByeT0iNTIwIiBmaWxsPSJ1cmwoI2JsdWUpIiBvcGFjaXR5PSIwLjUiLz4KICA8ZWxsaXBzZSBjeD0iNjEwIiBjeT0iMTIwIiByeD0iMzQwIiByeT0iMjUwIiBmaWxsPSJ1cmwoI3BhbGUpIiBvcGFjaXR5PSIwLjciLz4KICA8ZyBmaWx0ZXI9InVybCgjc29mdCkiIG9wYWNpdHk9IjAuNiI+CiAgICA8ZWxsaXBzZSBjeD0iNzAwIiBjeT0iMzMwIiByeD0iNzAwIiByeT0iMTAwIiBmaWxsPSIjMjJEM0VFIiBvcGFjaXR5PSIwLjE2IiB0cmFuc2Zvcm09InJvdGF0ZSgtMTQgNzAwIDMzMCkiLz4KICAgIDxlbGxpcHNlIGN4PSI5ODAiIGN5PSI2OTAiIHJ4PSI3MjAiIHJ5PSI4NiIgZmlsbD0iI0E3OEJGQSIgb3BhY2l0eT0iMC4xNCIgdHJhbnNmb3JtPSJyb3RhdGUoLTkgOTgwIDY5MCkiLz4KICAgIDxlbGxpcHNlIGN4PSI0MjAiIGN5PSI2MjAiIHJ4PSI1MjAiIHJ5PSI3MCIgZmlsbD0iIzNCODJGNiIgb3BhY2l0eT0iMC4xMiIgdHJhbnNmb3JtPSJyb3RhdGUoNiA0MjAgNjIwKSIvPgogIDwvZz4KICA8Zz4KICAgIDxjaXJjbGUgY3g9IjIwNy4yIiBjeT0iMzgyLjEiIHI9IjAuOSIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSIzMzguOSIgY3k9IjczNy4zIiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iMjUuNiIgY3k9IjkyLjEiIHI9IjAuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMzI4IiBjeT0iNjE1LjUiIHI9IjEiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMTE0OS45IiBjeT0iNTI1IiByPSIwLjciIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iNzI2LjQiIGN5PSIxMzEuNCIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjMwNS4zIiBjeT0iODAyLjEiIHI9IjEuMiIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSIxNDEwLjUiIGN5PSI5NjEuMiIgcj0iMS4zIiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjQyMy4xIiBjeT0iOC44IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iMzIyIiBjeT0iNjE5LjEiIHI9IjAuNCIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC44Ii8+CiAgICA8Y2lyY2xlIGN4PSI2MjEuMyIgY3k9Ijk0NC4yIiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iMTM3MS4xIiBjeT0iNDU1LjQiIHI9IjAuNSIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSI3MjguNCIgY3k9IjE0Ni43IiByPSIwLjUiIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iNjgxLjUiIGN5PSI2ODQuNyIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9Ijg3OC42IiBjeT0iOTEzLjMiIHI9IjEiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iOTE2LjEiIGN5PSIzNTIuMyIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjI1MC4xIiBjeT0iMjk2LjUiIHI9IjAuNiIgZmlsbD0iI0RERDZGRSIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSI1OS44IiBjeT0iODc2LjYiIHI9IjAuNCIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC44Ii8+CiAgICA8Y2lyY2xlIGN4PSI5NjkuMiIgY3k9IjcwMS40IiByPSIwLjYiIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iNDcuOSIgY3k9IjY2OS42IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iMTQ1OCIgY3k9IjU4NC42IiByPSIxLjMiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iNDcwLjQiIGN5PSI2OTIuNiIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjgiLz4KICAgIDxjaXJjbGUgY3g9IjEwMjMuNiIgY3k9IjQ3Ny41IiByPSIwLjYiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iMTU2MC45IiBjeT0iNDgxLjgiIHI9IjAuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSIxODguMiIgY3k9Ijc4OS41IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iMTI3MS40IiBjeT0iOTczLjciIHI9IjAuNiIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSI5OC4yIiBjeT0iNTcyIiByPSIxLjIiIGZpbGw9IiNEREQ2RkUiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iNTIwIiBjeT0iNjIxLjEiIHI9IjAuNyIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSI2NDguNiIgY3k9IjEzMS41IiByPSIwLjUiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuMiIvPgogICAgPGNpcmNsZSBjeD0iNDIuNSIgY3k9Ijk5OC4xIiByPSIxLjYiIGZpbGw9IiNEREQ2RkUiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMTI3Mi4xIiBjeT0iMzA2LjEiIHI9IjEuMSIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMjY0LjEiIGN5PSIyNjMuNSIgcj0iMC41IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjgiLz4KICAgIDxjaXJjbGUgY3g9IjExODEuOCIgY3k9IjczNi45IiByPSIwLjciIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuMiIvPgogICAgPGNpcmNsZSBjeD0iNDgwLjYiIGN5PSI2MjIuOSIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjgwOS4yIiBjeT0iMTguMyIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjgiLz4KICAgIDxjaXJjbGUgY3g9IjE1NjEuMSIgY3k9Ijc1LjEiIHI9IjAuNCIgZmlsbD0iI0RERDZGRSIgb3BhY2l0eT0iMC4yIi8+CiAgICA8Y2lyY2xlIGN4PSIxNTM0LjQiIGN5PSI4NTUuNyIgcj0iMC41IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjI3LjciIGN5PSI2ODMuOCIgcj0iMC44IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjgiLz4KICAgIDxjaXJjbGUgY3g9IjE1MDEuMSIgY3k9IjM1Ni4zIiByPSIwLjQiIGZpbGw9IiNEREQ2RkUiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iMTQzOC4xIiBjeT0iMTgyLjciIHI9IjAuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC44Ii8+CiAgICA8Y2lyY2xlIGN4PSIxNDc2LjUiIGN5PSI5MDEiIHI9IjAuNCIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSI1NzciIGN5PSI0MDkuMiIgcj0iMC41IiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjMzNC4xIiBjeT0iOTkuMyIgcj0iMC41IiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9Ijk1OC45IiBjeT0iMjA2IiByPSIxLjUiIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iODg4LjMiIGN5PSI4NjEuNSIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjgiLz4KICAgIDxjaXJjbGUgY3g9Ijg1NCIgY3k9IjMzOC4xIiByPSIwLjQiIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iMjAzLjIiIGN5PSI2MTMuMyIgcj0iMC42IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjgiLz4KICAgIDxjaXJjbGUgY3g9IjU3My42IiBjeT0iMTg1LjIiIHI9IjEuMSIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC4yIi8+CiAgICA8Y2lyY2xlIGN4PSI0OTIuMSIgY3k9IjQ1NyIgcj0iMC40IiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjI2Ny42IiBjeT0iMTAwIiByPSIxLjciIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iODI1LjciIGN5PSIzMzQuMiIgcj0iMC40IiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjYxNCIgY3k9IjQ3OS45IiByPSIwLjciIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iOTUwLjgiIGN5PSI0MjAuNyIgcj0iMS40IiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjE1NjMuOSIgY3k9IjcyNS4xIiByPSIxLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iMTQwOC4xIiBjeT0iNjEiIHI9IjEuNCIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSI5MDQuMSIgY3k9IjExLjkiIHI9IjAuNCIgZmlsbD0iI0RERDZGRSIgb3BhY2l0eT0iMC44Ii8+CiAgICA8Y2lyY2xlIGN4PSI2MjguOCIgY3k9IjEwNC4yIiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iNjMwLjMiIGN5PSIxNTQiIHI9IjAuOSIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4yIi8+CiAgICA8Y2lyY2xlIGN4PSIyMDcuNiIgY3k9IjI2Ni4zIiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iNjg3LjUiIGN5PSI3NjcuOCIgcj0iMC41IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjkwLjIiIGN5PSI4MjcuOCIgcj0iMC40IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjE5NCIgY3k9Ijg3Mi4yIiByPSIwLjQiIGZpbGw9IiNEREQ2RkUiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iMTA0NS43IiBjeT0iNzAuNyIgcj0iMC40IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjI3Mi44IiBjeT0iNjM1IiByPSIwLjQiIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iNDM5LjgiIGN5PSI4MTAiIHI9IjAuNyIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMDczLjUiIGN5PSI1NzkuNSIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjEyNDguNSIgY3k9Ijk0NC40IiByPSIxLjIiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iMjU3LjkiIGN5PSI4MjkuNSIgcj0iMS42IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjIiLz4KICAgIDxjaXJjbGUgY3g9IjQ3NC40IiBjeT0iNDcuNiIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjkyNy4xIiBjeT0iMjEwLjMiIHI9IjAuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4yIi8+CiAgICA8Y2lyY2xlIGN4PSIyMTAuOCIgY3k9IjM4Ni40IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iNjcyLjIiIGN5PSI3MzcuMyIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjE1OTEiIGN5PSIyNjQuOCIgcj0iMC44IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1Mi40IiByPSIwLjUiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iOTE1LjQiIGN5PSI5MzguNiIgcj0iMS4xIiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjY4OC42IiBjeT0iMTA2LjgiIHI9IjAuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC44Ii8+CiAgICA8Y2lyY2xlIGN4PSI1NC4yIiBjeT0iMTIuMyIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjE0MjUuNSIgY3k9IjgxMS45IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iMTM4LjUiIGN5PSIyOTcuOSIgcj0iMC40IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjgiLz4KICAgIDxjaXJjbGUgY3g9IjkwNi45IiBjeT0iNDc3LjMiIHI9IjAuOCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC43Ii8+CiAgICA8Y2lyY2xlIGN4PSI0OTQuNiIgY3k9IjY2Ni40IiByPSIxLjMiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iNTMzLjUiIGN5PSI5NjEiIHI9IjAuNCIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC44Ii8+CiAgICA8Y2lyY2xlIGN4PSI0NzQuMiIgY3k9IjQzMS42IiByPSIwLjUiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iMjY4LjMiIGN5PSIyODYuOSIgcj0iMC42IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjgiLz4KICAgIDxjaXJjbGUgY3g9IjE3MC45IiBjeT0iNDg1LjciIHI9IjAuOCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSIxNDE4IiBjeT0iOTc0LjMiIHI9IjAuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSI5NjUuNSIgY3k9Ijg1Ny4zIiByPSIxIiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjgiLz4KICAgIDxjaXJjbGUgY3g9IjEyNzQuMiIgY3k9Ijc5Ny43IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMTUyMi42IiBjeT0iMzE2LjYiIHI9IjAuNiIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSIyMjguMiIgY3k9IjQ3My42IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iMTE0Mi4zIiBjeT0iNDQ0IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iMjc5LjUiIGN5PSIyNjAuMiIgcj0iMC43IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjEyNC4xIiBjeT0iOTgzLjciIHI9IjAuNyIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMTY2LjQiIGN5PSI1ODkiIHI9IjAuNyIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSI1NTEuNSIgY3k9IjY5Ny45IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iNDY3LjYiIGN5PSI0MjIuNCIgcj0iMC45IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjcwNy42IiBjeT0iNzQxLjQiIHI9IjAuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSIxNTEuNCIgY3k9Ijg1MS45IiByPSIxLjEiIGZpbGw9IiNEREQ2RkUiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iMTQ3NS45IiBjeT0iMzUuOCIgcj0iMC40IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjEyMTkuNCIgY3k9IjU2NC45IiByPSIwLjYiIGZpbGw9IiNEREQ2RkUiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iNTA0IiBjeT0iNjUuNyIgcj0iMC43IiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9Ijk4Mi44IiBjeT0iNzcyLjkiIHI9IjAuNiIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC4yIi8+CiAgICA8Y2lyY2xlIGN4PSIxMjU1LjkiIGN5PSI1MTQuOSIgcj0iMS4xIiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjUzMy44IiBjeT0iOTM5LjIiIHI9IjAuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSI2MDUuMSIgY3k9IjM5NS43IiByPSIwLjYiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuMiIvPgogICAgPGNpcmNsZSBjeD0iMTE1Mi42IiBjeT0iNjczLjciIHI9IjEuNSIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4yIi8+CiAgICA8Y2lyY2xlIGN4PSI2NDguOCIgY3k9IjYuNSIgcj0iMC45IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9Ijg4NS42IiBjeT0iNTEwIiByPSIwLjQiIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iNTU2IiBjeT0iNTM1IiByPSIxLjIiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iNDQzLjciIGN5PSI1NS4yIiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iNTQxLjUiIGN5PSI1MDguOSIgcj0iMS40IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjIyNC45IiBjeT0iNjY3LjEiIHI9IjAuNiIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4yIi8+CiAgICA8Y2lyY2xlIGN4PSI5NzQuMiIgY3k9IjI5Mi41IiByPSIxLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iMTAwNS41IiBjeT0iMzk1LjMiIHI9IjAuNiIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC44Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMzM1LjciIGN5PSIzMDMuMyIgcj0iMC42IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjQ1LjgiIGN5PSIzNDcuOSIgcj0iMC42IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjQxMyIgY3k9IjE4OC42IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iMTIyOCIgY3k9Ijg4Ny4yIiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iNDc1LjIiIGN5PSI4MDcuMyIgcj0iMC44IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjEyMi40IiBjeT0iMzUxLjMiIHI9IjAuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSIzMTkuMyIgY3k9Ijg4OC40IiByPSIxIiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjIiLz4KICAgIDxjaXJjbGUgY3g9IjEyNDMuNiIgY3k9IjUzNi44IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iMTQ1OS4yIiBjeT0iMTUxLjciIHI9IjEiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iMTIwLjQiIGN5PSI0ODQuNSIgcj0iMS4xIiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjY0MC44IiBjeT0iOTA5LjQiIHI9IjAuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSI4NjIuNiIgY3k9IjUyNSIgcj0iMS40IiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjEzNTYiIGN5PSI3MzAuNSIgcj0iMS41IiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjYyNi42IiBjeT0iMzYzLjQiIHI9IjEuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC44Ii8+CiAgICA8Y2lyY2xlIGN4PSIxNDk0LjQiIGN5PSIzMjAuOSIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjgiLz4KICAgIDxjaXJjbGUgY3g9IjY0Ni43IiBjeT0iNjkwLjgiIHI9IjEuMyIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSI3ODMuMiIgY3k9IjkyLjgiIHI9IjAuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC43Ii8+CiAgICA8Y2lyY2xlIGN4PSI3NzguNiIgY3k9IjQzOS42IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iNjcyLjEiIGN5PSI0NTYuNCIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjY2Ny4zIiBjeT0iNzk2LjkiIHI9IjAuOSIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSIxNTkuNCIgY3k9IjMxOC43IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iODI4LjMiIGN5PSIyODkuOSIgcj0iMS4yIiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjY4NC44IiBjeT0iNzE5LjYiIHI9IjAuNSIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSIxOTIiIGN5PSI3MzYuNCIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjExODcuOSIgY3k9Ijc3MC43IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iMTAzOC40IiBjeT0iODE3LjkiIHI9IjEuMSIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSI4ODQuNiIgY3k9IjY3MS41IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iNTg3LjkiIGN5PSI1ODYuMSIgcj0iMC40IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjEwMjAuNiIgY3k9Ijg1LjQiIHI9IjEuNSIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSI4ODkiIGN5PSI4NzMuNiIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjgzMi45IiBjeT0iNzQ5LjEiIHI9IjAuNCIgZmlsbD0iI0RERDZGRSIgb3BhY2l0eT0iMC44Ii8+CiAgICA8Y2lyY2xlIGN4PSIxLjYiIGN5PSIzNTEuNCIgcj0iMSIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSIxMDEzLjQiIGN5PSI3NzQuOSIgcj0iMS4zIiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjMyMy4yIiBjeT0iNzEzLjUiIHI9IjAuNiIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC44Ii8+CiAgICA8Y2lyY2xlIGN4PSI3MjkuNSIgY3k9IjM5MS4yIiByPSIxLjQiIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iODIwLjEiIGN5PSI0NC42IiByPSIxLjEiIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuMiIvPgogICAgPGNpcmNsZSBjeD0iMTQ2My40IiBjeT0iODU5LjEiIHI9IjAuNCIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMTYxLjUiIGN5PSI1MDkuOSIgcj0iMC42IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjgiLz4KICAgIDxjaXJjbGUgY3g9IjgxNS43IiBjeT0iMTUxLjciIHI9IjEuNSIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSI3MDkuMyIgY3k9Ijg5NS4xIiByPSIwLjciIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iOTMwLjgiIGN5PSI3NDguMSIgcj0iMC42IiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9Ijc3MC41IiBjeT0iMzY5LjEiIHI9IjAuNiIgZmlsbD0iI0RERDZGRSIgb3BhY2l0eT0iMC43Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMzMzLjQiIGN5PSIxMjcuNCIgcj0iMC40IiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjEyNDIuOCIgY3k9IjE1My42IiByPSIwLjQiIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iOTU1LjEiIGN5PSI2NDIuMiIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjE0MDMuNCIgY3k9IjcxMy44IiByPSIwLjciIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iMTA0OC40IiBjeT0iMzM5LjYiIHI9IjAuNyIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSIzNjIuMyIgY3k9IjUzLjQiIHI9IjAuNyIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSIxMzg3LjMiIGN5PSIxMS4yIiByPSIwLjYiIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iOTY3LjgiIGN5PSI4NTkuNSIgcj0iMC44IiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjExMDMuNiIgY3k9IjkyNy44IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuMiIvPgogICAgPGNpcmNsZSBjeD0iMzA3LjciIGN5PSI1OTUuMiIgcj0iMC41IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjEzMzAuNCIgY3k9IjYxNi4xIiByPSIxIiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjIwMy44IiBjeT0iNzA5LjIiIHI9IjEuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMzk5LjIiIGN5PSI2MzYuOCIgcj0iMC40IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjIiLz4KICAgIDxjaXJjbGUgY3g9IjIyNS45IiBjeT0iNzM0LjEiIHI9IjAuNyIgZmlsbD0iI0RERDZGRSIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMjQ3LjEiIGN5PSIzMTQuOSIgcj0iMC43IiBmaWxsPSIjQTVGM0ZDIiBvcGFjaXR5PSIwLjIiLz4KICAgIDxjaXJjbGUgY3g9IjE5Ni43IiBjeT0iNzE5LjMiIHI9IjAuNCIgZmlsbD0iI0E1RjNGQyIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMDEyLjMiIGN5PSI4NjkuNiIgcj0iMS42IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjgiLz4KICAgIDxjaXJjbGUgY3g9IjE1MzEuNSIgY3k9IjcyNy45IiByPSIwLjQiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iMjU3LjIiIGN5PSI3NjguNyIgcj0iMSIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC44Ii8+CiAgICA8Y2lyY2xlIGN4PSI1NzYuOCIgY3k9IjgwMi40IiByPSIxLjEiIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iODE3LjMiIGN5PSIzOTguNyIgcj0iMS4xIiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjE1LjYiIGN5PSI5NTQuNiIgcj0iMC45IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjE3Ni45IiBjeT0iOTgxLjUiIHI9IjAuNiIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC4yIi8+CiAgICA8Y2lyY2xlIGN4PSI4ODcuOSIgY3k9Ijc4Ny45IiByPSIwLjQiIGZpbGw9IiNEREQ2RkUiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iNjI2LjgiIGN5PSI5OTAuNCIgcj0iMC45IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjY1NS4zIiBjeT0iNTU2LjYiIHI9IjEuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC43Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMTMuMiIgY3k9Ijc3Ni44IiByPSIwLjQiIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuNyIvPgogICAgPGNpcmNsZSBjeD0iMTEwMS4zIiBjeT0iMjMuOCIgcj0iMC41IiBmaWxsPSIjRUFGNkZGIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjE2My43IiBjeT0iMTQ4LjYiIHI9IjAuNCIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC43Ii8+CiAgICA8Y2lyY2xlIGN4PSI3MTIuNSIgY3k9Ijg1NC40IiByPSIxLjUiIGZpbGw9IiNBNUYzRkMiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMTUxNC4yIiBjeT0iODE1LjgiIHI9IjEuMiIgZmlsbD0iI0RERDZGRSIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSIxMDUwLjciIGN5PSIyMTYuMyIgcj0iMC40IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjEzODEuNiIgY3k9IjEwMS40IiByPSIwLjciIGZpbGw9IiNFQUY2RkYiIG9wYWNpdHk9IjAuOCIvPgogICAgPGNpcmNsZSBjeD0iMTE2OC4zIiBjeT0iODYxLjQiIHI9IjEuNSIgZmlsbD0iI0VBRjZGRiIgb3BhY2l0eT0iMC43Ii8+CiAgICA8Y2lyY2xlIGN4PSI5ODYuOSIgY3k9IjIyNy4xIiByPSI4LjYiIGZpbGw9IiM1RUVBRDQiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iNDM5LjciIGN5PSI2ODYuNCIgcj0iNi4zIiBmaWxsPSIjNUVFQUQ0IiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjQ2Ny44IiBjeT0iMjIuOSIgcj0iOS4zIiBmaWxsPSIjRjBBQkZDIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9Ijk4My4yIiBjeT0iMjc2LjMiIHI9IjEyLjIiIGZpbGw9IiNEREQ2RkUiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMjk0LjIiIGN5PSI3MzAuNyIgcj0iMTMuNyIgZmlsbD0iIzVFRUFENCIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSI0NTguNiIgY3k9IjM5Ny4xIiByPSI3LjIiIGZpbGw9IiNGMEFCRkMiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMTM0Ni41IiBjeT0iODYxLjkiIHI9IjExLjEiIGZpbGw9IiNGMEFCRkMiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iMjQyLjUiIGN5PSI1My4yIiByPSIxMy45IiBmaWxsPSIjRERENkZFIiBvcGFjaXR5PSIwLjciLz4KICAgIDxjaXJjbGUgY3g9IjE0NzIuNSIgY3k9IjYwNi43IiByPSIxNS41IiBmaWxsPSIjNUVFQUQ0IiBvcGFjaXR5PSIwLjYiLz4KICA8L2c+Cjwvc3ZnPgo='
    const BACKDROP_LIGHT = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCAxNjAwIDEwMDAiPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNGNEY4RkYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjM1IiBzdG9wLWNvbG9yPSIjRTdFRUZCIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC42OCIgc3RvcC1jb2xvcj0iI0RGRThGNyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGMUY1RkMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9ImN5YW4iPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzA4OTFCMiIgc3RvcC1vcGFjaXR5PSIwLjI0Ii8+PHN0b3Agb2Zmc2V0PSIwLjUiIHN0b3AtY29sb3I9IiMwODkxQjIiIHN0b3Atb3BhY2l0eT0iMC4xMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzA4OTFCMiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0idmlvbGV0Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM3QzNBRUQiIHN0b3Atb3BhY2l0eT0iMC4yMCIvPjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjN0MzQUVEIiBzdG9wLW9wYWNpdHk9IjAuMDkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3QzNBRUQiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InJvc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI0RCMjc3NyIgc3RvcC1vcGFjaXR5PSIwLjEzIi8+PHN0b3Agb2Zmc2V0PSIwLjU1IiBzdG9wLWNvbG9yPSIjREIyNzc3IiBzdG9wLW9wYWNpdHk9IjAuMDYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNEQjI3NzciIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9IndoaXRlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNGRkZGRkYiIHN0b3Atb3BhY2l0eT0iMC42MCIvPjxzdG9wIG9mZnNldD0iMC41NSIgc3RvcC1jb2xvcj0iI0ZGRkZGRiIgc3RvcC1vcGFjaXR5PSIwLjM1Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkZGRkZGIiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiYW5kIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMCI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzIyRDNFRSIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjMjJEM0VFIiBzdG9wLW9wYWNpdHk9IjAuMDgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQTc4QkZBIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8ZmlsdGVyIGlkPSJzb2Z0IiB4PSItMzAlIiB5PSItMzAlIiB3aWR0aD0iMTYwJSIgaGVpZ2h0PSIxNjAlIj4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMzQiLz4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTYwMCIgaGVpZ2h0PSIxMDAwIiBmaWxsPSJ1cmwoI2JnKSIvPgogIDxnIHRyYW5zZm9ybT0icm90YXRlKC0yMiA4MDAgNTAwKSIgb3BhY2l0eT0iMC45Ij4KICAgIDxyZWN0IHg9Ii0yNDAiIHk9IjMzMCIgd2lkdGg9IjIwODAiIGhlaWdodD0iMjgwIiBmaWxsPSJ1cmwoI2JhbmQpIi8+CiAgPC9nPgogIDxlbGxpcHNlIGN4PSIzODAiIGN5PSIxODAiIHJ4PSI2MjAiIHJ5PSI0NzAiIGZpbGw9InVybCgjY3lhbikiLz4KICA8ZWxsaXBzZSBjeD0iMTI3MCIgY3k9IjE2MCIgcng9IjYwMCIgcnk9IjQ0MCIgZmlsbD0idXJsKCN2aW9sZXQpIi8+CiAgPGVsbGlwc2UgY3g9IjEwNjAiIGN5PSI4NjAiIHJ4PSI2ODAiIHJ5PSI0NjAiIGZpbGw9InVybCgjcm9zZSkiLz4KICA8ZWxsaXBzZSBjeD0iMTUwIiBjeT0iODUwIiByeD0iNTIwIiByeT0iNDAwIiBmaWxsPSJ1cmwoI2N5YW4pIiBvcGFjaXR5PSIwLjYiLz4KICA8ZWxsaXBzZSBjeD0iNzAwIiBjeT0iMzMwIiByeD0iNDIwIiByeT0iMzAwIiBmaWxsPSJ1cmwoI3doaXRlKSIvPgogIDxnIGZpbHRlcj0idXJsKCNzb2Z0KSIgb3BhY2l0eT0iMC41NSI+CiAgICA8ZWxsaXBzZSBjeD0iNzIwIiBjeT0iMzIwIiByeD0iNjgwIiByeT0iOTUiIGZpbGw9IiMyMkQzRUUiIG9wYWNpdHk9IjAuMTQiIHRyYW5zZm9ybT0icm90YXRlKC0xNCA3MjAgMzIwKSIvPgogICAgPGVsbGlwc2UgY3g9IjEwMDAiIGN5PSI3MDAiIHJ4PSI3MDAiIHJ5PSI4MCIgZmlsbD0iI0E3OEJGQSIgb3BhY2l0eT0iMC4xMyIgdHJhbnNmb3JtPSJyb3RhdGUoLTggMTAwMCA3MDApIi8+CiAgPC9nPgogIDxnPgogICAgPGNpcmNsZSBjeD0iNDM3IiBjeT0iODAzIiByPSIwLjUiIGZpbGw9IiMwODkxQjIiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iMjg2LjEiIGN5PSI5OTMuMyIgcj0iMS41IiBmaWxsPSIjM0I0QTdBIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjE1OTMuNyIgY3k9IjgwMCIgcj0iMC43IiBmaWxsPSIjM0I0QTdBIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjEyNDIuOCIgY3k9IjI1Mi42IiByPSIwLjciIGZpbGw9IiMwODkxQjIiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iMTQ1Mi4yIiBjeT0iMzIuMSIgcj0iMC41IiBmaWxsPSIjM0I0QTdBIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjI5Ni4yIiBjeT0iNTAuMSIgcj0iMC41IiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjEyMDcuNiIgY3k9IjYxNS40IiByPSIwLjciIGZpbGw9IiMwODkxQjIiIG9wYWNpdHk9IjAuMiIvPgogICAgPGNpcmNsZSBjeD0iMTQ2OC43IiBjeT0iNDM0LjEiIHI9IjAuNiIgZmlsbD0iIzA4OTFCMiIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSIzNjIuOCIgY3k9Ijk3Ni40IiByPSIwLjYiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMTQ3Ny4yIiBjeT0iNzk5LjciIHI9IjAuNSIgZmlsbD0iIzA4OTFCMiIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMDUwLjIiIGN5PSI2MDcuNCIgcj0iMC41IiBmaWxsPSIjN0MzQUVEIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjUwMS43IiBjeT0iNzk4LjMiIHI9IjEuMSIgZmlsbD0iIzdDM0FFRCIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMjMwLjMiIGN5PSI4ODguMiIgcj0iMC43IiBmaWxsPSIjNjQ3NDhCIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjkyMy42IiBjeT0iNTQuOSIgcj0iMS41IiBmaWxsPSIjNjQ3NDhCIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjE0MjIuMSIgY3k9IjU2Ny4yIiByPSIxLjEiIGZpbGw9IiMzQjRBN0EiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iNzM2LjIiIGN5PSI5MC4yIiByPSIxLjEiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMTIwMy4zIiBjeT0iMjYuOSIgcj0iMC42IiBmaWxsPSIjM0I0QTdBIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjE1MzQuMyIgY3k9IjMyNC44IiByPSIwLjciIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iOTk5LjQiIGN5PSIxOTAiIHI9IjAuNyIgZmlsbD0iIzY0NzQ4QiIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSI3NDIuNSIgY3k9Ijg2NS41IiByPSIwLjUiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMTQxNCIgY3k9IjMzOS4yIiByPSIwLjUiIGZpbGw9IiMwODkxQjIiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iOTAwLjQiIGN5PSIxNDMuOSIgcj0iMS42IiBmaWxsPSIjM0I0QTdBIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjcxNS4xIiBjeT0iMTc1LjIiIHI9IjAuNSIgZmlsbD0iIzA4OTFCMiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSIxNS4xIiBjeT0iNzk5LjMiIHI9IjAuNiIgZmlsbD0iIzA4OTFCMiIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMzU3LjciIGN5PSI0MjAuMyIgcj0iMC41IiBmaWxsPSIjNjQ3NDhCIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjI2MS45IiBjeT0iMjc2LjIiIHI9IjEuMSIgZmlsbD0iIzNCNEE3QSIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSI2NzIuOCIgY3k9IjIyNS45IiByPSIwLjUiIGZpbGw9IiMwODkxQjIiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMTQ2Mi43IiBjeT0iOS42IiByPSIwLjUiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iMzIzLjMiIGN5PSI3Mi4zIiByPSIxLjYiIGZpbGw9IiMwODkxQjIiIG9wYWNpdHk9IjAuMiIvPgogICAgPGNpcmNsZSBjeD0iOTA0LjMiIGN5PSI2NTkuNiIgcj0iMS4zIiBmaWxsPSIjNjQ3NDhCIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjEzOTMuNSIgY3k9IjE4NS4yIiByPSIwLjciIGZpbGw9IiM2NDc0OEIiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iNDQ3LjUiIGN5PSIxMDkuMiIgcj0iMC41IiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjEyNTguNSIgY3k9IjE5Ni4xIiByPSIwLjciIGZpbGw9IiMzQjRBN0EiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iMTU2Mi4yIiBjeT0iMTI5LjUiIHI9IjEuMSIgZmlsbD0iIzdDM0FFRCIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSI2MTcuNCIgY3k9Ijc2OC4yIiByPSIwLjUiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iNTMxLjIiIGN5PSIyMy40IiByPSIwLjUiIGZpbGw9IiMzQjRBN0EiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iNDQ0LjEiIGN5PSI3MjMuOSIgcj0iMC42IiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjMzMC41IiBjeT0iMTY3LjUiIHI9IjAuOCIgZmlsbD0iIzdDM0FFRCIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMTY5LjUiIGN5PSI4MzMuMyIgcj0iMC43IiBmaWxsPSIjM0I0QTdBIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjE1MDAuMyIgY3k9IjI4MS45IiByPSIxLjEiIGZpbGw9IiMwODkxQjIiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iNDk3LjUiIGN5PSIzOTYuMyIgcj0iMC41IiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjE0NzAuNSIgY3k9Ijg1OC40IiByPSIxLjIiIGZpbGw9IiM2NDc0OEIiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iMzY3LjkiIGN5PSI2MjguMyIgcj0iMC41IiBmaWxsPSIjN0MzQUVEIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9Ijg3MC44IiBjeT0iODI4LjMiIHI9IjAuNSIgZmlsbD0iIzY0NzQ4QiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSI4NjkuOSIgY3k9Ijc4MS44IiByPSIwLjUiIGZpbGw9IiMzQjRBN0EiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iMzkxLjEiIGN5PSIzODEuNCIgcj0iMC42IiBmaWxsPSIjM0I0QTdBIiBvcGFjaXR5PSIwLjIiLz4KICAgIDxjaXJjbGUgY3g9IjEwMDAuMyIgY3k9IjQzNi4xIiByPSIwLjkiIGZpbGw9IiMzQjRBN0EiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iODM1IiBjeT0iNzE0LjkiIHI9IjAuNSIgZmlsbD0iIzdDM0FFRCIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMTM5LjkiIGN5PSIxMi42IiByPSIxLjYiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iMTM0NC4xIiBjeT0iMTEyLjkiIHI9IjAuNSIgZmlsbD0iIzA4OTFCMiIgb3BhY2l0eT0iMC4yIi8+CiAgICA8Y2lyY2xlIGN4PSIxNTkuNiIgY3k9IjY0NS43IiByPSIwLjciIGZpbGw9IiMzQjRBN0EiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iMTI2Ny45IiBjeT0iOTM3LjkiIHI9IjEuMyIgZmlsbD0iIzNCNEE3QSIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSI5OTEuMyIgY3k9Ijk0NS44IiByPSIwLjYiIGZpbGw9IiMzQjRBN0EiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMzM1LjkiIGN5PSI0LjUiIHI9IjEuNCIgZmlsbD0iIzY0NzQ4QiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSI0NzMuMiIgY3k9IjI5NC41IiByPSIxLjEiIGZpbGw9IiMwODkxQjIiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iODA0LjQiIGN5PSI0MjMuNSIgcj0iMS41IiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjUzNS45IiBjeT0iMjc2LjQiIHI9IjAuNSIgZmlsbD0iIzdDM0FFRCIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSI0MDQuNiIgY3k9IjkxMy41IiByPSIwLjUiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMTAyMC4yIiBjeT0iNjc1LjYiIHI9IjAuNSIgZmlsbD0iIzdDM0FFRCIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSIyMy4yIiBjeT0iNjA2LjkiIHI9IjAuNSIgZmlsbD0iIzA4OTFCMiIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSIzMjUiIGN5PSIzNzguMSIgcj0iMC41IiBmaWxsPSIjM0I0QTdBIiBvcGFjaXR5PSIwLjIiLz4KICAgIDxjaXJjbGUgY3g9IjE0MDQuNSIgY3k9Ijg3NCIgcj0iMC41IiBmaWxsPSIjN0MzQUVEIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjEzNTguMiIgY3k9IjMzMC4yIiByPSIwLjUiIGZpbGw9IiMzQjRBN0EiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iMTE1LjEiIGN5PSI1MTAuOCIgcj0iMC45IiBmaWxsPSIjN0MzQUVEIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjUyOC41IiBjeT0iNzkyLjQiIHI9IjAuNSIgZmlsbD0iIzdDM0FFRCIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMDY1IiBjeT0iNjQyLjciIHI9IjAuNyIgZmlsbD0iIzY0NzQ4QiIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSI4ODMuNSIgY3k9Ijg0MS40IiByPSIwLjYiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iNDg4LjgiIGN5PSI0NDEiIHI9IjAuNyIgZmlsbD0iIzY0NzQ4QiIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSIxNTI4IiBjeT0iNzkwLjEiIHI9IjAuOCIgZmlsbD0iIzNCNEE3QSIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSI5NjYuMSIgY3k9IjQ5OS43IiByPSIxLjIiIGZpbGw9IiM2NDc0OEIiIG9wYWNpdHk9IjAuMiIvPgogICAgPGNpcmNsZSBjeD0iNjk1LjgiIGN5PSI0NzQuOSIgcj0iMS4xIiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjYiLz4KICAgIDxjaXJjbGUgY3g9IjgwMy4yIiBjeT0iOTA1LjgiIHI9IjEuNCIgZmlsbD0iIzNCNEE3QSIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMTMxLjIiIGN5PSIyNTMuOSIgcj0iMC42IiBmaWxsPSIjM0I0QTdBIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjEwMTcuNSIgY3k9IjI4MS42IiByPSIwLjYiIGZpbGw9IiMzQjRBN0EiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iOTI1LjgiIGN5PSI4ODguNiIgcj0iMC41IiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjEyMDcuNiIgY3k9IjQxNi4zIiByPSIxIiBmaWxsPSIjN0MzQUVEIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjExNDMiIGN5PSI2My4xIiByPSIwLjYiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuMiIvPgogICAgPGNpcmNsZSBjeD0iMTQwMi45IiBjeT0iMjE2LjQiIHI9IjAuNSIgZmlsbD0iIzNCNEE3QSIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSI1OTEuMiIgY3k9IjEyMC44IiByPSIwLjYiIGZpbGw9IiMwODkxQjIiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iMTM1NC4xIiBjeT0iMTUzIiByPSIwLjUiIGZpbGw9IiMwODkxQjIiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iNjgzLjUiIGN5PSI0OTYuNSIgcj0iMSIgZmlsbD0iIzNCNEE3QSIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMjAxLjIiIGN5PSIxMTcuOCIgcj0iMC42IiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjQyOCIgY3k9IjMwOS4zIiByPSIwLjUiIGZpbGw9IiMwODkxQjIiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMTEzOS43IiBjeT0iMzYwLjQiIHI9IjAuNSIgZmlsbD0iIzY0NzQ4QiIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMDMwLjgiIGN5PSI1NTguNiIgcj0iMC41IiBmaWxsPSIjN0MzQUVEIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjY2Ni40IiBjeT0iNzkwLjMiIHI9IjEuMSIgZmlsbD0iIzA4OTFCMiIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSI4MjEuMSIgY3k9Ijc4NC4zIiByPSIwLjkiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iNjczLjciIGN5PSIxNzIuNyIgcj0iMC41IiBmaWxsPSIjM0I0QTdBIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjE0LjgiIGN5PSI1NzMuOSIgcj0iMC43IiBmaWxsPSIjN0MzQUVEIiBvcGFjaXR5PSIwLjIiLz4KICAgIDxjaXJjbGUgY3g9IjgzNyIgY3k9IjMyMS4zIiByPSIwLjUiIGZpbGw9IiMzQjRBN0EiIG9wYWNpdHk9IjAuMiIvPgogICAgPGNpcmNsZSBjeD0iNzgzLjkiIGN5PSI4MjguMSIgcj0iMC41IiBmaWxsPSIjN0MzQUVEIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjUwNC4zIiBjeT0iNTQ3LjEiIHI9IjAuNiIgZmlsbD0iIzNCNEE3QSIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSI5MDYuNyIgY3k9IjIyMC4yIiByPSIwLjUiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iMTQ0OC4yIiBjeT0iMzYxLjUiIHI9IjAuNSIgZmlsbD0iIzNCNEE3QSIgb3BhY2l0eT0iMC40Ii8+CiAgICA8Y2lyY2xlIGN4PSI5LjciIGN5PSIxNjkuNCIgcj0iMS40IiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjIiLz4KICAgIDxjaXJjbGUgY3g9Ijc3Mi44IiBjeT0iMzIxLjgiIHI9IjAuNSIgZmlsbD0iIzY0NzQ4QiIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSI5NDguMiIgY3k9IjMxNi43IiByPSIwLjUiIGZpbGw9IiMwODkxQjIiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iNzI3LjQiIGN5PSIyODUuNSIgcj0iMC45IiBmaWxsPSIjN0MzQUVEIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjEzNzMuOSIgY3k9IjYyNy4zIiByPSIwLjUiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iNTczLjgiIGN5PSIyNiIgcj0iMC45IiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjExNzEuMSIgY3k9Ijk1NS45IiByPSIwLjUiIGZpbGw9IiMzQjRBN0EiIG9wYWNpdHk9IjAuMiIvPgogICAgPGNpcmNsZSBjeD0iNDg1LjMiIGN5PSI0MzAuNyIgcj0iMC41IiBmaWxsPSIjN0MzQUVEIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjEzOTIuNiIgY3k9Ijk3Ni45IiByPSIxIiBmaWxsPSIjM0I0QTdBIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjEwMTcuNiIgY3k9IjU1Ny4zIiByPSIwLjUiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iNjM1LjUiIGN5PSI3MTYuMyIgcj0iMC45IiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjEyMjguOCIgY3k9IjMyNCIgcj0iMC41IiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjQxMyIgY3k9Ijc3Ni44IiByPSIwLjUiIGZpbGw9IiMzQjRBN0EiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iMTIyOC44IiBjeT0iMS41IiByPSIxIiBmaWxsPSIjM0I0QTdBIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjQ4My43IiBjeT0iODczIiByPSIwLjUiIGZpbGw9IiM2NDc0OEIiIG9wYWNpdHk9IjAuNCIvPgogICAgPGNpcmNsZSBjeD0iNjA0LjQiIGN5PSIyODkuOCIgcj0iMS4zIiBmaWxsPSIjNjQ3NDhCIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9Ijk0NC4xIiBjeT0iNzc4LjMiIHI9IjEuMSIgZmlsbD0iIzNCNEE3QSIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSIxNTM1LjQiIGN5PSI2MTAuNSIgcj0iMC41IiBmaWxsPSIjN0MzQUVEIiBvcGFjaXR5PSIwLjQiLz4KICAgIDxjaXJjbGUgY3g9IjgzNS41IiBjeT0iNjA0LjYiIHI9IjEuNSIgZmlsbD0iIzNCNEE3QSIgb3BhY2l0eT0iMC41Ii8+CiAgICA8Y2lyY2xlIGN4PSIxOTcuNiIgY3k9IjMxNi42IiByPSIwLjUiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuMyIvPgogICAgPGNpcmNsZSBjeD0iMjQ2LjYiIGN5PSI1ODcuNSIgcj0iMS40IiBmaWxsPSIjNjQ3NDhCIiBvcGFjaXR5PSIwLjMiLz4KICAgIDxjaXJjbGUgY3g9IjYyOC43IiBjeT0iMjAzLjkiIHI9IjEuMyIgZmlsbD0iIzNCNEE3QSIgb3BhY2l0eT0iMC4zIi8+CiAgICA8Y2lyY2xlIGN4PSIxOTQuNyIgY3k9IjU4Ny41IiByPSIwLjUiIGZpbGw9IiM3QzNBRUQiIG9wYWNpdHk9IjAuNiIvPgogICAgPGNpcmNsZSBjeD0iNDE5LjgiIGN5PSI5NjguNyIgcj0iMC43IiBmaWxsPSIjMDg5MUIyIiBvcGFjaXR5PSIwLjUiLz4KICAgIDxjaXJjbGUgY3g9IjQzMC44IiBjeT0iODA1LjciIHI9IjAuNiIgZmlsbD0iIzNCNEE3QSIgb3BhY2l0eT0iMC42Ii8+CiAgICA8Y2lyY2xlIGN4PSIyODguOCIgY3k9IjU5NS42IiByPSIwLjUiIGZpbGw9IiM2NDc0OEIiIG9wYWNpdHk9IjAuNSIvPgogIDwvZz4KPC9zdmc+Cg=='
    const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

    /** Resolve the active color scheme from a theme snapshot. */
    function schemeOf(snapshot) {
      return snapshot !== undefined && snapshot.active !== undefined && snapshot.active.colorScheme === 'light'
        ? 'light'
        : 'dark'
    }

    /**
     * Mount the wallpaper behind the app: one fixed, inert layer plus a small
     * scoped stylesheet that lets the canvas show it. Every node, listener,
     * and style element is released by the returned disposer; reduced-motion
     * users get a still image with no fade.
     */
    function mountBackdrop(ctx) {
      const doc = typeof document === 'undefined' ? undefined : document
      if (doc === undefined || doc === null || doc.body === null) return () => {}
      // HMR / re-apply: replace a stale instance instead of silently bailing out.
      for (const stale of doc.querySelectorAll('[data-nebula-glass-backdrop], [data-nebula-glass-style]')) {
        stale.remove()
      }
      const body = doc.body

      const style = doc.createElement('style')
      style.setAttribute('data-nebula-glass-style', '')
      style.textContent = BACKDROP_CSS
      doc.head.append(style)

      const root = doc.createElement('div')
      root.setAttribute('data-nebula-glass-backdrop', '')
      root.setAttribute('aria-hidden', 'true')
      root.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;opacity:0;'
      const sky = doc.createElement('div')
      sky.style.cssText = 'position:absolute;inset:0;background-position:center;background-size:cover;background-repeat:no-repeat;'
      const veil = doc.createElement('div')
      veil.style.cssText = 'position:absolute;inset:0;pointer-events:none;'
      root.append(sky, veil)

      const paint = (snapshot) => {
        const scheme = schemeOf(snapshot)
        root.style.backgroundColor = scheme === 'light' ? '#F2F5FC' : '#050812'
        sky.style.backgroundImage = `url("${scheme === 'light' ? BACKDROP_LIGHT : BACKDROP_DARK}")`
        veil.style.background = VEIL[scheme]
      }
      paint(ctx.theme.getTheme())

      const media = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia(REDUCED_MOTION)
        : null
      const offTheme = ctx.on('theme/change', paint)

      body.insertBefore(root, body.firstChild)
      if (media !== null && media.matches) {
        root.style.opacity = '1'
      } else if (typeof root.animate === 'function') {
        root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: 'ease-out', fill: 'forwards' })
      } else {
        root.style.opacity = '1'
      }

      return () => {
        if (typeof offTheme === 'function') offTheme()
        root.remove()
        style.remove()
      }
    }

    return {
      inject: ['theme'],
      apply(ctx) {
        ctx.effect(
          () => ctx.theme.overrideTokens(SOURCE, TOKENS),
          'nebula-glass: token overlay',
        )
        ctx.effect(() => mountBackdrop(ctx), 'nebula-glass: nebula backdrop')
      },
    }
  },
})
