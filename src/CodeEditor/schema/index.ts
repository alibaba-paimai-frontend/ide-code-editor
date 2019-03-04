import {
  cast,
  types,
  Instance,
  IAnyModelType,
  applySnapshot,
  SnapshotOrInstance
} from 'mobx-state-tree';

import { pick } from 'ide-lib-utils';
import { BaseModel, TBaseControlledKeys, BASE_CONTROLLED_KEYS } from 'ide-lib-base-component';

import { debugModel } from '../../lib/debug';
import { isNumeric } from '../../lib/util';
import { updateModelAttribute } from './util';


export enum ECodeLanguage {
  JSON = 'json',
  JS = 'javascript',
  TS = 'typescript'
}
export const CODE_LANGUAGES = Object.values(ECodeLanguage);



// 获取被 store 控制的 model key 的列表
export type TCodeEditorControlledKeys =
  keyof SnapshotOrInstance <typeof CodeEditorModel> | TBaseControlledKeys;

// 定义被 store 控制的 model key 的列表，没法借用 ts 的能力动态从 TCodeEditorControlledKeys 中获取
export const CONTROLLED_KEYS: string[] = BASE_CONTROLLED_KEYS.concat([
  'visible',
  'wait',
  'width',
  'height',
  'editorTheme',
  'language',
  'value',
  'options'
]);


/**
 * CodeEditor 对应的模型
 */
export const CodeEditorModel = BaseModel
  .named('CodeEditorModel')
  .props({
    visible: types.optional(types.boolean, true),
    wait: types.optional(types.number, 1),
    width: types.optional(types.union(types.number, types.string), 800),
    height: types.optional(types.union(types.number, types.string), 600),
    editorTheme: types.optional(types.string, 'vs-dark'),
    language: types.optional(
      types.enumeration('Type', CODE_LANGUAGES),
      ECodeLanguage.JS
    ),
    value: types.optional(types.string, ''),
    options: types.map(types.union(types.boolean, types.string))
    // language: types.optional(
    //   types.enumeration('Type', CODE_LANGUAGES),
    //   ECodeLanguage.JS
    // ),
    // children: types.array(types.late((): IAnyModelType => SchemaModel)) // 在 mst v3 中， `types.array` 默认值就是 `[]`
    // options: types.map(types.union(types.boolean, types.string))
    // 在 mst v3 中， `types.map` 默认值就是 `{}`
    //  ide 的 Options 可选值参考： https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
  })
  .views(self => {
    return {
      /**
       * 只返回当前模型的属性，可以通过 filter 字符串进行属性项过滤
       */
      allAttibuteWithFilter(filterArray: string | string[] = CONTROLLED_KEYS) {
        const filters = [].concat(filterArray || []);
        return pick(self, filters);
      }
    };
  })
  .actions(self => {
    return {
      setVisible(v: boolean | string) {
        self.visible = v === true || v === 'true';
      },
      setWait(w: number) {
        self.wait = +w;
      },
      setWidth(w: number | string) {
        self.width = isNumeric(w) ? +w : w; // 用户有可能传入的是 '123' 字符，需要转换成数字
      },
      setHeight(h: number | string) {
        self.height = isNumeric(h) ? +h : h;
      },
      setLanguage(l: ECodeLanguage) {
        self.language = l;
      },
      setValue(code: string) {
        self.value = code;
      },
      // 更新整个 options
      setOptions(attrOrObject: string | object) {
        let attrObject = attrOrObject || {};
        // 如果
        if (typeof attrOrObject === 'string') {
          attrObject = JSON.parse(attrOrObject);
        }

        self.options = attrObject as typeof self.options;
      }
    };
  })
  .actions(self => {
    return {
      updateAttribute(name: string, value: any) {
        return updateModelAttribute(self as ICodeEditorModel, name, value);
      },
      // 更新某一项 option
      updateOption(name: string, value: any) {
        self.options.set(name, value);
      }
    };
  });

export interface ICodeEditorModel extends Instance<typeof CodeEditorModel> { }

