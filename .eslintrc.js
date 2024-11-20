/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    'max-len': ['error', { 
      'code': 80,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreComments': true
    }]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}