import React from 'react';
import { storiesOf } from '@storybook/react';
import { Row, Col, Button } from 'antd';
import { wInfo } from '../../../.storybook/utils';
import mdGet from './get.md';

import { CodeEditorFactory } from '../../../src';
import { editorConfigGen } from '../../helper';

const {
  CodeEditorWithStore: CodeEditorWithStore1,
  client: client1
} = CodeEditorFactory();

// const {
//   CodeEditorWithStore: CodeEditorWithStore2,
//   client: client2
// } = CodeEditorFactory();

const styles = {
  demoWrap: {
    display: 'flex',
    width: '100%'
  }
};

let config = {};

const getInfo = (client, filter) => () => {
  const query = filter && filter.length ? `filter=${filter.join(',')}` : '';
  client.get(`/editor?${query}`).then(res => {
    const { status, body } = res;
    if (status === 200) {
      config = body.config;
    }

    document.getElementById('info').innerText = JSON.stringify(config, null, 4);
  });
};

const createNew = client => () => {
  const config = editorConfigGen({});
  client.post('/editor', { config: config });
};

function onChange(value) {
  console.log('当前编辑器的值：', value);
}
storiesOf('API - get', module)
  .addParameters(wInfo(mdGet))
  .addWithJSX('/editor 获取编辑器属性信息', () => {
    return (
      <Row style={styles.demoWrap}>
        <Col span={10} offset={2}>
          <Button onClick={getInfo(client1)}>获取信息</Button>
          <Button onClick={getInfo(client1, ['width', 'value'])}>
            获取指定信息(width, value)
          </Button>
          <Button onClick={createNew(client1)}>随机创建编辑器</Button>

          <CodeEditorWithStore1 onChange={onChange} />
        </Col>
        <Col span={12}>
          <div id="info" />
        </Col>
      </Row>
    );
  });
