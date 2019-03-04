const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const COMMON_EXTERNALS = {
  react: {
    commonjs: 'react',
    commonjs2: 'react',
    amd: 'react',
    root: 'React'
  },
  'react-dom': {
    commonjs: 'react-dom',
    commonjs2: 'react-dom',
    amd: 'react-dom',
    root: 'ReactDOM'
  },
  antd: 'antd',
  mobx: 'mobx',
  'mobx-react': {
    commonjs: 'mobx-react',
    commonjs2: 'mobx-react',
    amd: 'mobx-react',
    root: 'mobxReact'
  },
  'mobx-state-tree': {
    commonjs: 'mobx-state-tree',
    commonjs2: 'mobx-state-tree',
    amd: 'mobx-state-tree',
    root: 'mobxStateTree'
  },
  'ss-tree': {
    commonjs: 'ss-tree',
    commonjs2: 'ss-tree',
    amd: 'ss-tree',
    root: 'ssTree'
  },
  'styled-components': {
    commonjs: 'styled-components',
    commonjs2: 'styled-components',
    amd: 'styled-components',
    root: 'styled'
  },
  "ide-lib-utils": {
    "commonjs": "ide-lib-utils",
    "commonjs2": "ide-lib-utils",
    "amd": "ide-lib-utils",
    "root": "ideLibUtils"
  },
  "ide-lib-base-component": {
    "commonjs": "ide-lib-base-component",
    "commonjs2": "ide-lib-base-component",
    "amd": "ide-lib-base-component",
    "root": "ideBaseComponent"
  }
};


const ALL_EXTERNALS = Object.assign({}, COMMON_EXTERNALS, {
  'ss-tree': {
    commonjs: 'ss-tree',
    commonjs2: 'ss-tree',
    amd: 'ss-tree',
    root: 'ssTree'
  }
});

const COMMON_LIBS = Object.keys(COMMON_EXTERNALS);

module.exports = {
  COMMON_EXTERNALS,
  getExternal: function (extraLibs = [], directUse = false) {
    const libs = COMMON_LIBS.concat(extraLibs);
    const externals = {};
    libs.forEach(lib => {
      externals[lib] = directUse
        ? ALL_EXTERNALS[lib]
        : (ALL_EXTERNALS[lib] && ALL_EXTERNALS[lib].root) || lib;
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
