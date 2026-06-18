# 🐾 Commit Pet

**English** | [日本語](README.ja.md)

> A pixel pet that lives in your GitHub profile README and grows with your commits.
> Commit often and it stays happy. Go quiet for a few days and it gets hungry, then sick.

<p align="center">
  <img src="examples/slime.svg" width="440" alt="Commit Pet"/>
</p>

Commit Pet runs as a GitHub Action **inside your own repository**. The compute uses your own
Actions minutes, so it scales to any number of users at no cost to anyone. Every card carries a
small `★ Commit Pet` link back here.

---

## Features

- **Three species** — slime, cat, and ghost. Pick one.
- **Mood system** — `happy → content → hungry → sick`, based on how recently you committed.
- **Levels and streaks** — your pet levels up from total contributions and tracks your commit streak.
- **A color that's yours** — the palette is derived from your username, so no two pets look the same.
- **Pure SVG animation** — the pet bobs, blinks, and reacts right inside the README. No JavaScript needed.
- **AI diary** — every update PR includes a one-line diary your pet "writes" with free [GitHub Models](https://github.com/marketplace/models).
- **Review by pull request** — updates arrive as a PR you can read and merge (or auto-merge).
- **Zero dependencies** — plain Node 20, nothing to install.

## Gallery

| slime | cat | ghost |
|:---:|:---:|:---:|
| <img src="examples/slime.svg" width="240"/> | <img src="examples/cat.svg" width="240"/> | <img src="examples/ghost.svg" width="240"/> |

Each mood looks clearly different, so you can read your pet's state at a glance:

| happy | content | hungry | sick |
|:---:|:---:|:---:|:---:|
| <img src="examples/mood-happy.svg" width="220"/> | <img src="examples/mood-content.svg" width="220"/> | <img src="examples/mood-hungry.svg" width="220"/> | <img src="examples/mood-sick.svg" width="220"/> |

## Setup

**Before you start**

1. Create a **profile repository** — a repo named exactly like your username, e.g. `your-name/your-name`. [How to create one.](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme)
2. In that repo, open **Settings → Actions → General → Workflow permissions** and turn on **"Allow GitHub Actions to create and approve pull requests"**. Skipping this makes the run fail with *"GitHub Actions is not permitted to create or approve pull requests."*

> The commands below use the [GitHub CLI](https://cli.github.com/) (`gh`). Run `gh auth login` once first, and replace `your-name` with your GitHub username.

### 1. Add the workflow

Clone your profile repo and create `.github/workflows/commit-pet.yml`. Tweak `species`, `name`, and `theme` to taste — every option is listed under [Customization options](#customization-options).

<details open><summary><b>Windows (PowerShell)</b></summary>

```powershell
gh repo clone your-name/your-name
cd your-name
New-Item -ItemType Directory -Force -Path .github/workflows | Out-Null
@'
name: Commit Pet
on:
  schedule:
    - cron: "0 21 * * *"
  workflow_dispatch:
permissions:
  contents: write
  pull-requests: write
  models: read
jobs:
  pet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: yukurash/commit-pet@v1
        with:
          species: slime          # slime | cat | ghost
          name: Puni              # your pet's name
          output: commit-pet.svg
          theme: en               # en | jp
'@ | Set-Content .github/workflows/commit-pet.yml -Encoding utf8
git add .github/workflows/commit-pet.yml
git commit -m "Add Commit Pet workflow"
git push
```

</details>

<details><summary><b>macOS / Linux (bash)</b></summary>

```bash
gh repo clone your-name/your-name
cd your-name
mkdir -p .github/workflows
cat > .github/workflows/commit-pet.yml <<'YAML'
name: Commit Pet
on:
  schedule:
    - cron: "0 21 * * *"
  workflow_dispatch:
permissions:
  contents: write
  pull-requests: write
  models: read
jobs:
  pet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: yukurash/commit-pet@v1
        with:
          species: slime          # slime | cat | ghost
          name: Puni              # your pet's name
          output: commit-pet.svg
          theme: en               # en | jp
YAML
git add .github/workflows/commit-pet.yml
git commit -m "Add Commit Pet workflow"
git push
```

</details>

✅ **OK when** `git push` succeeds and the workflow **Commit Pet** appears under your repo's **Actions** tab.

### 2. Run it once

Trigger the workflow, wait for it to finish, then merge the pull request it opens:

```bash
gh workflow run commit-pet.yml
gh run watch                                   # wait until the run finishes
gh pr list                                     # note the "Commit Pet update" PR number
gh pr merge <number> --squash --delete-branch  # merge it
```

Prefer clicking? Open the **Actions** tab → **Commit Pet** → **Run workflow**, then merge the PR from the **Pull requests** tab.

✅ **OK when** the PR is merged and `commit-pet.svg` (your `output` path) exists in the repo.

### 3. Show the pet in your README

Pull the merged image, append one line to your profile `README.md`, and push:

<details open><summary><b>Windows (PowerShell)</b></summary>

```powershell
git pull
Add-Content README.md "`n![Commit Pet](commit-pet.svg)"
git commit -am "Show Commit Pet on my profile"
git push
```

</details>

<details><summary><b>macOS / Linux (bash)</b></summary>

```bash
git pull
printf '\n![Commit Pet](commit-pet.svg)\n' >> README.md
git commit -am "Show Commit Pet on my profile"
git push
```

</details>

✅ **OK when** you open `https://github.com/your-name` and the pet is at the bottom of your profile. From here the daily schedule keeps it updated through pull requests.

## Customization options

Set these under `with:` in the workflow (Step 1):

| Option | Default | What it does |
|---|---|---|
| `species` | `slime` | Pick the creature: `slime` \| `cat` \| `ghost`. |
| `name` | — | Name shown on the card. |
| `theme` | `en` | Card language: `en` \| `jp`. |
| `output` | `commit-pet.svg` | Where the SVG is written. Use the same path in your README. |
| `username` | repo owner | Whose contributions to read. |
| `pr_branch` | `commit-pet/update` | Branch used for the update PR. |
| `auto_merge` | `false` | `true` to auto-merge (your repo must allow auto-merge). |
| `token` | `github.token` | Needs `contents:write`, `pull-requests:write`, `models:read`. |

## How it works

```
GitHub GraphQL ─▶ contribution calendar ─▶ stats (level / mood / streak)
                                              │
                                  pixel SVG + AI diary (GitHub Models)
                                              │
                              peter-evans/create-pull-request ─▶ your PR
```

Everything runs in your repository's own Actions minutes. The `★ Commit Pet` footer on each card
links back to this project.

## Local preview

```bash
node src/generate.js --demo --user yourname --species cat --name Nya --out pet.svg
```

`--demo` uses a built-in offline calendar, so no token is needed. Drop `--demo` and pass `--token`
(or set `GITHUB_TOKEN`) to render from live data.

## License

MIT © yukurash
