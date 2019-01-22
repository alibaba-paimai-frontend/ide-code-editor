import { types, Instance } from 'mobx-state-tree';
import { CodeEditorModel, ICodeEditorModel } from './index';
import { createEmptyModel } from './util';

export const STORE_ID_PREIX = 'sce_';

export const Stores = types
  .model('StoresModel', {
    id: types.refinement(
      types.identifier,
      identifier => identifier.indexOf(STORE_ID_PREIX) === 0
    ),
    editor: CodeEditorModel
  })
  .actions(self => {
    return {
      setEditor(editor: ICodeEditorModel) {
        self.editor = editor;
      }
    };
  });

export interface IStoresModel extends Instance<typeof Stores> {}

let autoId = 1;
/**
 * 工厂方法，用于创建 stores
 */
export function StoresFactory(): IStoresModel {
  return Stores.create({
    id: `${STORE_ID_PREIX}${autoId++}`,
    editor: createEmptyModel() as any
  });
}
