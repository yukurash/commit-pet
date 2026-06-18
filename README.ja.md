# 🐾 Commit Pet

[English](README.md) | **日本語**

> GitHub のプロフィール README に住む小さな**ドットのペット**。あなたのコミットで育ちます。
> 毎日コミットすればごきげん。サボると、おなかをすかせて、やがて病気になります。🥲

<p align="center">
  <img src="examples/slime.svg" width="440" alt="Commit Pet — slime"/>
</p>

**あなた自身のリポジトリの GitHub Actions** で動くので、作者側のコストはゼロ。いくらでもスケールします。
各カードにはこのプロジェクトへのリンクが付いています。あなたのペットが誰かを笑顔にしたら、それが ⭐ につながります。

---

## ✨ 特長

- **3種類** — 🟢 スライム / 🐱 ねこ / 👻 おばけ。好きな相棒を選べます。
- **きぶんシステム** — 最後にコミットしてからの日数で `ごきげん → まあまあ → おなかすいた → びょうき` と変化。
- **レベル & 連続記録** — 総コントリビューションでレベルアップ、🔥 連続日数も表示。
- **固有カラー** — ユーザー名から色を生成するので、みんな少しずつ違う見た目に。
- **純粋なドットSVG + SMIL** — README の中でぷるぷる動いて瞬きします（JS不要）。
- **AI日記** — 更新PRに、ペットが無料の [GitHub Models](https://github.com/marketplace/models) で「書いた」一言日記が付きます。
- **PR運用** — 更新はプルリクで届くのでレビュー可能（自動マージも可）。
- **依存ゼロ** — Node 20 の標準ライブラリのみ。

## 🎀 ギャラリー

| スライム | ねこ | おばけ |
|:---:|:---:|:---:|
| <img src="examples/slime.svg" width="240"/> | <img src="examples/cat.svg" width="240"/> | <img src="examples/ghost.svg" width="240"/> |

| ごきげん | おなかすいた | びょうき |
|:---:|:---:|:---:|
| <img src="examples/cat.svg" width="240"/> | <img src="examples/hungry.svg" width="240"/> | <img src="examples/sick.svg" width="240"/> |

## 🚀 はじめかた

1. **プロフィールリポジトリ**（`<ユーザー名>/<ユーザー名>`）を開きます。[これは何？](https://docs.github.com/ja/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme)
2. `.github/workflows/commit-pet.yml` に次のワークフローを追加します:

```yaml
name: Commit Pet

on:
  schedule:
    - cron: '0 21 * * *'   # 毎日
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write
  models: read              # AI日記を有効化（任意）

jobs:
  pet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: yukurash/commit-pet@v1
        with:
          species: slime     # slime | cat | ghost
          name: ぷに
          output: commit-pet.svg
          theme: jp          # jp | en
```

3. `README.md` に画像を追加:

```markdown
![my commit pet](commit-pet.svg)
```

4. ワークフローを一度実行します（**Actions → Commit Pet → Run workflow**）。ペット入りのPRが作られるので、マージすれば完成です。🎉

## ⚙️ 入力

| 入力 | 既定値 | 説明 |
|---|---|---|
| `username` | リポジトリ所有者 | コントリビューションを読むユーザー。 |
| `species` | `slime` | `slime` \| `cat` \| `ghost`。 |
| `name` | — | カードに表示する名前。 |
| `output` | `commit-pet.svg` | リポジトリにコミットするSVGのパス。 |
| `theme` | `en` | `en` \| `jp`。 |
| `pr_branch` | `commit-pet/update` | 更新PRに使うブランチ名。 |
| `auto_merge` | `false` | `true` で自動マージ（リポジトリの自動マージ有効が前提）。 |
| `token` | `github.token` | `contents:write`・`pull-requests:write`・`models:read` が必要。 |

## 🧠 しくみ

```
GitHub GraphQL ─▶ コントリビューションカレンダー ─▶ ステータス(レベル/きぶん/連続)
                                              │
                                  ドットSVG + AI日記 (GitHub Models)
                                              │
                              peter-evans/create-pull-request ─▶ あなたのPR
```

すべて *あなたの* リポジトリの Actions 時間で動きます。カードの `★ Commit Pet` フッターはこのプロジェクトにリンクしています。

## 🛠️ ローカルプレビュー

```bash
node src/generate.js --demo --user yourname --species cat --name ニャー --theme jp --out pet.svg
```

`--demo` は決定論的なオフラインカレンダーを使うのでトークン不要です。`--demo` を外して `--token`（または `GITHUB_TOKEN`）を渡すとライブデータになります。

## 📄 ライセンス

MIT © yukurash
