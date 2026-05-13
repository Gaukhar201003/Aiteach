import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.rules'],
    languageOptions: {
      parser: firebaseRulesPlugin.preprocessors['.rules'],
    },
    plugins: {
      '@firebase/security-rules': firebaseRulesPlugin,
    },
    rules: {
      ...firebaseRulesPlugin.configs.recommended.rules,
    },
  },
  {
    ignores: ['dist/**/*']
  }
];
