import { types, Instance } from 'mobx-state-tree';
import { debugModel } from '../../lib/debug';
import { pick } from '../../lib/util';
import { updateEditor } from './util';

export enum ECodeLanguage {
  JSON = 'json',
  JS = 'javascript',
  TS = 'typescript'
}

export const CODE_LANGUAGES = Object.values(ECodeLanguage);

/**
 * 编辑器模型
 */
export const CodeEditorModel = types
  .model('CodeEditorModel', {
    visible: types.optional(types.boolean, true),
    wait: types.optional(types.number, 1),
    width: types.optional(types.union(types.number, types.string), 800),
    height: types.optional(types.union(types.number, types.string), 600),
    theme: types.optional(types.string, 'vs-dark'),
    language: types.optional(
      types.enumeration('Type', CODE_LANGUAGES),
      ECodeLanguage.JS
    ),
    value: types.optional(types.string, ''),
    options: types.map(types.union(types.boolean, types.string))
    // 在 mst v3 中， `types.map` 默认值就是 `{}`
    //  ide 的 Options 可选值参考： https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
  })
  .views(self => {
    return {
      /**
       * 只返回所有的节点的属性子集合
       * 依赖：children
       */
      allConfigWithFilter(filterArray?: string | string[]) {
        if (!filterArray) return self;
        const filters = [].concat(filterArray || []);
        return pick(self, filters);
      }
    };
  })
  .actions(self => {
    return {
      setVisible(v: boolean | string){
        self.visible = v === true || v === 'true'
      },
      setWait(w: number) {
        self.wait = w;
      },
      setWidth(w: number | string) {
        self.width = w;
      },
      setHeight(h: number | string) {
        self.height = h;
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
        updateEditor(self as ICodeEditorModel, name, value);
      },
      // 更新某一项 option
      updateOption(name: string, value: any) {
        self.options.set(name, value);
      }
    };
  });

export interface ICodeEditorModel extends Instance<typeof CodeEditorModel> {}
