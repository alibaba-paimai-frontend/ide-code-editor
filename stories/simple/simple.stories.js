import React from 'react';
import { storiesOf } from '@storybook/react';
import { wInfo } from '../../.storybook/utils';

import { CodeEditor, createModel } from '../../src/';

import mdMobx from './simple-mobx.md';
import mdPlain from './simple-plain.md';

const editorNormal = {
  width: 400,
  language: 'javascript'
};
const editorModel = createModel(editorNormal);

function onChange(value) {
  console.log('当前编辑器的值：', value);
}

const clickBtn = target => () => {
  if (target && target.setWidth) {
    target.setWidth(1000);
  } else {
    target.width = 1000;
  }
};

storiesOf('基础使用', module)
  .addParameters(wInfo(mdMobx))
  .addWithJSX('使用 mobx 对象', () => (
    <div>
      <button onClick={clickBtn(editorModel)}>调整宽度（会响应）</button>
      <CodeEditor width={editorModel.width} onChange={onChange} />
    </div>
  ))
  .addParameters(wInfo(mdPlain))
  .addWithJSX('普通 menu 对象', () => (
    <div>
      <button onClick={clickBtn(editorNormal)}>调整宽度（不会响应）</button>
      <CodeEditor {...editorNormal} onChange={onChange} />
    </div>
  ));
