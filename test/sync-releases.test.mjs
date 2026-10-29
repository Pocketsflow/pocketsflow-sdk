// The pure parts of scripts/sync-releases.mjs (no network, no git writes).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  changelogSection,
  pickCommit,
  toGithubPackageJson,
  releaseNotes,
  GH_NAME,
  GH_REGISTRY,
} from '../scripts/sync-releases.mjs';

const CHANGELOG = `# Changelog

## 3.6.0

### Added

- penny

## 3.5.0

- payouts
`;

test('changelogSection returns the body of one version', () => {
  assert.equal(changelogSection(CHANGELOG, '3.6.0'), '### Added\n\n- penny');
  assert.equal(changelogSection(CHANGELOG, '3.5.0'), '- payouts');
  assert.equal(changelogSection(CHANGELOG, '1.0.0'), null);
});

test('pickCommit uses npm gitHead when the commit is in the repo', () => {
  const commits = [{ sha: 'a', time: '2026-02-21T00:00:00.000Z' }];
  assert.deepEqual(
    pickCommit('b', '2026-03-01T00:00:00.000Z', commits, (s) => s === 'b'),
    {
      sha: 'b',
      exact: true,
    },
  );
});

test('pickCommit falls back to the last commit before the publish, else the first', () => {
  const commits = [
    { sha: 'a', time: '2026-02-21T00:00:00.000Z' },
    { sha: 'b', time: '2026-08-06T00:00:00.000Z' },
  ];
  const none = () => false;
  assert.deepEqual(pickCommit('x', '2026-07-24T00:00:00.000Z', commits, none), {
    sha: 'a',
    exact: false,
  });
  assert.deepEqual(pickCommit(undefined, '2026-02-19T00:00:00.000Z', commits, none), {
    sha: 'a',
    exact: false,
  });
});

test('toGithubPackageJson renames the package for GitHub Packages', () => {
  const pkg = toGithubPackageJson({
    name: 'pocketsflow',
    version: '3.6.0',
    scripts: { prepublishOnly: 'npm run build' },
  });
  assert.equal(pkg.name, GH_NAME);
  assert.equal(pkg.version, '3.6.0');
  assert.equal(pkg.publishConfig.registry, GH_REGISTRY);
  assert.match(pkg.repository.url, /Pocketsflow\/pocketsflow-sdk/);
});

test('releaseNotes prefers the changelog, then commits, and flags inexact tags', () => {
  const base = { version: '3.6.0', publishedAt: '2026-10-28T21:47:39.266Z', gitHead: 'bd136c1aa' };
  const fromChangelog = releaseNotes({
    ...base,
    section: '- penny',
    commitLines: ['- x (1)'],
    exact: true,
  });
  assert.match(fromChangelog, /^- penny/);
  assert.doesNotMatch(fromChangelog, /- x \(1\)/);
  assert.match(fromChangelog, /npm install pocketsflow@3\.6\.0/);
  assert.match(fromChangelog, /published 2026-10-28/);

  const fromCommits = releaseNotes({
    ...base,
    section: null,
    commitLines: ['- x (1)'],
    exact: false,
  });
  assert.match(fromCommits, /### Changes\n\n- x \(1\)/);
  assert.match(fromCommits, /earlier repository \(commit `bd136c1`\)/);
});
