import Router from 'ette-router';
import { IContext } from './helper';

export const router = new Router();

// 移除
// (router as any).del('editor', '/editor', function(ctx: IContext) {
//   const { stores } = ctx;
//   // ctx.response.body = {
//   //   node: stores.resetToEmpty()
//   // };
//   ctx.response.status = 200;
// });
