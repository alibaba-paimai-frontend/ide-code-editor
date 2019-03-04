import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { pick } from 'ide-lib-utils';
import { based, Omit, IBaseTheme, IBaseComponentProps, IStoresEnv, useIndectedEvents } from 'ide-lib-base-component';
import MonacoEditor, {
  EditorDidMount,
  ChangeHandler
} from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { debounce } from 'ts-debounce';


import { debugInteract, debugRender } from '../lib/debug';
import { convertIfNumberic } from '../lib/util';
import { StyledContainer } from './styles';
import { AppFactory } from './controller/index';
import { StoresFactory, IStoresModel } from './schema/stores';
import { TCodeEditorControlledKeys, CONTROLLED_KEYS } from './schema/index'; 
import { updateEditorValue } from './solution';

interface ISubComponents {
  // SchemaTreeComponent: React.ComponentType<OptionalSchemaTreeProps>;
}

export interface ICodeEditorEvent {
  editorDidMount?: EditorDidMount;
  onChange?: ChangeHandler;
}

// export interface ICodeEditorStyles extends IBaseStyles {
//   container?: React.CSSProperties;
// }

export interface ICodeEditorTheme extends IBaseTheme{
  main: string;
}

export interface ICodeEditorProps extends ICodeEditorEvent, IBaseComponentProps{
  /**
   * 编辑器宽度
   */
  width?: number | string;

  /**
   * 编辑器高度
   */
  height?: number | string;

  /**
   * 编辑器语言
   */
  language?: string;

  /**
   * 编辑器主题
   */
  editorTheme?: string;

  /**
   * debounce 等待时间，默认 0.5 秒
   */
  wait?: number;

  /**
   * 编辑器内容
   */
  value?: string;

  /**
   * 是否显示编辑器
   */
  visible?: boolean;

  /**
   * monaco 编辑器选项
   */
  options?: Record<string, string>;



};


export const DEFAULT_PROPS: ICodeEditorProps = {
  wait: 0.5,
  width: 800,
  height : 600,
  language : 'javascript',
  visible : true,
  editorTheme : 'vs-dark',
  theme: {
    main: '#25ab68'
  },
  styles: {
    container: {}
  }
};

/**
 * 使用高阶组件打造的组件生成器
 * @param subComponents - 子组件列表
 */
export const CodeEditorHOC = (subComponents: ISubComponents) => {
  const CodeEditorHOC = (props: ICodeEditorProps = DEFAULT_PROPS) => {
    // const { SchemaTreeComponent } = subComponents;
    const mergedProps = Object.assign({}, DEFAULT_PROPS, props);
    const { value,
      wait,
      options,
      width,
      height ,
      language,
      visible,
      editorTheme,
      theme, styles } = mergedProps;


    const editorDidMount = useCallback((
      editor: monacoEditor.editor.IStandaloneCodeEditor,
      monaco: typeof monacoEditor
    ) => {
      debugInteract('editorDidMount: %o', editor as any);
      const { editorDidMount } = props;
      editorDidMount && editorDidMount(editor, monaco);
    }, []);

    const debounceChange = useCallback(() => {
      const { onChange } = props;
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
    }, [wait]);
    return (
        <StyledContainer
          style={styles.container}
          visible={visible}
          // ref={this.root}
          className="ide-code-editor-container"
        >
          <MonacoEditor
            width={convertIfNumberic(width)}
            height={convertIfNumberic(height)}
            language={language}
            theme={editorTheme}
            value={value}
            options={options}
            onChange={debounceChange()}
            editorDidMount={editorDidMount}
          />
        </StyledContainer>
    );
  };
  CodeEditorHOC.displayName = 'CodeEditorHOC';
  return observer(based(CodeEditorHOC));
};

// 采用高阶组件方式生成普通的 CodeEditor 组件
export const CodeEditor = CodeEditorHOC({
});

/* ----------------------------------------------------
    以下是专门配合 store 时的组件版本
----------------------------------------------------- */

/**
 * 科里化创建 CodeEditorWithStore 组件
 * @param stores - store 模型实例
 */
export const CodeEditorAddStore = (storesEnv: IStoresEnv<IStoresModel>) => {
  const {stores} = storesEnv;
  const CodeEditorHasSubStore = CodeEditorHOC({
  });

  const CodeEditorWithStore = (props: Omit<ICodeEditorProps, TCodeEditorControlledKeys>) => {
    const {
     ...otherProps} = props;
    const { model } = stores;
    const controlledProps = pick(model, CONTROLLED_KEYS);
    debugRender(`[${stores.id}] rendering`);


    const otherPropsWithInjected = useIndectedEvents<ICodeEditorProps, IStoresModel>(storesEnv, otherProps, {
      'onChange': [updateEditorValue]
  });

    return (
      <CodeEditorHasSubStore
        {...controlledProps}
        {...otherPropsWithInjected}
      />
    );
  };

  CodeEditorWithStore.displayName = 'CodeEditorWithStore';
  return observer(CodeEditorWithStore);
}

/**
 * 生成 env 对象，方便在不同的状态组件中传递上下文
 */
export const CodeEditorStoresEnv = () => {
  const { stores, innerApps } = StoresFactory(); // 创建 model
  const app = AppFactory(stores, innerApps); // 创建 controller，并挂载 model
  return {
    stores,
    app,
    client: app.client,
    innerApps: innerApps
  };
}

/**
 * 工厂函数，每调用一次就获取一副 MVC
 * 用于隔离不同的 CodeEditorWithStore 的上下文
 */
export const CodeEditorFactory = () => {
  const storesEnv = CodeEditorStoresEnv();
  return {
    ...storesEnv,
    CodeEditorWithStore: CodeEditorAddStore(storesEnv)
  }
};
