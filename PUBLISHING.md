# Publishing the Pocketsflow SDK

## Prerequisites

1. Have an NPM account with access to the `pocketsflow` package
2. Have a granular access token with publish permissions (and "Bypass 2FA" enabled)

## Setup (First Time)

Set your NPM auth token:

```bash
npm config set //registry.npmjs.org/:_authToken=YOUR_NPM_TOKEN
```

## Publishing

1. Update the version in `package.json`:
   ```bash
   npm version patch  # for bug fixes (1.0.0 -> 1.0.1)
   npm version minor  # for new features (1.0.0 -> 1.1.0)
   npm version major  # for breaking changes (1.0.0 -> 2.0.0)
   ```

2. Publish to NPM:
   ```bash
   npm publish
   ```

The `prepublishOnly` script will automatically build the package before publishing.

## Verify

Check the package on NPM: https://www.npmjs.com/package/pocketsflow

## GitHub releases and GitHub Packages (automatic)

**Rule: npm and GitHub always carry the same versions** (see `CLAUDE.md`). A
release is not done until its GitHub release and package version exist.

You only publish to npm. The **Sync npm releases** workflow
(`.github/workflows/sync-releases.yml`) then mirrors every npm version onto
GitHub, on each push to `main`, every 6 hours, or on demand from the Actions
tab:

- a `v<version>` tag on the commit npm recorded for that publish (`gitHead`),
- a GitHub release with that version's `CHANGELOG.md` section (or its commits)
  and the exact npm tarball attached,
- the same package on GitHub Packages as `@pocketsflow/pocketsflow`.

It never changes what already exists, so it is safe to re-run. To see what it
would do without writing anything:

```bash
DRY_RUN=1 node scripts/sync-releases.mjs
```
