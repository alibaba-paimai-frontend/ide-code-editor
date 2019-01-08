import Router from 'ette-router';
import { IContext } from './helper';
export const router = new Router();


// 更新编辑器属性
(router as any).put('editor', '/editor', function (ctx: IContext) {
  const { stores, request } = ctx;
  const { name, value } = request.data;

  //   stores.setSchema(createSchemaModel(schema));
  const isSuccess = stores.editor.updateAttribute(
    name,
    value
  );
  ctx.response.body = {
    success: isSuccess
  };

  ctx.response.status = 200;
});

// 更新编辑器的 options 属性
(router as any).put('editor', '/editor/options', function (ctx: IContext) {
  const { stores, request } = ctx;
  const { name, value } = request.data;

  //   stores.setSchema(createSchemaModel(schema));
  const isSuccess = stores.editor.updateOption(name, value);
  ctx.response.body = {
    success: isSuccess
  };

  ctx.response.status = 200;
});
