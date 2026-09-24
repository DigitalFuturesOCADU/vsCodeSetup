# VS Code, GitHub and p5.js Setup Guide

A step by step setup guide for OCAD University Digital Futures students. It takes someone who
has only used the p5.js web editor to the point where they write code in VS Code, push it to
GitHub, and open the result on their phone.

**Live guide:** https://digitalfuturesocadu.github.io/vsCodeSetup/guide/

Updated September 2026 for VS Code 1.138. The October 2025 version is in the Git history.

## What is in this repo

| Path | What it is |
|---|---|
| `guide/index.html` | The whole guide. All content is plain HTML in this one file |
| `guide/assets/guide.css` | Layout and type. Follows the p5js.org reference style used by the other course pages |
| `guide/assets/guide.js` | Builds the sidebar, numbering, Mac / Windows switch, copy buttons and image zoom from the HTML |
| `guide/img/` | Every screenshot the guide uses |
| `guide/*.html` (others) | Last year's page names. Each one forwards to the matching section of the new guide, so old links still work |
| `SCREENSHOTS.md` | Which screenshots are missing, which are reused from 2025, and how the new ones were made |
| `vscode-setup-check/` | The `ocadu-vscode-setup` npm package. A read-only script that checks a student's machine |
| `.github/workflows/static.yml` | Publishes this repo to GitHub Pages on every push to `main` |

The starter project students copy is a separate repo: `atelier1-f26-simpleStart-p5`.

## Editing the guide

Everything is in `guide/index.html`. There is no build step.

```html
<section class="topic" id="git" data-group="Core setup" data-nav="Install Git">   <!-- one sidebar entry -->
  <header> <h1>…</h1> <p class="lede">…</p> </header>
  <article class="step" id="git--check" data-nav="Check if you have Git">          <!-- one step under it -->
    <h2>…</h2>
    <ol class="do"> <li>…</li> </ol>                                                <!-- the actions, lettered a, b, c -->
    <figure class="shot"><img src="img/…png" alt="…"><figcaption>…</figcaption></figure>
  </article>
</section>
```

- **Add, remove or reorder** topics and steps freely. The sidebar, the numbers, "Part 3 of 15"
  and the Back and Next links are all generated.
- `data-optional` on a step shows an Optional tag on it.
- `data-core` on a topic marks it as part of workflow 1. Nothing reads it at the moment. There is no
  progress tracking: the tick boxes were removed at the instructor's request on 2026-09-21.
- `<div class="os" data-os="mac">` and `data-os="win"` show content for one operating system only.
- `<span data-part="git">part 4</span>` is a cross-reference that renumbers itself if topics move.
- `<aside class="note">`, `class="warn"` and `class="tip"` are the three callout styles.
- `<div class="cmd"><pre><code>…</code></pre></div>` is a command with a Copy button.
- `<p class="needs-shot">` marks a missing screenshot. It is only visible with `?audit` in the address.
- The template repo address appears in `guide/index.html` twice, once as a link and once in a `gh` command. Search for
  `atelier1-f26-simpleStart-p5` if the template is renamed.

Writing style: short plain sentences, one action per lettered line, exact button names in
`<b class="ui">`. Steps say what to click and what should happen next.

To preview locally, serve the repo root with any static server and open `/guide/`.

```bash
python3 -m http.server 8000
```

## The check script

`vscode-setup-check/` is published to npm as `ocadu-vscode-setup`. Version 2 went live on
2026-09-24 and is the `latest` tag, so both `npx ocadu-vscode-setup` and `npx ocadu-vscode-setup@2`
run the new checks. The guide uses `@2` so a future breaking version 3 cannot surprise students.

To publish a new version, bump `version` in `package.json`, then run the commands below. npm now asks
you to approve both the login and the publish in a browser with your authenticator. Tokens that skip
two-factor authentication no longer work for publishing.

```bash
cd vscode-setup-check
npm login
npm publish
```

The script needs Node.js, which students do not otherwise need for workflow 1. Part 9 of
the guide, "How do I know everything is set up?", therefore offers four checks in order of
effort: the laptop-to-phone test, a by-eye table, a prompt students paste into Copilot Chat in
Agent mode so the agent runs the checks, and this script.

`index-2025.js` is last year's script, kept for reference. It is not part of the package.

## Things that are likely to change

- **VS Code ships weekly.** Button wording drifts. The sign-in wording changed between
  October 2025 and September 2026, for example.
- **OpenCode free models.** Since 2026-09-17 the free Zen models are blocked outside OpenCode's
  own app (the gateway answers 403 `FreeTierError`). Part 10 therefore sets up OpenCode Go only and
  explains why in one note. If OpenCode reverses that, a Zen step could come back.
- **The OpenCode Console.** New accounts land on a new console (tabs: Overview, Usage, Logs, Go, Models,
  Keys...). Keys are made under Keys > your service account > Add API Key. The older console
  (left-hand list with Zen, Go, API Keys) still exists for older accounts.
- **GitHub Copilot Student.** The plan changed in March 2026 and again in June 2026. Part 12
  describes it as of September 2026 (200 AI Credits a month, Auto model only) and links to GitHub's own pages.
- **Action versions** in the template's `static.yml`: checkout v7, configure-pages v6,
  upload-pages-artifact v5, deploy-pages v5.
