# Nebula Glass theme

A dual-palette skin for the DeepSeek Harness Web client, with an original generated nebula wallpaper.
Dark appearance becomes a deep-space indigo desktop (layered glass planes, periwinkle type,
electric-cyan accents, cosmic backdrop); Light appearance becomes a frost-glass desktop of the same
family. It works through the Client theme service's token-overlay layer plus one inert background
layer and a small scoped stylesheet that reveals it — no component replacement, no network requests,
and it never changes your Appearance preference.

## 中文简介

星云玻璃主题给 DSH Web 界面换上一套深空玻璃皮肤：深色模式是靛蓝宇宙（多层玻璃表面、淡紫文字、
电光青强调色），浅色模式是同一风格的霜白玻璃，并在应用背后铺一张原创生成的星云壁纸。它只通过
客户端主题服务的 token 覆盖层、一个纯装饰背景层和一小段用于露出背景的作用域样式生效，不替换组件、不发起网络请求；
设置 → 外观 中的浅色 / 深色 / 跟随系统照常即时生效，禁用插件即恢复默认配色与背景。

## Install

The package is prebuilt (no install-time build scripts) and declares `engines.dsh`, so the plugin
manager checks it against the running Harness before enabling it.

```sh
# from npm (recommended — prebuilt, no build approval)
dsh plugin --profile web add dsh-theme-nebula-glass

# straight from this repository (same code, installed from source)
dsh plugin --profile web add github:daybreakcold/dsh-theme-nebula-glass
```

Requires DeepSeek Harness `0.2.2-rc.3` or newer in the `0.2.x` line. After installing, reload the Web
GUI once so the Client half and the wallpaper load.

## What it changes

- Stacks one override layer over the active theme: canvas and layered surfaces (with clear
  separation between base, cards, overlays, and code planes), borders, the full text hierarchy,
  brand and button fills, cyan-tinted hover/active washes, semantic states, code and diff fills,
  scrollbars, cards, hovercards (dark in both schemes, matching the host), toasts, tooltips, charts,
  illustrations, syntax highlighting (the `--shiki-*` palette behind code blocks), document
  selection, JSON-tree syntax, and toolbar fills.
- Overrides a few specific surfaces so the palette stays coherent: sidebar fill and active nav row,
  the user message bubble, the major input surface, and menu glass (menu surface fill and the
  near-opaque overlay fill used outside `MenuSurface`).
- Both palettes are defined at once; switching Light / Dark / System in Settings → Appearance
  repaints live because the theme runtime picks the matching value per scheme.
- Adds the backdrop: a fixed, inert (`pointer-events: none`, `aria-hidden`) layer inserted behind
  the app, holding an original 1600×1000 nebula artwork generated in this package and embedded as an
  SVG data URI (one dark, one light variant). A small scoped stylesheet clears the two host surfaces
  that paint the canvas (the app frame and the conversation root), so the artwork shows through the
  main column while every palette token — and therefore every mask, sticky header, menu, terminal,
  dialog and the composer fade — stays fully opaque. A readability veil sits between artwork and UI;
  the layer fades in once and is hidden for `forced-colors` and printing; reduced-motion users get
  no fade.

## Use

1. Enable the bundle — the skin and wallpaper apply on the next page load.
2. Switch appearance any time in **Settings → Appearance**; both schemes are already themed, and the
   wallpaper swaps to its light/dark variant live.
3. Disable the bundle (Settings → Plugins) to restore the stock palette and background; a page load
   removes the layer and the layer tokens completely.

## Artwork and development

`design/` holds the wallpaper generator and the client template; `client.js` is built from them:

```sh
node design/generate-wallpaper.mjs   # regenerate design/wallpaper-{dark,light}.svg + base64 data
node design/build.mjs                # rebuild client.js from the template + generated data
```

The artwork is produced by the generator (deterministic PRNG, no third-party assets), so it is
license-free and reproducible. Both SVGs are plain geometry and gradients — no scripts, no external
references, no animation.

## Limitations

- Web client only. Desktop native window chrome, the OS title bar, and terminal colors are not
  affected.
- Overrides are token-level: component-owned constants that ignore `--dsw-*` tokens (for example
  onboarding artwork and third-party plugin styles that hardcode values) keep their own colors.
- The wallpaper is built in. There is no custom-image picker yet. It is revealed through the main
  conversation column and the gaps between columns; entry pages that paint their own background and
  the sidebar keep their solid fills by design.
- The reveal rules match host structure (`:has(> [data-shell-overlay])` and `[data-phase]`), not
  hashed class names. If a future host changes that structure the artwork simply stops showing;
  nothing else breaks. macOS native-vibrancy layouts keep their own centre background.
- The wallpaper layer is decorative and non-interactive; it is layered behind the app frame and does
  not participate in layout.
- Third-party themes registered through `ctx.theme.register` are overlaid by these token values,
  because a token layer always wins per token; the wallpaper is independent of the active theme.
- The look is not verified in a rendered browser session; values were validated statically
  (token coverage, contrast ratios, and the backdrop mount/dispose logic).
