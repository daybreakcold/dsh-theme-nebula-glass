# Releasing

This repository ships a prebuilt Client bundle: `client.js` is generated, not built at install time.
`engines.dsh` is declared so the plugin manager checks the running Harness before enabling it.

## Rebuild after changing the theme or artwork

```sh
node design/generate-wallpaper.mjs   # regenerate design/wallpaper-{dark,light}.svg + base64 data
node design/build.mjs                # rebuild client.js from design/client.template.js
node --check client.js
```

## Cut a release

1. Bump `version` in `package.json`.
2. Rebuild `client.js` (above) and verify the embedded bundle id matches the package name.
3. Pack and attach a **version-free** asset name so the market's `latest/download` URL never rots:

   ```sh
   npm pack
   mv dsh-theme-nebula-glass-<version>.tgz nebula-glass-theme.tgz
   gh release create v<version> nebula-glass-theme.tgz --title "Nebula Glass theme v<version>" --notes-file NOTES.md
   ```

4. Installer URL used by the plugin market:
   `https://github.com/daybreakcold/dsh-theme-nebula-glass/releases/latest/download/nebula-glass-theme.tgz`
5. (Optional) publish to npm as `dsh-theme-nebula-glass` with `npm publish --access public`.
   The marketplace links npm downloads through the `repository` field automatically; no catalog
   change is needed.
6. If the catalog entry changes (description, category), update
   `data/plugins/daybreakcold__dsh-theme-nebula-glass.yml` in a pull request against
   [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin).

## Current listing

- Release: [v1.2.0](https://github.com/daybreakcold/dsh-theme-nebula-glass/releases/tag/v1.2.0)
- Catalog PR: [awesome-dsh-plugin#15118](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/15118)
