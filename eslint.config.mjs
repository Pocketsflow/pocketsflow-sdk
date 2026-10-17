// ESLint flat config for the SDK source (`npm run lint`).
import tseslint from 'typescript-eslint';

export default tseslint.config(...tseslint.configs.recommended, {
  rules: {
    // The client passes request bodies and legacy responses through untyped.
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
