import {cors} from 'hono/cors';
import {Hono} from 'hono';
import {zValidator} from '@hono/zod-validator';
import {z} from 'zod';
import { addCurrency, addCurrencyInputType } from './procs/addCurrency';
import { spin } from './procs/spin';

const port = process.env.PORT || 3000;
const app = new Hono();
app.use("/*", cors());

const route = app.get('/addCurrency', async (c) => {
  return c.jsonT({ok: true, message: 'added!'});
})
.post('/addCurrency', 
  async (c) => {
    console.log('POST ADD CURRENCY');
  return c.jsonT(await addCurrency(c));
})
.post('/spin', 
  async (c) => {
    return c.jsonT(await spin(c));
  }
);
// .get('/spin', 
// async (c) => {
//   return c.jsonT(await getSpinResult(c));
// }
// );

export default {
  port,
  fetch: app.fetch,
  signal: AbortSignal.timeout(1000),
};

export type ServerType = typeof route;