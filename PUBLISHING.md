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
