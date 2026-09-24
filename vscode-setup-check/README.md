# ocadu-vscode-setup

A read-only check for the OCAD U Digital Futures VS Code, GitHub and p5.js setup guide.
It never installs or changes anything.

```bash
npx ocadu-vscode-setup@2
```

On Windows the VS Code Terminal is PowerShell, which blocks `npx` by default
("running scripts is disabled on this system"). Type `npx.cmd` instead:

```
npx.cmd ocadu-vscode-setup@2
```

Run it in the VS Code Terminal with your project folder open, so it can check the project too.

## What it checks

| Area | Checks | Level |
|---|---|---|
| Git | installed, `user.name` and `user.email` set | MUST |
| VS Code | installed | MUST |
| Extensions | Live Server | MUST |
| | p5.js 2.x Project Generator | SHOULD |
| | OpenCode for Copilot Chat (only needed for workflow 2) | LATER |
| This folder | is a Git project with a GitHub remote, has `index.html` and `sketch.js`, has exactly one Pages workflow | SHOULD |
| GitHub CLI | installed and signed in. If it is, the script also asks GitHub whether Pages is on for this repo | LATER |

Each failed check prints how to fix it and a link to the matching step of the guide:
https://digitalfuturesocadu.github.io/vsCodeSetup/guide/

The exit code is 1 if any MUST check fails, otherwise 0.

## Versions

- 2.0.1, September 2026. The phone check no longer mentions tilt, since the starter sketch is blank.
- 2.0.0, September 2026. Rewritten for the template workflow. GitLens, GitHub Actions and the
  old p5 extensions are no longer required. Adds the project, Pages and GitHub CLI checks.
- 1.0.0, October 2025. Kept in the repo as `index-2025.js`.

## Publishing

```bash
npm login
npm publish
```

MIT licence.
