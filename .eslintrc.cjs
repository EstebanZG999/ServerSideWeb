module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, 
  },
  extends: 'airbnb-base', 
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  "rules": {
    "semi": ["error", "never"],
    "object-curly-newline": "off", 
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "ignorePackages" 
      }
    ],
    "no-console": 0
  },
  overrides: [
    {
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script', 
      },
    },
  ],
};
