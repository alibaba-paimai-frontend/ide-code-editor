import { CodeEditorModel, ICodeEditorModel, CODE_LANGUAGES } from './index';
import { invariant, capitalize } from '../../lib/util';
import { debugModel } from '../../lib/debug';
import { MonacoEditorProps } from 'react-monaco-editor';
import { IStoresModel } from './stores';

/**
 * 将普通对象转换成 menu Model
 * @param menu - 普通的 menu 对象
 */
export function createModel(editor: MonacoEditorProps): ICodeEditorModel {
  invariant(!!editor, 'editor 对象不能为空');
  invariant(
    !editor.language || !!~CODE_LANGUAGES.indexOf(editor.language),
    `当前并不支持 ${editor.language} 语言（支持的语言有：${CODE_LANGUAGES.join(
      ','
    )}）`
  );

  const editorModel = CodeEditorModel.create({
    width: editor.width,
    height: editor.height,
    language: editor.language,
    value: editor.value,
    theme: editor.theme,
    options: (editor.options as any) || {}
  });

  //   menuModel.addMenuItems(items);

  return editorModel;
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
const update = (valueSet: string[]) => (
  item: ICodeEditorModel | IStoresModel,
  attrName: string,
  value: any
): boolean => {
  invariant(!!item, '入参 item 必须存在');
  // 如果不是可更新的属性，那么将返回 false
  if (!valueSet.includes(attrName)) {
    debugModel(
      `[更新属性] 属性名 ${attrName} 不属于可更新范围，无法更新成 ${value} 值；（附:可更新属性列表：${valueSet}）`
    );
    return false;
  }

  const functionName = `set${capitalize(attrName)}`; // 比如 attrName 是 `type`, 则调用 `setType` 方法
  (item as any)[functionName](value);
  return true;
};

// 定义 menu 可更新信息的属性
const EDITOR_EDITABLE_ATTRIBUTE = [
  'visible',
  'height',
  'width',
  'value',
  'wait',
  'theme',
  'language',
  'options'
];

export const updateEditor = update(EDITOR_EDITABLE_ATTRIBUTE);
