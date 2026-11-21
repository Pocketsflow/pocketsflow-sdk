# Publishing the Pocketsflow SDK

## How a release is published (automatic)

Merging a release PR to `main` publishes it. The **Publish to npm** workflow
(`.github/workflows/publish.yml`) runs on every push to `main`: when the
`version` in `package.json` is not on npm yet, it checks that `CHANGELOG.md`
has its `## <version>` section, runs `npm ci`, lint, typecheck and the tests,
then `npm publish`. A version npm already has is skipped, so any other push to
`main` publishes nothing. It can also be run by hand from the Actions tab.

A release PR therefore carries:

1. the code change,
2. the new `version` in `package.json` (and `package-lock.json`): patch for
   fixes, minor for new backward-compatible methods or fields, major for
   breaking removals or renames,
3. its `## <version>` section at the top of `CHANGELOG.md`.

### One-time setup

The workflow reads the repository secret **`NPM_TOKEN`** (Settings > Secrets
and variables > Actions): a granular npm access token with read and write
access to the `pocketsflow` package, with "Bypass 2FA" on. Without it the
publish step fails with a clear error and nothing is published.

### Publishing by hand (fallback)

Only if the workflow can't run: from a clean checkout of the `main` commit,

```bash
npm config set //registry.npmjs.org/:_authToken=YOUR_NPM_TOKEN
npm publish
```

`prepublishOnly` builds the package first.

## Verify

Check the package on NPM: https://www.npmjs.com/package/pocketsflow

## GitHub releases and GitHub Packages (automatic)

**Rule: npm and GitHub always carry the same versions** (see `CLAUDE.md`). A
release is not done until its GitHub release and package version exist.

The **Sync npm releases** workflow (`.github/workflows/sync-releases.yml`)
mirrors every npm version onto GitHub: right after **Publish to npm**
succeeds, on each push to `main`, every 6 hours, or on demand from the
Actions tab:

- a `v<version>` tag on the commit npm recorded for that publish (`gitHead`),
- a GitHub release with that version's `CHANGELOG.md` section (or its commits)
  and the exact npm tarball attached,
- the same package on GitHub Packages as `@pocketsflow/pocketsflow`.

It never changes what already exists, so it is safe to re-run. To see what it
would do without writing anything:

```bash
DRY_RUN=1 node scripts/sync-releases.mjs
```
