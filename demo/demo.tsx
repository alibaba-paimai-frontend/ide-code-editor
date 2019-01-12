import * as React from 'react';
import { render } from 'react-dom';
import { CodeEditor, ICodeEditorProps } from '../src/';

const editor: ICodeEditorProps = {
  language: 'javascript'
};

function onChange(value) {
  console.log('当前编辑器的值：', value);
}

render(<CodeEditor {...editor} onChange={onChange} />, document.getElementById(
  'example'
) as HTMLElement);
