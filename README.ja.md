# 🐾 Commit Pet

[English](README.md) | **日本語**

> GitHub のプロフィール README に住むドットのペット。あなたのコミットに合わせて育ちます。
> こまめにコミットしているとごきげん。数日さわらないとおなかをすかせ、放っておくと寝込んでしまいます。

<p align="center">
  <img src="examples/ja-slime.svg" width="440" alt="Commit Pet"/>
</p>

Commit Pet は**あなた自身のリポジトリの GitHub Actions** で動きます。処理はあなたの Actions 時間で完結するため、
何人が使っても誰のコストも増えません。各カードには小さな `★ Commit Pet` リンクが付いています。

---

## できること

- **3種類のペット** — スライム・ねこ・おばけ。好きな子を1匹選びます。
- **きぶんが変わる** — 最後にコミットしてからの日数で `ごきげん → まあまあ → おなかすいた → びょうき` と表情が変化します。
- **レベルと連続記録** — 総コントリビューションでレベルが上がり、連続コミット日数も表示します。
- **自分だけの色** — 色はユーザー名から決まるので、同じ見た目の子はいません。
- **SVGだけで動く** — README の中でぷるぷる揺れて瞬きします。JavaScript は不要です。
- **AIが日記を書く** — 更新PRには、無料の [GitHub Models](https://github.com/marketplace/models) でペットが書いた一言日記が付きます。
- **更新はプルリクで届く** — 中身を確認してからマージできます（自動マージも可）。
- **依存ゼロ** — Node 20 の標準ライブラリだけ。

## ギャラリー

| スライム | ねこ | おばけ |
|:---:|:---:|:---:|
| <img src="examples/ja-slime.svg" width="240"/> | <img src="examples/ja-cat.svg" width="240"/> | <img src="examples/ja-ghost.svg" width="240"/> |

きぶんごとに見た目がはっきり違うので、ひと目で状態がわかります。

| ごきげん | まあまあ | おなかすいた | びょうき |
|:---:|:---:|:---:|:---:|
| <img src="examples/ja-happy.svg" width="220"/> | <img src="examples/mood-content.svg" width="220"/> | <img src="examples/ja-hungry.svg" width="220"/> | <img src="examples/ja-sick.svg" width="220"/> |

## 使い方

まず**プロフィールリポジトリ**（ユーザー名と同じ名前のリポジトリ。例: `yukurash/yukurash`）を用意します。
[作り方はこちら。](https://docs.github.com/ja/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme)

**ステップ0 — Actions に PR 作成を許可する。**
プロフィールリポジトリの **Settings → Actions → General → Workflow permissions** を開き、
**「Allow GitHub Actions to create and approve pull requests」** を ON にします。これを有効にしないと、
実行時に *「GitHub Actions is not permitted to create or approve pull requests.」* で失敗します。

**ステップ1 — ワークフローを置く。**
[examples/commit-pet.yml](examples/commit-pet.yml) をプロフィールリポジトリの
`.github/workflows/commit-pet.yml` にコピーし、`species`・`name`・`theme` をお好みで変えます。
追加するのはこのファイル1つだけで、本体はこのリポジトリから自動で読み込まれます。

**ステップ2 — 一度だけ実行する。**
リポジトリの **Actions** タブを開き、**Commit Pet** を選んで **Run workflow** を押します。
ペットが描画され、プルリクが作られます。それをマージします。

マージすると、`output` で指定したパス（既定は `commit-pet.svg`）に画像ファイルが置かれます。

**ステップ3 — README に表示する。**
プロフィールの `README.md` に、同じパスを指す1行を追加します。

```markdown
![Commit Pet](commit-pet.svg)
```

あとは毎日のスケジュールが、プルリク経由でペットを更新し続けます。

## 入力

| 入力 | 既定値 | 説明 |
|---|---|---|
| `species` | `slime` | `slime` \| `cat` \| `ghost`。 |
| `name` | — | カードに表示する名前。 |
| `output` | `commit-pet.svg` | SVG の出力先。README でも同じパスを指定します。 |
| `theme` | `en` | `en` \| `jp`。日本語表記にするなら `jp`。 |
| `username` | リポジトリ所有者 | コントリビューションを読むユーザー。 |
| `pr_branch` | `commit-pet/update` | 更新PRに使うブランチ名。 |
| `auto_merge` | `false` | `true` で自動マージ（リポジトリの自動マージ有効が前提）。 |
| `token` | `github.token` | `contents:write`・`pull-requests:write`・`models:read` が必要。 |

## しくみ

```
GitHub GraphQL ─▶ コントリビューションカレンダー ─▶ ステータス(レベル/きぶん/連続)
                                              │
                                  ドットSVG + AI日記 (GitHub Models)
                                              │
                              peter-evans/create-pull-request ─▶ あなたのPR
```

すべてあなたのリポジトリの Actions 時間で動きます。カードの `★ Commit Pet` フッターはこのプロジェクトにリンクしています。

## ローカルで試す

```bash
node src/generate.js --demo --user yourname --species cat --name ニャー --theme jp --out pet.svg
```

`--demo` は内蔵のオフラインカレンダーを使うのでトークンは不要です。`--demo` を外して `--token`
（または `GITHUB_TOKEN`）を渡すと、実際のコントリビューションから描画します。

## ライセンス

MIT © yukurash
