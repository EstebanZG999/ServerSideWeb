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
  rules: {
    "semi": ["error", "never"],
    "import/extensions": ["error", "ignorePackages", {
      js: "never",
  }],
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
