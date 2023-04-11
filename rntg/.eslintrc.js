module.exports = {
  root: true,
  extends: '@react-native-community',
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
  rules: {
    semi: [2, 'never'],
    'prettier/prettier': 0,
  },
}
