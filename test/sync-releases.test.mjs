// The pure parts of scripts/sync-releases.mjs (no network, no git writes).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  changelogSection,
  notesSection,
  parseRefreshNotes,
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

  // Published without a recorded commit (gitHead): say so, not "earlier repository".
  const noGitHead = releaseNotes({ ...base, gitHead: undefined, section: '- y', commitLines: [], exact: false });
  assert.match(noGitHead, /npm recorded no commit for this publish/);
  assert.doesNotMatch(noGitHead, /earlier repository/);
});

// The 3.7.0 incident: for a few minutes main carried 3.8.0's entries under
// the 3.7.0 heading, and the release created then shipped them as 3.7.0's
// notes. Notes must come from the changelog at the published commit.
const AT_PUBLISHED_COMMIT = `# Changelog

## 3.7.0

### Added

- \`licenses.import(keys)\`

## 3.6.0

- penny
`;
const MAIN_MID_MERGE = `# Changelog

## 3.7.0

### Added

- \`subscribers.upgradeQuote(id, subscriptionId)\`
- \`licenses.import(keys)\`

## 3.6.0

- penny
`;

test('notesSection uses the changelog of the published commit, not the branch head', () => {
  const section = notesSection('3.7.0', { atCommit: AT_PUBLISHED_COMMIT, head: MAIN_MID_MERGE });
  assert.equal(section, '### Added\n\n- `licenses.import(keys)`');
  assert.doesNotMatch(section, /upgradeQuote/);
});

test('notesSection falls back to the head changelog when the commit has no entry', () => {
  // Older versions were published from another repository: the closest commit
  // here has no CHANGELOG.md (null) or no section for that version.
  assert.equal(notesSection('3.6.0', { atCommit: null, head: CHANGELOG }), '### Added\n\n- penny');
  assert.equal(notesSection('3.5.0', { atCommit: AT_PUBLISHED_COMMIT, head: CHANGELOG }), '- payouts');
  assert.equal(notesSection('1.0.0', { atCommit: AT_PUBLISHED_COMMIT, head: CHANGELOG }), null);
});

test('parseRefreshNotes reads the versions to rewrite, with or without a v', () => {
  assert.deepEqual([...parseRefreshNotes('3.7.0, v3.8.0  3.6.0')], ['3.7.0', '3.8.0', '3.6.0']);
  assert.equal(parseRefreshNotes('').size, 0);
  assert.equal(parseRefreshNotes(undefined).size, 0);
});
