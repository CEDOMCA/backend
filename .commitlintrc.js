// The commit message must have the following format:
/*
<type>([optional scope]): <description>

[optional body]

[optional footer(s)]
*/
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Warns if the body message is longer than 100 characters.
    'body-max-line-length': [1, 'always', 100],
    // Warns if no scope were given to the commit message header.
    'scope-empty': [1, 'never'],
    // Errors if not of the pre-defined scopes were given
    // Multiple scopes can be passed in a CSV way.
    'scope-enum': [
      1,
      'always',
      [
        'deps',
        'deps-dev',
        // First-level directories from root directory
        'vscode',
        'readme',
        'husky',
        'github',
      ],
    ],
  },
};
