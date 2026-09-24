#!/usr/bin/env node
/**
 * Setup check for the OCAD U Digital Futures VS Code + GitHub + p5.js guide.
 *   npx ocadu-vscode-setup@2               run the checks
 *   npx.cmd ocadu-vscode-setup@2           the same, in Windows PowerShell
 *   npx ocadu-vscode-setup@2 --help        what it checks
 *
 * It only reads. It never installs or changes anything.
 * Run it in the VS Code Terminal with your project folder open to also check the project.
 * Guide: https://digitalfuturesocadu.github.io/vsCodeSetup/guide/
 * Version 2 (September 2026). Version 1 (October 2025) is kept as index-2025.js.
 */
'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const GUIDE = 'https://digitalfuturesocadu.github.io/vsCodeSetup/guide/';
const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);
const green = s => c(32, s), red = s => c(31, s), yellow = s => c(33, s), dim = s => c(2, s), bold = s => c(1, s);

const EXTENSIONS = [
  { id: 'ritwickdey.liveserver', name: 'Live Server', level: 'must', anchor: 'extensions--live-server' },
  { id: 'irti.p5js-project-generator', name: 'p5.js 2.x Project Generator', level: 'should', anchor: 'extensions--p5' },
  { id: 'ltmoerdani.opencode-copilot-chat', name: 'OpenCode for Copilot Chat (workflow 2)', level: 'later', anchor: 'models--extension' },
];
const NOT_NEEDED = { 'eamodio.gitlens': 'GitLens', 'github.vscode-github-actions': 'GitHub Actions', 'ultamatum.p5-project-creator': 'P5 Project Creator', 'acidic9.p5js-snippets': 'p5js Snippets' };

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Setup check (version 2, September 2026)

  npx ocadu-vscode-setup@2

On Windows, in PowerShell (the VS Code Terminal), type npx.cmd instead of npx:

  npx.cmd ocadu-vscode-setup@2

Checks, without changing anything:
  - Git is installed and knows your name and email (GitHub Desktop normally sets these)
  - VS Code is installed
  - The two extensions from workflow 1 are installed (and the workflow 2 one, as optional)
  - Your project folder, if you run this inside one: GitHub remote, starter files, publish workflow, Pages
  - GitHub CLI, which is optional

Levels:
  MUST     the core setup will not work without it
  SHOULD   recommended
  LATER    optional, or only needed for later parts of the guide

Guide: ${GUIDE}
`);
  process.exit(0);
}

const tally = { must: 0, should: 0, later: 0, ok: 0 };
function run(cmd) {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 20000 }).trim(); } catch (e) { return null; }
}
function head(t) { console.log('\n' + bold(t)); }
function ok(msg, extra) { tally.ok++; console.log('  ' + green('✓') + ' ' + msg + (extra ? dim('  ' + extra) : '')); }
function info(msg) { console.log('  ' + dim('· ' + msg)); }
function bad(level, msg, fix, anchor) {
  tally[level]++;
  const tag = level === 'must' ? red('MUST') : level === 'should' ? yellow('SHOULD') : dim('LATER');
  console.log('  ' + (level === 'later' ? dim('○') : level === 'must' ? red('✗') : yellow('!')) + ' ' + msg + '  ' + tag);
  (Array.isArray(fix) ? fix : [fix]).filter(Boolean).forEach(l => console.log('      ' + l));
  if (anchor) console.log('      ' + dim('Guide: ' + GUIDE + '#' + anchor));
}

function findCode() {
  if (run(isWin ? 'where code' : 'command -v code')) return 'code';
  const spots = isMac
    ? ['/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code', path.join(os.homedir(), 'Applications/Visual Studio Code.app/Contents/Resources/app/bin/code')]
    : isWin
      ? [path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Microsoft VS Code', 'bin', 'code.cmd'), 'C:\\Program Files\\Microsoft VS Code\\bin\\code.cmd']
      : ['/usr/bin/code', '/usr/local/bin/code', '/snap/bin/code'];
  return spots.find(p => p && fs.existsSync(p)) || null;
}

// ---------- Git ----------
head('Git');
const gitVersion = run('git --version');
if (gitVersion) ok(gitVersion);
else bad('must', 'Git is not installed', isMac ? 'Run: xcode-select --install' : isWin ? 'Install Git for Windows from https://git-scm.com/install/windows, then restart VS Code' : 'Install git with your package manager', 'git--install');
if (gitVersion) {
  const name = run('git config --global user.name'), email = run('git config --global user.email');
  if (name) ok('Name: ' + name); else bad('must', 'Git does not know your name', 'GitHub Desktop: Settings, Git. Or run: git config --global user.name "Your Name"', 'git--identity');
  if (email) ok('Email: ' + email); else bad('must', 'Git does not know your email', 'GitHub Desktop: Settings, Git. Or run: git config --global user.email "you@ocadu.ca"', 'git--identity');
}

// ---------- VS Code ----------
head('VS Code');
const code = findCode();
if (!code) bad('must', 'VS Code was not found', 'Install it from https://code.visualstudio.com/download' + (isMac ? ' and move it to Applications' : ''), 'vscode--download');
else {
  const v = run(`"${code}" --version`);
  ok('VS Code ' + (v ? v.split('\n')[0] : 'found'));
  if (code !== 'code') info('The "code" command is not on your PATH. That is fine inside the VS Code Terminal.');
  const list = (run(`"${code}" --list-extensions`) || '').toLowerCase().split(/\s+/).filter(Boolean);
  head('Extensions');
  if (!list.length) info('Could not read the extension list. Check the Extensions panel by eye.');
  EXTENSIONS.forEach(x => {
    if (list.includes(x.id)) ok(x.name);
    else if (list.length) bad(x.level, x.name + ' is not installed', 'Extensions panel: search "' + x.name + '" and click Install', x.anchor);
  });
  const extra = Object.keys(NOT_NEEDED).filter(id => list.includes(id)).map(id => NOT_NEEDED[id]);
  if (extra.length) info('From last year and no longer needed (harmless to keep): ' + extra.join(', '));
}

// ---------- project folder ----------
head('This folder');
const inRepo = gitVersion && run('git rev-parse --is-inside-work-tree') === 'true';
let owner = null, repo = null;
if (!inRepo) info('Not a Git project. Run this again in the VS Code Terminal with your project open to check it too.');
else {
  const top = run('git rev-parse --show-toplevel') || process.cwd();
  ok('Git project: ' + path.basename(top));
  const remote = run('git remote get-url origin');
  const m = remote && remote.match(/github\.com[:/]([^/]+)\/([^/]+?)(\.git)?$/);
  if (m) { owner = m[1]; repo = m[2]; ok('Connected to GitHub: ' + owner + '/' + repo); }
  else bad('should', remote ? 'The remote is not on GitHub: ' + remote : 'This project is not connected to GitHub', 'Clone your repo from GitHub instead of making the folder by hand', 'project--clone');
  ['index.html', 'sketch.js'].forEach(f => fs.existsSync(path.join(top, f)) ? ok(f) : bad('should', f + ' is missing from the top of the project', 'Start from the template', 'project--template'));
  const wfDir = path.join(top, '.github', 'workflows');
  const wfs = fs.existsSync(wfDir) ? fs.readdirSync(wfDir).filter(f => /\.ya?ml$/.test(f)) : [];
  const deployers = wfs.filter(f => /deploy-pages/.test(fs.readFileSync(path.join(wfDir, f), 'utf8')));
  if (deployers.length === 1) ok('Publish workflow: ' + deployers[0]);
  else if (!deployers.length) bad('should', 'No GitHub Pages workflow in .github/workflows', 'Start from the template, which includes static.yml', 'project--template');
  else bad('should', deployers.length + ' workflows publish to Pages (' + deployers.join(', ') + ')', 'Keep one and delete the others. This happens if you click Configure on the Pages settings page.', 'project--pages');
  const status = run('git status -sb') || '';
  const dirty = status.split('\n').slice(1).filter(Boolean).length, ahead = (status.match(/ahead (\d+)/) || [])[1];
  if (dirty) info(dirty + ' changed file(s) not committed yet'); if (ahead) info(ahead + ' commit(s) not pushed yet. Click Sync Changes.');
  if (owner) info('Your page: https://' + owner.toLowerCase() + '.github.io/' + repo + '/');
}

// ---------- GitHub CLI ----------
head('GitHub CLI (optional)');
const gh = run('gh --version');
if (!gh) bad('later', 'gh is not installed', 'Only needed if agents outside VS Code will push for you', 'github-cli');
else {
  ok(gh.split('\n')[0]);
  const authed = run('gh auth status') !== null;
  if (authed) ok('Signed in'); else bad('later', 'gh is not signed in', 'Run: gh auth login', 'github-cli--login');
  if (authed && owner) {
    const pages = run(`gh api repos/${owner}/${repo}/pages --jq .build_type`);
    if (pages === 'workflow') ok('GitHub Pages is on (GitHub Actions)');
    else if (pages) bad('must', 'GitHub Pages source is "' + pages + '", not GitHub Actions', 'Repo Settings, Pages, Source: GitHub Actions', 'project--pages');
    else bad('must', 'GitHub Pages is not switched on for ' + owner + '/' + repo, 'Repo Settings, Pages, Source: GitHub Actions', 'project--pages');
  }
}

// ---------- by eye ----------
head('Check these yourself');
['github.com asks for a code from your phone when you sign in (2FA)', 'The Accounts icon in VS Code shows your GitHub username',
  'Settings, Pages in your repo says the source is GitHub Actions', 'Your github.io page opens on your phone and reacts to tilt'].forEach(t => console.log('  ☐ ' + t));

console.log('\n' + bold('Result'));
console.log('  Node ' + process.version + ' on ' + (isMac ? 'macOS' : isWin ? 'Windows' : process.platform) + dim('  (' + tally.ok + ' checks passed)'));
if (tally.must) console.log('  ' + red(tally.must + ' thing(s) must be fixed.') + ' Start with the first MUST above.');
else if (tally.should) console.log('  ' + yellow('The core setup works. ' + tally.should + ' recommended item(s) to look at.'));
else console.log('  ' + green('Everything the script can see is in place.'));
console.log('');
process.exit(tally.must ? 1 : 0);
