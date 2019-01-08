import * as React from 'react';
import { render } from 'react-dom';
import { CodeEditor } from '../src/';
import { MonacoEditorProps } from 'react-monaco-editor';

const editor: MonacoEditorProps = {
  language: 'javascript'
};

function onChange(value) {
  console.log('当前编辑器的值：', value);
}

render(<CodeEditor {...editor} onChange={onChange} />, document.getElementById(
  'example'
) as HTMLElement);
