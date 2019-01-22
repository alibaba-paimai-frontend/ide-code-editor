import * as React from 'react';
import { render } from 'react-dom';
import { CodeEditor, ICodeEditorProps, CodeEditorFactory } from '../src/';
const { CodeEditorWithStore, client } = CodeEditorFactory();

const editor: ICodeEditorProps = {
  language: 'javascript'
};

function onChange(value) {
  console.log('当前编辑器的值：', value);
}

function onClick() {
  client.put('/editor',{name:'height', value:200})
}

render(<CodeEditor {...editor} onChange={onChange} />, document.getElementById(
  'example'
) as HTMLElement);

render(
  <div>
    <button onClick={onClick}>点击发送</button>
    <CodeEditorWithStore onChange={onChange} />
  </div>,
  document.getElementById('reactive') as HTMLElement
);
