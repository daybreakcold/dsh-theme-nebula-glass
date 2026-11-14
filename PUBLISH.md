# 发布指南：星云玻璃主题（Nebula Glass）

本目录是**可直接发布的版本**（与本地 `@local/...` 链接安装版相互独立），已经完成了所有不需要账号的准备工作。

## 已准备好

- `package.json`：正式包名 `dsh-theme-nebula-glass`（当前 npm 上未被占用）、`license: MIT`、
  `repository`/`homepage`、`engines.dsh: >=0.2.2-rc.3 <0.3.0`、`publishConfig.access: public`、`files` 白名单
- `client.js`：已按新包名重建（客户端模块 id、token 层 source 与包名一致）
- `cordis.patch.yml`、`index.js`、`locale/`、`icon.svg`、`README.md`、`LICENSE`
- `assets/icon-180.png`：180×180 商店图标（GitHub 托管位图，供市场卡片用）
- `design/`：壁纸生成器与客户端模板（留在 GitHub 仓库里，供重新构建，不进 npm 包）
- `npm pack` / `npm publish --dry-run` 校验通过

## 需要你提供/操作的部分（我这边没有你的账号）

1. GitHub 账号（用于建仓库 + 发 PR）
2. npm 账号（可选但推荐；推荐理由：用户安装时走预构建包，不用 `allowBuilds` 构建授权）
3. 确认三件事：License 用 MIT？包名用 `dsh-theme-nebula-glass`？GitHub 用户名是 `daybreakcold`？
   （如果 GitHub 用户名不同，把下面所有 `daybreakcold` 替换掉）

---

## 第 1 步：在 GitHub 建仓库并推送（今天做，为满足「仓库满 1 天」的收录门槛）

在 GitHub 新建空仓库 `dsh-theme-nebula-glass`（不要勾选 README/.gitignore，保持空），然后在本目录执行：

```sh
git init -b main
git config user.name "你的名字"
git config user.email "你的 GitHub 邮箱"
git add -A
git commit -m "feat: Nebula Glass theme v1.2.0"
git remote add origin git@github.com:daybreakcold/dsh-theme-nebula-glass.git
git push -u origin main
```

推送后给仓库加 **`dsh-plugin`** topic（仓库首页 → About 右侧齿轮 → Topics），并确认根目录
`package.json` 里有 `dsh.bundle`（已有）。

## 第 2 步：发布 npm 包（推荐）

```sh
cd /home/daybreakcold/tmp/nebula-glass-publish
npm login                # 浏览器/一次性密码登录你的 npm 账号
npm publish --access public
npm view dsh-theme-nebula-glass version repository   # 确认发布与 repository 指向正确
```

`repository` 必须指回上面收录的 GitHub 仓库，市场才会把 npm 包与仓库关联（这是平台规则，**不要**
在收录条目里手写 npm 字段）。

> 想让我来执行 `npm publish`：你在本机终端完成 `npm login` 后告诉我，我可以直接跑发布并验证。
> 但请只在明确同意「公开上架一个永久包名」后再让我执行。

## 第 3 步：给 awesome-dsh-plugin 提一个 PR（收录 = 进入插件市场）

dsh-market 的插件列表来自社区目录 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)，
不是直接提交给 dsh-market。步骤如下：

1. Fork `awesome-dsh-plugin/awesome-dsh-plugin`。
2. 新建**一个文件** `data/plugins/daybreakcold__dsh-theme-nebula-glass.yml`（文件名必须
   `<owner>__<repo>.yml`，不要手工改 README，README 由脚本生成）：

   ```yaml
   url: https://github.com/daybreakcold/dsh-theme-nebula-glass
   name: daybreakcold/dsh-theme-nebula-glass
   category: theme
   description:
     en: 'Dual-palette theme for the DeepSeek Harness Web client: indigo dark and frost light palettes with an original generated nebula wallpaper.'
     zh: 为 DSH Web 客户端提供深浅双色主题：靛蓝暗色与霜白亮色两套配色，并带一张原创生成的星云壁纸。
   icon: https://raw.githubusercontent.com/daybreakcold/dsh-theme-nebula-glass/main/assets/icon-180.png
   ```

   - `category: theme` 会让它自动出现在 dsh-market 的 **Themes（主题）Tab**。
   - 英文描述含 `: `，**必须加引号**（上面已加）。
   - `icon` 必须是 GitHub 托管的 `png/jpg/jpeg/webp` 位图（SVG 会被拒）；用量即仓库里的
     `assets/icon-180.png`，所以第 1 步要先推上去。
3. 提交 PR，标题例如 `Add Nebula Glass theme (dsh-theme-nebula-glass)`；一个 PR 最多 3 条。
4. CI 会检查：`dsh.bundle` 存在（✅）、仓库创建满 1 天（所以今天建仓库、明天再提 PR）、
   `dsh-plugin` topic、YAML 格式与 README 再生一致。维护者会读仓库代码核对描述是否属实。
5. 合并后：dsh-market 的主题 Tab 与 Discover 索引（`cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`）
   在下次构建后自动收录，无需再提交任何东西。

## 第 4 步（强烈推荐）：补截图

主题类插件在商店里最靠截图。刷新 DSH Web GUI 后截 1–2 张（深色/浅色各一张），放进仓库：

```sh
mkdir -p assets
# assets/screenshot-dark.png、assets/screenshot-light.png
printf '[\n  "assets/screenshot-dark.png",\n  "assets/screenshot-light.png"\n]\n' > screenshots.json
git add -A && git commit -m "docs: add storefront screenshots" && git push
```

`package.json` 旁边放 `screenshots.json` 即可被市场详情页展示（1–8 张，GitHub 托管位图，路径相对该文件）。

## 说明

- DSH 的「官方插件」清单（`@deepseek-ai/dsh-official-bundles`）由 DeepSeek 随安装维护，没有第三方自助投稿入口；
  社区插件进入的是 dsh-market / Discover 所用的 awesome-dsh-plugin 目录，也就是上面的流程。
- npm 包名一旦公开发布，72 小时后基本不可删除，只能废弃；发布前请确认包名。
- 本目录与当前 profile 里链接安装的 `@local/nebula-glass-theme` 是两套；发布成功后可选择把本地安装切换成
  npm 版本（需要先移除旧 bundle 再安装 `dsh-theme-nebula-glass`）。
