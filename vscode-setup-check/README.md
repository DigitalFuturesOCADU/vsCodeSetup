# @digitalfutures/vscode-setup-check

Verification script for VS Code mobile development setup - OCAD University Digital Futures

## Usage

Run with npx (no installation required):

```bash
npx @digitalfutures/vscode-setup-check
```

For help:

```bash
npx @digitalfutures/vscode-setup-check --help
```

## What It Checks

### Automated Checks ✓
- **Node.js Installation**: Verifies Node.js and npm are installed
- **VS Code Installation**: Checks if VS Code is accessible from command line
- **VS Code Extensions**: Verifies all 5 required extensions:
  - GitLens
  - p5js Snippets
  - P5 Project Creator
  - Live Server
  - GitHub Actions
- **Git Configuration**: Checks Git installation and user settings
- **Repository Status**: Validates local repository structure and remote configuration (if run from a repo)

### Manual Verification ☐
Items that require manual confirmation:
- GitHub account authentication
- GitHub Desktop and Mobile app installation
- Extension authorization in VS Code
- GitHub Copilot Pro activation
- GitHub Pages and Actions configuration
- Development tools functionality

## Output

The script provides color-coded results:
- 🟢 **Green checkmarks (✓)**: Passed
- 🔴 **Red X marks (✗)**: Failed
- 🟡 **Yellow warnings (⚠)**: Attention needed

## Criticality Levels

Each failed check includes a criticality level:
- 🔴 **CRITICAL**: Must be fixed for development to work
- 🟡 **IMPORTANT**: Recommended for full functionality
- 🟢 **OPTIONAL**: Nice to have, but not required

## Troubleshooting

Each failed check includes:
- Why it's important (criticality level)
- How to fix it (commands or step-by-step instructions)
- Links to relevant documentation

### Common Issues

#### "VS Code not found"
- **macOS**: Run `Cmd+Shift+P` in VS Code → "Shell Command: Install 'code' command in PATH"
- **Windows**: Reinstall VS Code with "Add to PATH" option checked

#### "Git not found"
- **macOS**: Run `xcode-select --install`
- **Windows**: Download from [git-scm.com/downloads](https://git-scm.com/downloads)

#### "Not a Git repository"
- Navigate to your project folder first
- Or run from anywhere - repository checks are optional

## For More Information

See the complete setup guides at:
https://github.com/DigitalFuturesOCADU/atelier1-fall2025/tree/main/guide

## Requirements

- Node.js 16 or higher

## License

MIT

## Author

OCAD University - Digital Futures
