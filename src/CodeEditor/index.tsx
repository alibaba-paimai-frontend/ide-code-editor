import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MonacoEditor, {
  EditorDidMount,
  MonacoEditorProps,
  ChangeHandler
} from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
// import debounce from 'lodash.debounce';
import { debounce } from 'ts-debounce';

import { StoresFactory, IStoresModel } from './schema/stores';
import { AppFactory } from './controller/index';
import { debugInteract } from '../lib/debug';
import { EditorWrap } from './styles';

export interface ICodeEditorEvent {
  editorDidMount?: EditorDidMount;
  onChange?: ChangeHandler;
}

export interface ICodeEditorProps extends ICodeEditorEvent, MonacoEditorProps {
  /**
   * debounce 等待时间，默认 0.5 秒
   */
  wait?: number;

  /**
   * 是否显示编辑器
   */
  visible?: boolean;
}

@observer
export class CodeEditor extends Component<ICodeEditorProps> {
  constructor(props: ICodeEditorProps) {
    super(props);
    this.state = {};
  }

  editorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor
  ) => {
    debugInteract('editorDidMount: %o', editor as any);
    const { editorDidMount } = this.props;
    editorDidMount && editorDidMount(editor, monaco);
  };

  debounceChange = () => {
    const { wait = 1, onChange } = this.props;
    return debounce(
      (newValue: string, e: monacoEditor.editor.IModelContentChangedEvent) => {
        debugInteract('onChange:', newValue, e as any);
        onChange && onChange(newValue, e);
      },
      wait * 1000,
      {
        isImmediate: false
      }
    );
  };

  render() {
    const {
      value,
      options,
      width = 800,
      height = 600,
      language = 'javascript',
      visible = true,
      theme = 'vs-dark'
    } = this.props;

    return (
      <EditorWrap className="code-editor-wrap" visible={visible}>
        <MonacoEditor
          width={width}
          height={height}
          language={language}
          theme={theme}
          value={value}
          options={options}
          onChange={this.debounceChange()}
          editorDidMount={this.editorDidMount}
        />
      </EditorWrap>
    );
  }
}

/* ----------------------------------------------------
    以下是专门配合 store 时的组件版本
----------------------------------------------------- */

export const onChangeWithStore = (stores: IStoresModel, onChange: ChangeHandler) => (
  newValue: string,
  e: monacoEditor.editor.IModelContentChangedEvent
) => {
  stores.editor.setValue(newValue);
  onChange && onChange(newValue, e);
};

/**
 * 科里化创建 CodeEditorWithStore 组件
 * @param stores - store 模型实例
 */
export const CodeEditorAddStore = (stores: IStoresModel) =>
  observer(function CodeEditorWithStore(props: ICodeEditorProps) {
    const { editor } = stores;
    const { onChange, ...otherProps } = props;
    return (
      <CodeEditor
        visible={editor.visible}
        wait={editor.wait}
        width={editor.width}
        height={editor.height}
        language={editor.language}
        theme={editor.theme}
        value={editor.value}
        options={editor.options.toJSON() as any}
        onChange={onChangeWithStore(stores, onChange)}
        {...otherProps}
      />
    );
  });
/**
 * 工厂函数，每调用一次就获取一副 MVC
 * 用于隔离不同的 CodeEditorWithStore 的上下文
 */
export const CodeEditorFactory = () => {
  const stores = StoresFactory(); // 创建 model
  const app = AppFactory(stores); // 创建 controller，并挂载 model
  return {
    stores,
    app,
    client: app.client,
    CodeEditorWithStore: CodeEditorAddStore(stores)
  };
};
