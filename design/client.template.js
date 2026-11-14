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
    const BACKDROP_DARK = '__BACKDROP_DARK__'
    const BACKDROP_LIGHT = '__BACKDROP_LIGHT__'
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
