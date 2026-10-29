# CLAUDE.md — Pocketsflow SDK

The `pocketsflow` npm package. Publishing steps: `PUBLISHING.md`. Gate before
any push: `npm test`, `npm run lint`, `npm run typecheck`.

## npm and GitHub stay in sync, always (non-negotiable)

Every `pocketsflow` version on npm must also exist here:

- a `v<version>` tag on the commit npm recorded for the publish (`gitHead`),
- a GitHub release with that version's `CHANGELOG.md` section and the npm
  tarball attached (npm's `latest` is GitHub's latest),
- the same version on GitHub Packages as `@pocketsflow/pocketsflow` (public).

`.github/workflows/sync-releases.yml` (`scripts/sync-releases.mjs`) does all of
it from npm, on every push to `main`, every 6 hours and on demand.

1. npm is the source of truth: publish to npm first, never only to GitHub.
2. Every release adds its `## <version>` section to `CHANGELOG.md` before it
   is published; that section becomes the GitHub release notes.
3. After `npm publish`, merge the release's commit to `main` (or run the
   workflow) and confirm the run is green and the release and package version
   are on GitHub. A release is not done until they are.
4. Never hand-make a tag, release or package version npm doesn't have, and
   never delete one npm still has.
5. A failing sync run blocks the release: fix the cause (or the script), never
   disable or skip the workflow.
6. Preview without writing anything: `DRY_RUN=1 node scripts/sync-releases.mjs`.
