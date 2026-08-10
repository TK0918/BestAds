#!/usr/bin/env node
/*
 * 同步 admin-system HTML 中 prototype-kit/admin-shell/* 资源的版本戳。
 *
 * 使用方式：
 *   node prototype-kit/admin-shell/sync-admin-kit-version.mjs
 *   node prototype-kit/admin-shell/sync-admin-kit-version.mjs --check
 *
 * 版本来源：
 *   prototype-kit/admin-shell/admin-shell.js 内的 SHELL_VERSION
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');
const showHelp = args.has('--help') || args.has('-h');
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, '../..');
const shellPath = path.join(currentDir, 'admin-shell.js');
const adminSystemRoot = path.join(repoRoot, 'admin-system');
const kitAssetPattern = /((?:\.\.\/)+prototype-kit\/admin-shell\/[^"'<>\s]+\.(?:css|js))(?:\?v=[^"'<>\s]*)?/g;

function printHelp() {
  console.log([
    'Usage:',
    '  node prototype-kit/admin-shell/sync-admin-kit-version.mjs',
    '  node prototype-kit/admin-shell/sync-admin-kit-version.mjs --check',
    '',
    'Description:',
    '  Sync admin-system HTML references to prototype-kit/admin-shell/* with',
    '  the SHELL_VERSION declared in prototype-kit/admin-shell/admin-shell.js.',
    '',
    'Options:',
    '  --check  only verify versions and exit non-zero when stale files exist',
    '  -h, --help  show this help'
  ].join('\n'));
}

async function collectHtmlFiles(dir, result = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectHtmlFiles(fullPath, result);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      result.push(fullPath);
    }
  }
  return result;
}

async function main() {
  if (showHelp) {
    printHelp();
    return;
  }

  const shellSource = await readFile(shellPath, 'utf8');
  const versionMatch = shellSource.match(/const\s+SHELL_VERSION\s*=\s*['"]([^'"]+)['"]/);
  if (!versionMatch) {
    throw new Error('未能在 admin-shell.js 中找到 SHELL_VERSION');
  }

  const version = versionMatch[1];
  const htmlFiles = await collectHtmlFiles(adminSystemRoot);
  const changedFiles = [];

  for (const filePath of htmlFiles) {
    const source = await readFile(filePath, 'utf8');
    const next = source.replace(kitAssetPattern, (_, assetPath) => `${assetPath}?v=${version}`);
    if (next !== source) {
      if (!checkOnly) {
        await writeFile(filePath, next);
      }
      changedFiles.push(path.relative(repoRoot, filePath));
    }
  }

  console.log(`admin kit version: ${version}`);
  console.log(`checked html files: ${htmlFiles.length}`);
  console.log(`${checkOnly ? 'stale' : 'changed'} html files: ${changedFiles.length}`);
  for (const file of changedFiles) {
    console.log(file);
  }

  if (checkOnly && changedFiles.length) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
