#!/usr/bin/env node
// Keeps GitHub in step with npm: every version of `pocketsflow` published to
// npm gets a `v<version>` tag, a GitHub release (notes from CHANGELOG.md, the
// npm tarball attached) and the same package on GitHub Packages as
// `@pocketsflow/pocketsflow`. npm is the source of truth; anything already on
// GitHub is left alone, so the script is safe to run again and again.
//
// Runs in .github/workflows/sync-releases.yml. Locally:
//   DRY_RUN=1 node scripts/sync-releases.mjs   (prints the plan, writes nothing)
// A real run needs `gh` signed in (GH_TOKEN) and NODE_AUTH_TOKEN with
// packages:write for GitHub Packages.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const NPM_NAME = 'pocketsflow';
export const GH_NAME = '@pocketsflow/pocketsflow';
export const GH_REGISTRY = 'https://npm.pkg.github.com';
export const REPO_URL = 'https://github.com/Pocketsflow/pocketsflow-sdk';

/** The body of `## <version>` in CHANGELOG.md, or null when it has none. */
export function changelogSection(changelog, version) {
  const lines = changelog.split('\n');
  const start = lines.findIndex((l) => l.trim() === `## ${version}`);
  if (start === -1) return null;
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end === -1) end = lines.length;
  const body = lines
    .slice(start + 1, end)
    .join('\n')
    .trim();
  return body || null;
}

/**
 * The commit to tag. npm records the commit it was published from (gitHead);
 * the first versions were published from other repositories, so for those
 * take the last commit here made before the publish (or the first commit).
 * `commits` is oldest first: [{ sha, time }].
 */
export function pickCommit(gitHead, publishedAt, commits, hasCommit) {
  if (gitHead && hasCommit(gitHead)) return { sha: gitHead, exact: true };
  const before = commits.filter((c) => c.time <= publishedAt);
  const sha = (before.at(-1) ?? commits[0]).sha;
  return { sha, exact: false };
}

/** package.json of the npm tarball, renamed for GitHub Packages. */
export function toGithubPackageJson(pkg) {
  const out = { ...pkg, name: GH_NAME };
  out.repository = { type: 'git', url: `git+${REPO_URL}.git` };
  out.publishConfig = { registry: GH_REGISTRY };
  return out;
}

export function releaseNotes({ version, section, commitLines, exact, gitHead, publishedAt }) {
  const parts = [];
  if (section) parts.push(section);
  else if (commitLines.length) parts.push(`### Changes\n\n${commitLines.join('\n')}`);
  else parts.push('No changelog entry for this version.');
  if (!exact) {
    parts.push(
      `> Published to npm from an earlier repository${gitHead ? ` (commit \`${gitHead.slice(0, 7)}\`)` : ''}. ` +
        'This tag points at the closest commit in this repository; the attached tarball is the exact npm package.',
    );
  }
  parts.push(
    [
      '### Install',
      '',
      '```bash',
      `npm install ${NPM_NAME}@${version}`,
      '```',
      '',
      `npm: https://www.npmjs.com/package/${NPM_NAME}/v/${version} · published ${publishedAt.slice(0, 10)}`,
    ].join('\n'),
  );
  return `${parts.join('\n\n')}\n`;
}

function cmpSemver(a, b) {
  const pa = a.split(/[.-]/).map((x) => (Number.isNaN(+x) ? x : +x));
  const pb = b.split(/[.-]/).map((x) => (Number.isNaN(+x) ? x : +x));
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    if (pa[i] === pb[i]) continue;
    if (pa[i] === undefined) return 1;
    if (pb[i] === undefined) return -1;
    return pa[i] < pb[i] ? -1 : 1;
  }
  return 0;
}

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();

function tryRun(cmd, args, opts) {
  try {
    return { ok: true, out: run(cmd, args, opts) };
  } catch (err) {
    return { ok: false, out: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

async function main() {
  const dry = !!process.env.DRY_RUN;
  const log = (msg) => console.log(dry ? `[dry-run] ${msg}` : msg);

  const meta = JSON.parse(run('npm', ['view', NPM_NAME, '--json']));
  const versions = [...meta.versions].sort(cmpSemver);
  const latest = meta['dist-tags'].latest;

  const commits = run('git', ['log', '--reverse', '--format=%H %cI'])
    .split('\n')
    .map((l) => {
      const [sha, time] = l.split(' ');
      return { sha, time: new Date(time).toISOString() };
    });
  const hasCommit = (sha) => tryRun('git', ['cat-file', '-e', `${sha}^{commit}`]).ok;
  const remoteTags = new Set(
    run('git', ['ls-remote', '--tags', 'origin'])
      .split('\n')
      .filter(Boolean)
      .map((l) => l.split('refs/tags/')[1].replace(/\^\{\}$/, '')),
  );
  const releases = dry
    ? new Set()
    : new Set(
        JSON.parse(run('gh', ['release', 'list', '--limit', '1000', '--json', 'tagName'])).map(
          (r) => r.tagName,
        ),
      );
  const changelog = readFileSync('CHANGELOG.md', 'utf8');

  const work = mkdtempSync(join(tmpdir(), 'pf-sync-'));
  const npmrc = join(work, '.npmrc');
  writeFileSync(
    npmrc,
    `@pocketsflow:registry=${GH_REGISTRY}\n//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}\n`,
  );

  let prevSha = null;
  let changed = 0;
  try {
    for (const version of versions) {
      const tag = `v${version}`;
      const info = JSON.parse(run('npm', ['view', `${NPM_NAME}@${version}`, '--json']));
      const publishedAt = meta.time[version];
      const { sha, exact } = pickCommit(info.gitHead, publishedAt, commits, hasCommit);

      if (!remoteTags.has(tag)) {
        log(`tag ${tag} -> ${sha.slice(0, 7)}${exact ? '' : ' (closest commit)'}`);
        if (!dry) {
          run('git', ['tag', '-f', tag, sha]);
          run('git', ['push', 'origin', `refs/tags/${tag}`]);
        }
        changed++;
      }

      let tarball = null;
      const needTarball = () => {
        if (!tarball) {
          const name = run('npm', ['pack', `${NPM_NAME}@${version}`, '--silent'], { cwd: work })
            .split('\n')
            .at(-1);
          tarball = join(work, name);
        }
        return tarball;
      };

      if (!releases.has(tag)) {
        const range = prevSha && prevSha !== sha ? [`${prevSha}..${sha}`] : [sha, '-1'];
        const commitLines = tryRun('git', ['log', ...range, '--no-merges', '--format=- %s (%h)'])
          .out.split('\n')
          .filter((l) => l.startsWith('- '));
        const notes = releaseNotes({
          version,
          section: changelogSection(changelog, version),
          commitLines,
          exact,
          gitHead: info.gitHead,
          publishedAt,
        });
        log(`release ${tag}${version === latest ? ' (latest)' : ''}`);
        if (!dry) {
          const notesFile = join(work, `notes-${version}.md`);
          writeFileSync(notesFile, notes);
          run('gh', [
            'release',
            'create',
            tag,
            needTarball(),
            '--verify-tag',
            '--title',
            tag,
            '--notes-file',
            notesFile,
            `--latest=${version === latest}`,
          ]);
        }
        changed++;
      }

      const onGithub = dry
        ? { ok: false, out: 'E404' }
        : tryRun('npm', ['view', `${GH_NAME}@${version}`, 'version', '--userconfig', npmrc]);
      if (!onGithub.ok && !/E404|404 Not Found/.test(onGithub.out)) {
        throw new Error(`GitHub Packages lookup failed for ${version}: ${onGithub.out}`);
      }
      if (!onGithub.ok || !onGithub.out) {
        log(`GitHub Packages ${GH_NAME}@${version}`);
        if (!dry) {
          const dir = join(work, `pkg-${version}`);
          run('mkdir', ['-p', dir]);
          run('tar', ['-xzf', needTarball(), '-C', dir]);
          const pkgFile = join(dir, 'package', 'package.json');
          const pkg = toGithubPackageJson(JSON.parse(readFileSync(pkgFile, 'utf8')));
          writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`);
          run(
            'npm',
            [
              'publish',
              '--ignore-scripts',
              '--userconfig',
              npmrc,
              '--tag',
              version === latest ? 'latest' : 'previous',
            ],
            { cwd: join(dir, 'package') },
          );
        }
        changed++;
      }

      prevSha = sha;
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
  log(
    changed
      ? `${changed} change(s) across ${versions.length} npm versions`
      : `in sync (${versions.length} versions)`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message ?? err);
    process.exit(1);
  });
}
