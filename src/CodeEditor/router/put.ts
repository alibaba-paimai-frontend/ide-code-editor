import Router from 'ette-router';
import { updateStylesMiddleware, updateThemeMiddleware } from 'ide-lib-base-component';

import { IContext } from './helper';


export const router = new Router();

// 更新编辑器属性
router.put('editor', '/editor', function (ctx: IContext) {
  const { stores, request } = ctx;
  const { name, value } = request.data;

  //   stores.setSchema(createSchemaModel(schema));
  const isSuccess = stores.model.updateAttribute(
    name,
    value
  );
  ctx.response.body = {
    success: isSuccess
  };

  ctx.response.status = 200;
});


// 更新编辑器的 options 属性
router.put('editor', '/editor/options', function (ctx: IContext) {
  const { stores, request } = ctx;
  const { name, value } = request.data;

  //   stores.setSchema(createSchemaModel(schema));
  const isSuccess = stores.model.updateOption(name, value);
  ctx.response.body = {
    success: isSuccess
  };

  ctx.response.status = 200;
});

// 更新 css 属性
router.put('model', '/model/styles/:target', updateStylesMiddleware('model'));

// 更新 theme 属性
router.put('model', '/model/theme/:target', updateThemeMiddleware('model'));
