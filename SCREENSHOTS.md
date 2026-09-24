# Screenshot audit

Last checked 2026-09-20 against VS Code 1.138.

All screenshots used by the guide live in `guide/img/`. To see every gap and every old
image marked inside the guide itself, open it with `?audit` on the end of the address:

```
guide/index.html?audit
```

Missing screenshots show as dashed pink boxes in the step where they belong. Images reused
from last year get a yellow "2025 capture" tag. Students never see either.

To add a missing screenshot: save it into `guide/img/` with the file name below, then in
`guide/index.html` replace the matching `<p class="needs-shot">` line with a
`<figure class="shot">` block (copy any existing one).

## Missing. Needs a manual capture

Generated from the `needs-shot` lines in `guide/index.html` on 2026-09-21. 16 to go.

| File name | Step | What to capture |
|---|---|---|
| `github-signup.png` | 2.1 Sign up | The sign-up form at github.com/signup. GitHub blocks automated browsers on this page, so it needs a manual capture. |
| `desktop-welcome.png` | 3.3 Sign in | The GitHub Desktop welcome screen with "Sign in to GitHub.com". Needs a first run of the app. |
| `desktop-configure-git.png` | 3.4 Let it set your name and email | The Configure Git screen with "Use my GitHub account name and email address" selected. Needs a first run of the app. |
| `vscode-install-windows.png` | 4.2 Download and install | The Windows installer's "Select Additional Tasks" screen with the "Open with Code" boxes ticked. Needs a Windows machine. |
| `signin-accounts-signed-in.png` | 4.7 Check you are signed in | The Accounts menu after signing in, showing "username (GitHub)" at the top. Needs a signed-in VS Code. |
| `git-mac-tools.png` | 5.2 Install Git | The macOS window that offers to install the command line developer tools. Only appears on a Mac that does not have them yet. |
| `clone-pick-repo.png` | 7.3 Clone it to your laptop | The list of your GitHub repos that appears after choosing Clone from GitHub. Needs a signed-in VS Code. |
| `actions-run-green.png` | 9.3 Watch it publish | The repo's Actions tab with the first failed run (red X) below a successful run (green tick). |
| `opencode-go-subscribe.png` | 11.4 Subscribe to Go | The Go tab for an account that has not subscribed yet, showing the subscribe button. Needs an account without Go. |
| `opencode-key-created.png` | 11.5 Make an API key | The window that appears after Add API Key, with the name field filled in as "vscode". Capture it before the key is shown, or with the key painted out. |
| `models-go-select.png` | 11.6 Add OpenCode Go in VS Code | The list of OpenCode Go models with tick boxes. |
| `models-picker-go.png` | 11.7 Find the models in the Chat | The model menu open in the Chat with the OpenCode Go models listed. |
| `models-go-test.png` | 11.8 Send a test message | The Chat showing a reply from an OpenCode Go model. |
| `copilot-chat-signed-in.png` | 12.1 Open the Chat | The Chat panel when signed in, showing the input box with the agent picker and the model picker. |
| `copilot-modes.png` | 12.2 Ask, Plan and Agent | The agent picker open, showing Agent, Ask and Plan. Needs a signed-in VS Code. |
| `copilot-keep-undo.png` | 12.4 Try Agent and read the change | An agent edit in sketch.js showing green and red lines with the Keep and Undo buttons. |

Note on 7.4 (Trust the folder): in VS Code 1.138 the old "Do you trust the authors?" pop-up did not appear, either when opening a
folder from the command line or through File > Open Folder. The folder opened in Restricted Mode with a bar at the
top instead, so the guide shows that route. If the pop-up does appear after a real Clone from GitHub, capture it then.

Most of these need a signed-in VS Code, a signed-in GitHub, a Windows machine, or the published template repo.
The Go ones need a key pasted by the account owner. Never capture a screen with a key visible.

## Reused from 2025. Still usable, worth replacing when convenient

| File | Step | Note |
|---|---|---|
| `github-2fa.png` | 2.2 | Settings layout may have shifted. Content is still right |
| `signin-browser-authorize.png` | 3.3 | Still accurate |
| `clone-desktop-button.png`, `clone-desktop-dialog.png` | 7.3 | Still accurate. Show last year's repo name |
| `pages-source.png` | 7.2 | Still accurate. Shows an older repo name |
| `liveserver-open-with.png` | 7.1 | Still accurate. Shows last year's file tree |
| `devtools-open.png`, `devtools-console.png` | 7.2 | Still accurate. Shows last year's sketch |
| `pages-live.png` | 8.4 | Still accurate |
| `qr-code.png` | 8.5 | Still accurate |
| `edu-billing.png` | 12.2 | Still accurate |
| `edu-verify.png` | 12.3 | **Out of date.** The button now reads "Start an application". Replace first |
| `ports-tab.png`, `ports-public.png`, `ports-warning.png`, `ports-qr.png` | 14 | Still accurate |

## Removed. Last year's images that were wrong for this year

These are no longer referenced. The folders are still in the repo and can be deleted.

| Folder | Why |
|---|---|
| `setupImages/GitLens.png`, `signIn/03_signInGitLens.png` | GitLens is no longer used. VS Code's built-in GitHub sign-in replaces it |
| `setupImages/githubActions.png`, `signIn/04_accessActions.png`, `signIn/05_chooseAccount.png` | The GitHub Actions extension is no longer used |
| `setupImages/P5ProjectCreator.png`, `setupImages/P5CodeSnippets.png`, `p5Setup/01` to `03` | Replaced by p5.js 2.x Project Generator. The old snippets extension dates from 2017 and only knows p5 1.x |
| `signIn/01_SignInForAI.png`, `signIn/02_ContinueWithGithub.png` | Wording changed. The menu item is now "Sign in to use GitHub Copilot..." and there is a Sign In button in the title bar |
| `signIn/copilotExtensions.png` | Copilot is built into VS Code since April 2026. There are no Copilot extensions to check for |
| `repoImages/01`, `02`, `05`, `07` to `09` | Replaced by the template flow. No manual repo or workflow setup. (`03` and `04` are reused for the GitHub Desktop clone option) |
| `copilotAuth/03` to `05` | GitHub no longer lists the profile name as a requirement for student verification |
| `setupImages/allExtensions.png`, `setupImages/startupScreen.png` | Replaced by new captures |

The root-level copies of `copilotAuth/`, `p5Setup/`, `repoImages/`, `setupImages/`, `signIn/` and `tunnels/`
duplicate the ones inside `guide/`. Nothing references either set now. Keep `setupImages/openCode.png` if you
want it. It is not committed yet.

## How the new captures were made

VS Code shots come from a second copy of VS Code started with an empty profile
(`--user-data-dir`, `--extensions-dir`) and `--remote-debugging-port`, driven with
`playwright-core` over the DevTools protocol. That gives a true first-run window with no
personal settings, exact 2x captures, and highlights drawn by adding an outline to the real
button. Settings that made it work: `window.dialogStyle: custom` and `window.menuStyle: custom`,
so dialogs and menus are drawn inside the window instead of by macOS.

The OpenCode Console pages were captured from a signed-in Chrome window with `screencapture -l <window id>`.
The window has to be on screen, or macOS returns a stale frame. Key prefixes, other key names and the
account email were painted over in the image files, so none of them are in the repo.
