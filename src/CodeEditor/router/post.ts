import Router from 'ette-router';
import { IContext } from './helper';

import { createModel } from '../schema/util';

export const router = new Router();

// 获取所有的节点
(router as any).post('editor', '/editor', function (ctx: IContext) {
  const { stores, request } = ctx;
  const { config } = request.data;

  stores.setEditor(createModel(config));
  // stores.setSchema(createSchemaModel(schema));

  ctx.response.status = 200;
});
