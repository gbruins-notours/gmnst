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
    'indent': [ERROR, 4],
    'no-debugger': process.env.NODE_ENV === 'production' ? ERROR : OFF,
    'no-multiple-empty-lines': OFF,
    'semi': OFF,
    // Turned off spaces before pern because of broken Beautify formating for JS inside script tag
    'space-before-function-paren': OFF
  }
};
