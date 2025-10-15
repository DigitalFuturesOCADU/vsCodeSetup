#!/bin/bash

# Quick Publish Script for vscode-setup-check
# Run this from the vsCodeSetup directory

echo "🚀 Publishing @digitalfutures/vscode-setup-check to npm"
echo ""

# Navigate to package directory
cd vscode-setup-check || exit 1

# Check if logged in
echo "Checking npm login status..."
if ! npm whoami &> /dev/null; then
    echo "❌ Not logged in to npm!"
    echo "Run: npm login"
    exit 1
fi

echo "✅ Logged in as: $(npm whoami)"
echo ""

# Show current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"
echo ""

# Ask to continue
read -p "Publish to npm? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Publishing..."
    npm publish --access public
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully published!"
        echo ""
        echo "Test it with:"
        echo "  npx @digitalfutures/vscode-setup-check"
        echo ""
        echo "View on npm:"
        echo "  https://www.npmjs.com/package/@digitalfutures/vscode-setup-check"
    else
        echo ""
        echo "❌ Publishing failed!"
        echo ""
        echo "Common issues:"
        echo "  - Organization doesn't exist: Create @digitalfutures at npmjs.com"
        echo "  - Not logged in: Run 'npm login'"
        echo "  - Package name taken: Change name in package.json"
    fi
else
    echo "Cancelled"
fi
