export default { 
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-empty': [0, 'never'],
    'subject-empty': [0, 'never'],
    'type-enum': [0, 'never'],
    'subject-case': [0, 'never']
  }
};
