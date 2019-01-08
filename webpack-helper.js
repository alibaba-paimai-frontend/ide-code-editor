const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const LIB_MAP = {
  react: 'React',
  'react-dom': 'ReactDOM',
  antd: 'antd',
  mobx: 'mobx',
  'mobx-react': 'mobxReact',
  'mobx-state-tree': 'mobxStateTree',
  'ss-tree': 'ssTree',
  'styled-components': 'styled'
};

const COMMON_LIBS = [
  'react',
  'react-dom',
  'antd',
  'mobx',
  'mobx-react',
  'mobx-state-tree',
  'ss-tree'
];

module.exports = {
  getExternal: function(isDev, extraLibs = []) {
    const libs = COMMON_LIBS.concat(extraLibs);
    const externals = {};
    libs.forEach(lib => {
      externals[lib] = isDev ? LIB_MAP[lib] || lib : lib;
    });
    return externals;
  },
  getMonacoPlugin: function() {
    return new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['json', 'javascript', 'typescript'],
      features: [
        'accessibilityHelp',
        'bracketMatching',
        'caretOperations',
        'clipboard',
        'codeAction',
        'codelens',
        'comment',
        'coreCommands',
        'contextmenu',
        'cursorUndo',
        'dnd',
        'find',
        'folding',
        'format',
        'goToDefinitionCommands',
        'goToDefinitionMouse',
        'gotoError',
        'gotoLine',
        'hover',
        'inPlaceReplace',
        'inspectTokens',
        'linesOperations',
        'links',
        'parameterHints',
        'quickCommand',
        'quickOutline',
        'referenceSearch',
        'rename',
        'smartSelect',
        'snippets',
        'suggest',
        'toggleHighContrast',
        'wordHighlighter',
        'wordOperations',
        'wordPartOperations'
      ]
    });
  }
};
