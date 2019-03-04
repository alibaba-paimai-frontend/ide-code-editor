import React from 'react';
import { storiesOf } from '@storybook/react';
import { Row, Col, Input, Button, Select } from 'antd';
import { wInfo } from '../../../.storybook/utils';
import mdPutNode from './put.md';

import { CodeEditorFactory } from '../../../src';
import { editorConfigGen } from '../../helper';

const { CodeEditorWithStore, client } = CodeEditorFactory();

const { Option } = Select;
const styles = {
  demoWrap: {
    display: 'flex',
    width: '100%'
  }
};

let selectedAttrName = '';

const createNew = client => () => {
  const config = editorConfigGen();
  client.post('/editor', { config: config });
};

function onChange(value) {
  console.log('当前编辑器的值：', value);
}

function handleChange(value) {
  console.log(`selected ${value}`);
  selectedAttrName = value;
}

function updateOption() {
  const origin = document.getElementById('optionKey').value;
  if (!origin) {
    document.getElementById('info').innerText = '请输入 option key 值';
    return;
  }

  const target = document.getElementById('targeOptionValue').value;
  if (!target) {
    document.getElementById('info').innerText = '请输入属性值';
    return;
  }

  // 更新节点属性，返回更新后的数值
  client
    .put(`/editor/options`, { name: origin, value: target })
    .then(res => {
      const { status } = res;
      if (status === 200) {
        client.get(`/editor`).then(res => {
          const { status, body } = res;
          if (status === 200) {
            const config = body.config || {};
            document.getElementById('info').innerText =
              `更新操作：; \n` + JSON.stringify(config, null, 4);
          }
        });
      }
    })
    .catch(err => {
      document.getElementById('info').innerText =
        `更新失败： \n` + JSON.stringify(err, null, 4);
    });
}

function updateAttr() {
  if (!selectedAttrName) {
    document.getElementById('info').innerText = '请选择要更改的属性';
    return;
  }

  const value = document.getElementById('targeValue').value;

  // 更新节点属性，返回更新后的数值
  client
    .put(`/editor`, { name: selectedAttrName, value: value })
    .then(res => {
      const { status, body } = res;
      if (status === 200) {
        client.get(`/editor`).then(res => {
          const { status, body } = res;
          if (status === 200) {
            const config = body.config || {};
            document.getElementById('info').innerText =
              `更新操作：; \n` + JSON.stringify(config, null, 4);
          }
        });
      }
    })
    .catch(err => {
      document.getElementById('info').innerText =
        `更新失败： \n` + JSON.stringify(err, null, 4);
    });
}
storiesOf('API - put', module)
  .addParameters(wInfo(mdPutNode))
  .addWithJSX('/editor 更改编辑器属性', () => {
    return (
      <Row style={styles.demoWrap}>
        <Col span={10} offset={2}>
          <Row>
            <Col span={4}>
              <Input placeholder="属性名" id="optionKey" />
            </Col>
            <Col span={6}>
              <Input placeholder="新属性值" id="targeOptionValue" />
            </Col>
            <Col span={10}>
              <Button onClick={updateOption}>更改 Option</Button>
            </Col>
          </Row>

          <Row>
            <Col span={4}>
              <Select
                style={{ width: 200 }}
                onChange={handleChange}
                placeholder="要更改的属性"
              >
                <Option value="visible">visible</Option>
                <Option value="width">width</Option>
                <Option value="height">height</Option>
                <Option value="editorTheme">editorTheme</Option>
                <Option value="language">language</Option>
                <Option value="value">value</Option>
                <Option value="wait">wait</Option>
                <Option value="options">options</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Input placeholder="新属性值" id="targeValue" />
            </Col>
            <Col span={10}>
              <Button onClick={updateAttr}>更改信息</Button>
              <Button onClick={createNew(client)}>随机创建编辑器</Button>
            </Col>
          </Row>

          <CodeEditorWithStore onChange={onChange} />
        </Col>
        <Col span={12}>
          <div id="info" />
        </Col>
      </Row>
    );
  });
