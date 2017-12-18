const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  root: true,
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  rules: {
    'arrow-parens': OFF,
    'brace-style': [ERROR, 'stroustrup'],
    'camelcase': OFF,
    'eol-last': OFF,
    'indent': [ERROR, 4, { 'SwitchCase': 1 }],
    'keyword-spacing': OFF,
    'no-debugger': process.env.NODE_ENV === 'production' ? ERROR : OFF,
    'no-multiple-empty-lines': OFF,
    'no-trailing-spaces': OFF,
    'operator-linebreak': OFF,
    'padded-blocks': OFF,
    'semi': OFF,
    // Turned off spaces before pern because of broken Beautify formating for JS inside script tag
    'space-before-function-paren': OFF,
    'space-infix-ops': OFF,
    'spaced-comment': OFF
  }
};
