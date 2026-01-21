import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.app.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      // Vue规则
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'error',

      // TypeScript规则
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // 通用规则
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // 禁用一些过于严格的规则
      'no-undef': 'off', // TypeScript 会处理这个
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vue.vueParser,
      parserOptions: {
        parser: typescriptParser,
        sourceType: 'module',
        ecmaVersion: 2022,
        extraFileExtensions: ['.vue']
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        HTMLElement: 'readonly',
        KeyboardEvent: 'readonly',
        TouchEvent: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      // Vue特定规则
      'vue/multi-word-component-names': 'off', // 允许单词组件名
      'vue/require-v-for-key': 'error',
      'vue/no-use-v-if-with-v-for': 'error',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase']
    }
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      // JavaScript文件规则
      '@typescript-eslint/no-var-requires': 'off'
    }
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      '.git/',
      '*.config.{js,ts}',
      'src/test/setup.ts'
    ]
  }
]