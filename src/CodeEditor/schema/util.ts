import {invariant} from 'ide-lib-utils';
import { updateInScope, BASE_CONTROLLED_KEYS } from 'ide-lib-base-component';

import { debugModel } from '../../lib/debug';
import { CODE_LANGUAGES } from './index';
import { ICodeEditorProps, ICodeEditorModel, CodeEditorModel, IStoresModel, DEFAULT_PROPS } from '../../index';

/**
 * 将普通对象转换成 Model
 * @param modelObject - 普通的对象
 */
export function createModel(modelObject: ICodeEditorProps = DEFAULT_PROPS): ICodeEditorModel {
  const mergedProps = Object.assign({}, DEFAULT_PROPS, modelObject);

  invariant(
    !modelObject.language || !!~CODE_LANGUAGES.indexOf(modelObject.language),
    `当前并不支持 ${modelObject.language} 语言（支持的语言有：${CODE_LANGUAGES.join(
      ','
    )}）`
  );
  const { theme, styles } = mergedProps;

  const model = CodeEditorModel.create({
    width: mergedProps.width,
    height: mergedProps.height,
    language: mergedProps.language,
    value: mergedProps.value,
    editorTheme: mergedProps.editorTheme,
    options: (mergedProps.options as any) || {}
  });
  model.setStyles(styles || {});
  model.setTheme(theme);

  return model;
}

/**
 * 创建新的空白
 */
export function createEmptyModel() {
  return createModel({});
}

/* ----------------------------------------------------
    更新指定 enum 中的属性
----------------------------------------------------- */

// 定义 menu 可更新信息的属性
const EDITABLE_ATTRIBUTE = BASE_CONTROLLED_KEYS.concat([
  'visible',
  'height',
  'width',
  'value',
  'wait',
  'editorTheme',
  'language',
  'options'
]);

export const updateModelAttribute = updateInScope(EDITABLE_ATTRIBUTE);
