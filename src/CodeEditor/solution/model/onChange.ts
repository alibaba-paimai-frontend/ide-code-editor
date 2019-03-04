import { message } from 'antd';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
// import { getValueByPath } from 'ide-lib-utils';
import { IStoresEnv } from 'ide-lib-base-component';
import { IStoresModel } from '../../schema/stores';
// import { RPATH } from '../../router/helper'

/**
 * 显示 list 列表项
 * @param env - IStoresEnv
 */
export const updateEditorValue = (env: IStoresEnv<IStoresModel>) => async (newValue: string, e: monacoEditor.editor.IModelContentChangedEvent) => {
    const { stores, client } = env;
    stores.model.setValue(newValue);
}

