#!/usr/bin/env node

/**
 * VS Code Mobile Development Setup Verification Script
 * 
 * PURPOSE:
 * This script verifies your development environment is properly configured for
 * mobile development with VS Code, P5.js, Git, and GitHub.
 * 
 * USAGE:
 * Run with npx (no installation required):
 *   npx @digitalfutures/vscode-setup-check
 * 
 * Or with help flag:
 *   npx @digitalfutures/vscode-setup-check --help
 * 
 * WHAT IT CHECKS:
 * - Node.js and npm installation
 * - VS Code installation and PATH configuration
 * - Required VS Code extensions (5 total)
 * - Git installation and user configuration
 * - Local repository structure and status
 * 
 * CRITICALITY LEVELS:
 * - CRITICAL: Must be fixed for development to work
 * - IMPORTANT: Recommended for full functionality
 * - OPTIONAL: Nice to have, but not required
 * 
 * AUTHOR: Digital Futures, OCAD University
 * DATE: October 2025
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Status symbols
const symbols = {
  success: '✓',
  failure: '✗',
  warning: '⚠',
  info: 'ℹ',
};

// Track overall results
const results = {
  passed: [],
  failed: [],
  warnings: [],
  critical: [],
  important: [],
  optional: [],
};

// Help text
const HELP_TEXT = `
VS Code Mobile Development Setup Verification Script
====================================================

USAGE:
  npx @digitalfutures/vscode-setup-check          Run verification checks
  npx @digitalfutures/vscode-setup-check --help   Show this help message

WHAT THIS SCRIPT DOES:
  Automatically verifies your development environment setup including:
  - Software installation (Node.js, VS Code, Git)
  - VS Code extensions (GitLens, p5js, Live Server, etc.)
  - Git configuration (username, email)
  - Repository status and structure (if run from a repo)

OUTPUT:
  ✓ Green checkmarks = Passed
  ✗ Red X marks = Failed (with fix instructions)
  ⚠ Yellow warnings = Attention needed

CRITICALITY LEVELS:
  🔴 CRITICAL   - Must be fixed for development to work
  🟡 IMPORTANT  - Recommended for full functionality
  🟢 OPTIONAL   - Nice to have, but not required

TROUBLESHOOTING:
  Each failed check includes:
  - Why it's important (criticality level)
  - How to fix it (automated script or manual steps)
  - Links to relevant documentation

For detailed setup instructions, see: 
https://github.com/DigitalFuturesOCADU/atelier1-fall2025/tree/main/guide
`;

// Check if help flag is provided
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(HELP_TEXT);
  process.exit(0);
}

/**
 * Execute a command and return the output
 */
function executeCommand(command) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (error) {
    return null;
  }
}

/**
 * Find VS Code binary path
 * Checks PATH first, then falls back to standard installation locations
 */
function findVSCodePath() {
  // First try the standard 'code' command (in PATH)
  const inPath = executeCommand(os.platform() === 'win32' ? 'where code.cmd' : 'which code');
  if (inPath) {
    return os.platform() === 'win32' ? 'code.cmd' : 'code';
  }
  
  // Try standard installation locations
  const platform = os.platform();
  const possiblePaths = [];
  
  if (platform === 'darwin') {
    // macOS paths
    possiblePaths.push('/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code');
    possiblePaths.push(path.join(os.homedir(), 'Applications/Visual Studio Code.app/Contents/Resources/app/bin/code'));
  } else if (platform === 'win32') {
    // Windows paths
    possiblePaths.push(path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Microsoft VS Code', 'bin', 'code.cmd'));
    possiblePaths.push(path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'Microsoft VS Code', 'bin', 'code.cmd'));
    possiblePaths.push(path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Microsoft VS Code', 'bin', 'code.cmd'));
  } else {
    // Linux paths
    possiblePaths.push('/usr/bin/code');
    possiblePaths.push('/usr/local/bin/code');
    possiblePaths.push(path.join(os.homedir(), '.vscode-server', 'bin', 'code'));
  }
  
  // Check each possible path
  for (const vscodePath of possiblePaths) {
    if (fs.existsSync(vscodePath)) {
      return vscodePath;
    }
  }
  
  return null;
}

/**
 * Print colored message
 */
function print(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print section header
 */
function printHeader(title) {
  console.log('\n' + '='.repeat(60));
  print(title, 'bright');
  console.log('='.repeat(60) + '\n');
}

/**
 * Print check result with criticality and fix instructions
 */
function printResult(status, message, details = '', options = {}) {
  const symbol = symbols[status];
  const color = status === 'success' ? 'green' : status === 'failure' ? 'red' : 'yellow';
  print(`${symbol} ${message}`, color);
  
  if (details) {
    console.log(`  ${details}`);
  }
  
  // Show criticality level for failures
  if (status === 'failure' && options.criticality) {
    const criticalityColors = {
      'CRITICAL': 'red',
      'IMPORTANT': 'yellow',
      'OPTIONAL': 'green'
    };
    const critSymbols = {
      'CRITICAL': '🔴',
      'IMPORTANT': '🟡',
      'OPTIONAL': '🟢'
    };
    print(`  ${critSymbols[options.criticality]} Criticality: ${options.criticality}`, criticalityColors[options.criticality]);
    
    if (options.criticality === 'CRITICAL') {
      results.critical.push(message);
    } else if (options.criticality === 'IMPORTANT') {
      results.important.push(message);
    } else if (options.criticality === 'OPTIONAL') {
      results.optional.push(message);
    }
  }
  
  // Show fix instructions
  if (status === 'failure' && options.fix) {
    print(`  💡 How to fix:`, 'cyan');
    if (Array.isArray(options.fix)) {
      options.fix.forEach((step, index) => {
        console.log(`     ${index + 1}. ${step}`);
      });
    } else {
      console.log(`     ${options.fix}`);
    }
  }
  
  // Show links
  if (options.link) {
    print(`  📖 Guide: ${options.link}`, 'blue');
  }
  
  if (status === 'failure' || (status === 'warning' && options.fix)) {
    console.log(); // Add spacing after failures/warnings with fixes
  }
}

/**
 * Check if VS Code is installed and get its path
 */
function checkVSCode() {
  printHeader('Checking VS Code Installation');
  
  const vscodePath = findVSCodePath();
  
  if (vscodePath) {
    const version = executeCommand(`"${vscodePath}" --version`);
    
    if (version) {
      const versionNumber = version.split('\n')[0];
      
      // Check if it's in PATH or using direct path
      const inPath = executeCommand(os.platform() === 'win32' ? 'where code.cmd' : 'which code');
      
      if (inPath) {
        printResult('success', 'VS Code is installed and in PATH', `Version: ${versionNumber}`);
        results.passed.push('VS Code in PATH');
      } else {
        printResult('success', 'VS Code is installed', `Version: ${versionNumber}`);
        results.passed.push('VS Code installed');
        
        const isMac = os.platform() === 'darwin';
        const isWindows = os.platform() === 'win32';
        
        printResult('warning', 'VS Code is NOT in PATH', 'Recommended for better terminal integration', {
          criticality: 'OPTIONAL',
          fix: isMac ? [
            'To add VS Code to PATH:',
            '  1. Open VS Code',
            '  2. Press Cmd+Shift+P to open Command Palette',
            '  3. Type "shell command"',
            '  4. Select "Shell Command: Install \'code\' command in PATH"',
            '  5. Restart terminal',
            '',
            'Note: This is OPTIONAL. Extensions check will still work.'
          ] : isWindows ? [
            'To add VS Code to PATH:',
            '  1. Reinstall VS Code from: https://code.visualstudio.com/download',
            '  2. During installation, check "Add to PATH" option',
            '  3. Restart your computer',
            '',
            'Note: This is OPTIONAL. Extensions check will still work.'
          ] : [
            'Add VS Code to your PATH manually or reinstall from:',
            'https://code.visualstudio.com/download'
          ]
        });
        results.warnings.push('VS Code not in PATH');
      }
      
      return vscodePath;
    }
  }
  
  // VS Code not found anywhere
  const isMac = os.platform() === 'darwin';
  const isWindows = os.platform() === 'win32';
  
  const fixSteps = [
    'Download and install VS Code from: https://code.visualstudio.com/download',
    isMac ? 'For Mac: Download the .dmg file and drag to Applications' : 
    isWindows ? 'For Windows: Download the installer and check "Add to PATH"' : 
    'Follow the installation instructions for your OS',
    'Restart your terminal after installation'
  ];
  
  printResult('failure', 'VS Code is NOT installed', 'Required for development', {
    criticality: 'CRITICAL',
    fix: fixSteps,
    link: 'https://github.com/DigitalFuturesOCADU/atelier1-fall2025/tree/main/guide'
  });
  
  results.failed.push('VS Code not found');
  return null;
}

/**
 * Check VS Code extensions
 */
function checkExtensions(vscodePath) {
  printHeader('Checking VS Code Extensions');
  
  const requiredExtensions = {
    'eamodio.gitlens': { 
      name: 'GitLens', 
      criticality: 'IMPORTANT',
      reason: 'Enhances Git workflow and visualization'
    },
    'acidic9.p5js-snippets': { 
      name: 'p5js Snippets', 
      criticality: 'IMPORTANT',
      reason: 'Provides code snippets for P5.js development'
    },
    'ultamatum.p5-project-creator': { 
      name: 'P5 Project Creator', 
      criticality: 'CRITICAL',
      reason: 'Required to create P5.js projects in VS Code'
    },
    'ritwickdey.liveserver': { 
      name: 'Live Server', 
      criticality: 'CRITICAL',
      reason: 'Required to run local development server'
    },
    'github.vscode-github-actions': { 
      name: 'GitHub Actions', 
      criticality: 'OPTIONAL',
      reason: 'Helpful for managing GitHub deployments'
    },
  };
  
  // If VS Code path wasn't found, skip extension check
  if (!vscodePath) {
    print('⊘ Skipping extensions check - VS Code not found', 'yellow');
    console.log('  Install VS Code first, then run this script again');
    return;
  }
  
  const installedExtensions = executeCommand(`"${vscodePath}" --list-extensions`);
  
  if (!installedExtensions) {
    print('⊘ Could not retrieve extensions list', 'yellow');
    console.log('  This might be a temporary issue. Try running the script again.');
    console.log('  Or manually verify extensions in VS Code (Cmd/Ctrl+Shift+X)');
    return;
  }
  
  const installedList = installedExtensions.toLowerCase().split('\n');
  
  for (const [extId, extInfo] of Object.entries(requiredExtensions)) {
    if (installedList.includes(extId.toLowerCase())) {
      printResult('success', `${extInfo.name} is installed`);
      results.passed.push(`Extension: ${extInfo.name}`);
    } else {
      // Determine the command to use (prefer 'code' if in PATH, otherwise use full path)
      const inPath = executeCommand(os.platform() === 'win32' ? 'where code.cmd' : 'which code');
      const installCommand = inPath ? 
        `code --install-extension ${extId}` : 
        `"${vscodePath}" --install-extension ${extId}`;
      
      printResult('failure', `${extInfo.name} is NOT installed`, extInfo.reason, {
        criticality: extInfo.criticality,
        fix: [
          `Quick install: Run this command in terminal:`,
          `  ${installCommand}`,
          '',
          'Or install manually:',
          '  1. Open VS Code',
          '  2. Press Cmd+Shift+X (Mac) or Ctrl+Shift+X (Windows)',
          `  3. Search for "${extInfo.name}"`,
          '  4. Click Install'
        ],
        link: 'https://github.com/DigitalFuturesOCADU/atelier1-fall2025/tree/main/guide'
      });
      results.failed.push(`Extension: ${extInfo.name}`);
    }
  }
}

/**
 * Check Git installation and configuration
 */
function checkGit() {
  printHeader('Checking Git Installation & Configuration');
  
  const gitVersion = executeCommand('git --version');
  
  if (gitVersion) {
    printResult('success', 'Git is installed', gitVersion);
    results.passed.push('Git installed');
  } else {
    const isMac = os.platform() === 'darwin';
    const fixSteps = isMac ? [
      'Install Xcode Command Line Tools:',
      '  Run: xcode-select --install',
      'Follow the installation prompts',
      'Or download Git from: https://git-scm.com/downloads'
    ] : [
      'Download Git from: https://git-scm.com/downloads',
      'Run the installer',
      'Use default settings',
      'Restart your terminal after installation'
    ];
    
    printResult('failure', 'Git is NOT installed', 'Required for version control', {
      criticality: 'CRITICAL',
      fix: fixSteps,
      link: 'https://github.com/DigitalFuturesOCADU/atelier1-fall2025/tree/main/guide'
    });
    results.failed.push('Git not found');
    return;
  }
  
  // Check Git configuration
  const userName = executeCommand('git config --global user.name');
  const userEmail = executeCommand('git config --global user.email');
  
  if (userName) {
    printResult('success', 'Git user.name is configured', `Name: ${userName}`);
    results.passed.push('Git user.name set');
  } else {
    printResult('failure', 'Git user.name is NOT configured', 'Required for Git commits', {
      criticality: 'CRITICAL',
      fix: [
        'Run this command in terminal:',
        '  git config --global user.name "Your Full Name"',
        '',
        'Example:',
        '  git config --global user.name "Jane Smith"'
      ]
    });
    results.failed.push('Git user.name not set');
  }
  
  if (userEmail) {
    printResult('success', 'Git user.email is configured', `Email: ${userEmail}`);
    results.passed.push('Git user.email set');
    
    // Check if it's an OCADU email
    if (userEmail.includes('@ocadu.ca') || userEmail.includes('@ocad.ca')) {
      printResult('success', 'Using OCADU email address');
      results.passed.push('OCADU email configured');
    } else {
      printResult('warning', 'Not using OCADU email address', 'Recommended for GitHub Education benefits', {
        criticality: 'OPTIONAL',
        fix: [
          'To use your OCADU email:',
          '  git config --global user.email "your.email@ocadu.ca"',
          '',
          `Current email: ${userEmail}`,
          '',
          'Note: This is OPTIONAL. Your current setup works fine.',
          'OCADU email only needed for GitHub Education benefits.'
        ]
      });
      results.warnings.push('Non-OCADU email');
    }
  } else {
    printResult('failure', 'Git user.email is NOT configured', 'Required for Git commits', {
      criticality: 'CRITICAL',
      fix: [
        'Run this command in terminal:',
        '  git config --global user.email "your.email@ocadu.ca"',
        '',
        'Example:',
        '  git config --global user.email "jane.smith@ocadu.ca"'
      ]
    });
    results.failed.push('Git user.email not set');
  }
}

/**
 * Check Node.js installation
 */
function checkNode() {
  printHeader('Checking Node.js Installation');
  
  const nodeVersion = executeCommand('node --version');
  const npmVersion = executeCommand('npm --version');
  
  if (nodeVersion) {
    printResult('success', 'Node.js is installed', nodeVersion);
    results.passed.push('Node.js installed');
  } else {
    printResult('failure', 'Node.js is NOT installed', 'Required to run this verification script', {
      criticality: 'IMPORTANT',
      fix: [
        'Download Node.js LTS version from: https://nodejs.org/',
        'Run the installer (includes npm)',
        'Use default installation settings',
        'Restart terminal after installation',
        '',
        'Note: You\'re seeing this message because Node.js IS installed',
        '(otherwise this script wouldn\'t run!). This check failed due to',
        'a technical issue, but you can safely ignore it.'
      ],
      link: 'https://github.com/DigitalFuturesOCADU/atelier1-fall2025/tree/main/guide'
    });
    results.failed.push('Node.js not found');
  }
  
  if (npmVersion) {
    printResult('success', 'npm is installed', `Version: ${npmVersion}`);
    results.passed.push('npm installed');
  } else {
    printResult('warning', 'npm is NOT installed', 'Useful for managing packages', {
      criticality: 'OPTIONAL',
      fix: [
        'npm usually comes with Node.js',
        'Try reinstalling Node.js from: https://nodejs.org/',
        '',
        'Note: Not required for basic P5.js development'
      ]
    });
    results.warnings.push('npm not found');
  }
}

/**
 * Check for local Git repository
 */
function checkLocalRepo() {
  printHeader('Checking Local Repository');
  
  const currentDir = process.cwd();
  const gitDir = path.join(currentDir, '.git');
  
  if (fs.existsSync(gitDir)) {
    printResult('success', 'Current directory is a Git repository');
    results.passed.push('Git repository found');
    
    // Get remote URL
    const remoteUrl = executeCommand('git remote get-url origin');
    if (remoteUrl) {
      printResult('success', 'Remote repository configured', remoteUrl);
      results.passed.push('Remote configured');
      
      // Check if it's a GitHub repository
      if (remoteUrl.includes('github.com')) {
        printResult('success', 'Repository is hosted on GitHub');
        results.passed.push('GitHub repository');
      }
    } else {
      printResult('warning', 'No remote repository configured', 'Needed for GitHub Pages deployment', {
        criticality: 'IMPORTANT',
        fix: [
          'Create a GitHub repository first (if you haven\'t):',
          '  1. Go to https://github.com/new',
          '  2. Create a new repository',
          '',
          'Then connect it to this local repository:',
          '  git remote add origin https://github.com/USERNAME/REPO-NAME.git',
          '  git branch -M main',
          '  git push -u origin main',
          '',
          'Replace USERNAME and REPO-NAME with your details'
        ],
        link: 'https://github.com/DigitalFuturesOCADU/atelier1-fall2025/tree/main/guide'
      });
      results.warnings.push('No remote configured');
    }
    
    // Check current branch
    const branch = executeCommand('git branch --show-current');
    if (branch) {
      printResult('success', `Current branch: ${branch}`);
      results.passed.push(`Branch: ${branch}`);
    }
    
    // Check for uncommitted changes
    const status = executeCommand('git status --porcelain');
    if (status) {
      const fileCount = status.trim().split('\n').length;
      printResult('warning', `You have ${fileCount} uncommitted change(s)`, 'Not critical, but good practice to commit regularly', {
        criticality: 'OPTIONAL',
        fix: [
          'To see what files changed:',
          '  git status',
          '',
          'To commit your changes:',
          '  git add .',
          '  git commit -m "Describe your changes"',
          '  git push',
          '',
          'Note: This is OPTIONAL. Uncommitted changes don\'t break anything.'
        ]
      });
      results.warnings.push('Uncommitted changes');
    } else {
      printResult('success', 'Working directory is clean');
      results.passed.push('Clean working directory');
    }
  } else {
    printResult('warning', 'Current directory is NOT a Git repository', 'Run from your project folder for repository checks', {
      criticality: 'OPTIONAL',
      fix: [
        'This is OPTIONAL - you can run this script from anywhere.',
        'For repository-specific checks, navigate to your project first:',
        '  cd path/to/your/repository',
        '  npx @digitalfutures/vscode-setup-check',
        '',
        'Or if you don\'t have a repository yet, see the setup guide.',
        '',
        `Current directory: ${currentDir}`
      ],
      link: 'https://github.com/DigitalFuturesOCADU/atelier1-fall2025/tree/main/guide'
    });
    results.warnings.push('Not in Git repository');
  }
}

/**
 * Manual verification checklist
 */
function printManualChecklist() {
  printHeader('Manual Verification Checklist');
  
  print('\nThe following items require manual verification:', 'cyan');
  console.log('\n☐ GitHub account created with @ocadu.ca email');
  console.log('☐ Signed into VS Code with GitHub account');
  console.log('☐ GitHub Desktop installed and signed in');
  console.log('☐ GitHub Mobile app installed on phone');
  console.log('☐ GitLens extension authorized in VS Code');
  console.log('☐ GitHub Actions extension authorized in VS Code');
  console.log('☐ GitHub Copilot Pro subscription activated');
  console.log('☐ Two-factor authentication enabled on GitHub');
  console.log('☐ GitHub repository created with Pages enabled');
  console.log('☐ GitHub Actions workflow configured');
  console.log('☐ Repository cloned locally');
  console.log('☐ Can create P5.js project using Command Palette');
  console.log('☐ Live Server can launch local development server');
  console.log('☐ VS Code Tunnel can be created and accessed');
  console.log('☐ Chrome DevTools accessible (F12 or Cmd+Option+I)');
  
  print('\n📚 Refer to the setup guides at:', 'cyan');
  console.log('   https://github.com/DigitalFuturesOCADU/atelier1-fall2025/tree/main/guide');
}

/**
 * Print final summary
 */
function printSummary() {
  printHeader('Setup Verification Summary');
  
  const total = results.passed.length + results.failed.length + results.warnings.length;
  const passRate = total > 0 ? Math.round((results.passed.length / total) * 100) : 0;
  
  print(`\n✓ Passed: ${results.passed.length}`, 'green');
  print(`✗ Failed: ${results.failed.length}`, 'red');
  print(`⚠ Warnings: ${results.warnings.length}`, 'yellow');
  
  console.log(`\nCompletion Rate: ${passRate}%`);
  
  // Show criticality breakdown
  if (results.critical.length > 0 || results.important.length > 0 || results.optional.length > 0) {
    console.log('\nFailed Items by Criticality:');
    if (results.critical.length > 0) {
      print(`  🔴 Critical: ${results.critical.length} - Must fix for development to work`, 'red');
    }
    if (results.important.length > 0) {
      print(`  🟡 Important: ${results.important.length} - Recommended for full functionality`, 'yellow');
    }
    if (results.optional.length > 0) {
      print(`  🟢 Optional: ${results.optional.length} - Nice to have, not required`, 'green');
    }
  }
  
  console.log('');
  
  // Provide context-specific feedback
  if (results.failed.length === 0 && results.warnings.length === 0) {
    print('🎉 Perfect! All automated checks passed!', 'green');
    print('Please complete the manual verification checklist above.', 'cyan');
  } else if (results.critical.length === 0 && results.important.length === 0) {
    print('✅ Your system is working correctly!', 'green');
    print('The failed/warning items are OPTIONAL and don\'t affect functionality.', 'cyan');
    print('You can safely proceed with development.', 'cyan');
  } else if (results.critical.length > 0) {
    print('🔴 CRITICAL issues found - these must be fixed!', 'red');
    print('Review the fix instructions above for each critical item.', 'yellow');
  } else {
    print('⚠️  Some recommended items need attention.', 'yellow');
    print('Your system may work, but fixing these will improve functionality.', 'cyan');
  }
  
  console.log('\n📚 For detailed guides, visit:');
  console.log('   https://github.com/DigitalFuturesOCADU/atelier1-fall2025/tree/main/guide');
  console.log('❓ For help, run: npx @digitalfutures/vscode-setup-check --help');
  console.log('\n');
}

/**
 * Main execution
 */
function main() {
  console.clear();
  
  print('╔════════════════════════════════════════════════════════════╗', 'cyan');
  print('║   VS Code Mobile Development Setup Verification Script    ║', 'cyan');
  print('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  checkNode();
  const vscodePath = checkVSCode();
  checkExtensions(vscodePath);
  checkGit();
  checkLocalRepo();
  printManualChecklist();
  printSummary();
}

// Run the script
main();
