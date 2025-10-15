# Publishing Guide for @digitalfutures/vscode-setup-check

This guide explains how to publish the verification script to npm so students can run it with `npx`.

## Prerequisites

1. **npm account** - Create one at https://www.npmjs.com/signup
2. **Organization (optional but recommended)** - Create `@digitalfutures` organization on npm

## Step-by-Step Publishing

### 1. Login to npm

```bash
npm login
```

Enter your npm credentials.

### 2. Navigate to the package directory

```bash
cd vscode-setup-check
```

### 3. Test the package locally

```bash
node index.js
```

Make sure everything works correctly.

### 4. Publish to npm

For a scoped package (recommended):

```bash
# First time - publish as public
npm publish --access public
```

For subsequent updates:

```bash
# Increment version in package.json first
npm version patch  # or minor, or major
npm publish
```

### 5. Verify it works

Test that students can run it:

```bash
npx @digitalfutures/vscode-setup-check
```

## Package Name Options

If you don't want to use `@digitalfutures` (requires organization), you can use an unscoped name:

### Option A: Scoped (Recommended)
- Package name: `@digitalfutures/vscode-setup-check`
- Command: `npx @digitalfutures/vscode-setup-check`
- Pros: Professional, namespaced, clear ownership
- Cons: Requires npm organization

### Option B: Unscoped (Simpler)
Change `package.json` name to:
```json
"name": "ocadu-vscode-setup-check"
```
- Command: `npx ocadu-vscode-setup-check`
- Pros: No organization needed, simpler
- Cons: Less professional, might conflict with other packages

## Updating the Package

When you make changes:

1. Make your code changes
2. Update version number:
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```
3. Publish:
   ```bash
   npm publish
   ```

## Alternative: Unscoped Package Name

If you want to avoid creating an npm organization, update `package.json`:

```json
{
  "name": "ocadu-vscode-setup",
  "bin": {
    "ocadu-vscode-setup": "./index.js"
  }
}
```

Then students run:
```bash
npx ocadu-vscode-setup
```

## Testing Before Publishing

Test locally with npm link:

```bash
cd vscode-setup-check
npm link

# Now you can test it globally
vscode-setup-check

# Or with npx
npx vscode-setup-check

# Unlink when done testing
npm unlink -g @digitalfutures/vscode-setup-check
```

## After Publishing

Update the guide at `guide/checkSetup.html` to tell students:

```bash
npx @digitalfutures/vscode-setup-check
```

## Troubleshooting

### "You do not have permission to publish"
- Make sure you're logged in: `npm whoami`
- For scoped packages, use: `npm publish --access public`
- For organization packages, you need to be a member of `@digitalfutures`

### "Package name already exists"
- Choose a different name
- Or use a scoped name like `@yourusername/vscode-setup-check`

### "Cannot find module"
- Make sure `index.js` has execute permissions: `chmod +x index.js`
- Check the shebang line: `#!/usr/bin/env node`

## Recommended Workflow

1. **First time**: Publish as public scoped package
2. **Updates**: Version bump + publish
3. **Guide updates**: Update HTML guide with correct npx command
4. **Testing**: Always test with `npx` before announcing to students

## Package Visibility

The package will be:
- ✓ Publicly accessible
- ✓ Free to use
- ✓ Searchable on npm
- ✓ Runnable via npx without installation

Students don't need to install anything - just run `npx @digitalfutures/vscode-setup-check`!
