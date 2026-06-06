import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { APP_VERSION, PACKAGE_VERSION } from './appMetadata';

const projectRoot = new URL('..', import.meta.url);
const projectRootPath = fileURLToPath(projectRoot);
const sourceExtensions = new Set(['.html', '.json', '.mjs', '.scss', '.ts', '.tsx']);
const sourceDirectories = ['src', 'scss'];

const readProjectFile = (path: string): string => {
  return readFileSync(new URL(path, projectRoot), 'utf8');
};

const collectSourceFiles = (directory: string): string[] => {
  const absoluteDirectory = join(projectRootPath, directory);
  const files: string[] = [];

  const walk = (currentDirectory: string): void => {
    for (const entry of readdirSync(currentDirectory)) {
      const absolutePath = join(currentDirectory, entry);
      const stats = statSync(absolutePath);

      if (stats.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (sourceExtensions.has(extname(entry))) {
        files.push(absolutePath);
      }
    }
  };

  walk(absoluteDirectory);
  return files;
};

const formatDisplayVersion = (version: string): string => {
  return version.toUpperCase().replace(/-BETA\./u, '-BETA-');
};

const mojibakePattern = new RegExp('[\\u00c3\\u00e2\\ufffd]', 'u');

describe('project metadata', () => {
  it('keeps package, app, README, and changelog versions aligned', () => {
    const changelog = JSON.parse(readProjectFile('src/data/changelog.json')) as {
      versions: Array<{ version: string }>;
    };
    const readme = readProjectFile('README.md');

    expect(APP_VERSION).toBe(formatDisplayVersion(PACKAGE_VERSION));
    expect(changelog.versions[0]?.version).toBe(APP_VERSION);
    expect(readme).toContain(`version-${APP_VERSION.replace(/-/gu, '--')}-blue`);
  });

  it('does not load runtime dependencies from CDN links', () => {
    const indexHtml = readProjectFile('index.html');

    expect(indexHtml).not.toMatch(/cdnjs|pako\.min|font-awesome/iu);
  });

  it('does not keep Font Awesome dependencies or chunk rules', () => {
    const packageJson = readProjectFile('package.json');
    const viteConfig = readProjectFile('vite.config.ts');

    expect(packageJson).not.toMatch(/@fortawesome|font-awesome/iu);
    expect(viteConfig).not.toMatch(/@fortawesome|font-awesome/iu);
  });

  it('does not contain common mojibake markers in source files', () => {
    const projectFiles = [
      'index.html',
      'README.md',
      'package.json',
      'vite.config.ts',
    ];

    for (const file of projectFiles) {
      expect(readProjectFile(file), file).not.toMatch(mojibakePattern);
    }

    for (const file of sourceDirectories.flatMap(collectSourceFiles)) {
      const contents = readFileSync(file, 'utf8');
      expect(contents, file).not.toMatch(mojibakePattern);
    }
  });
});
