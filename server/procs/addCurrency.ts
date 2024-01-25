import { Context } from 'hono';
import {sc} from '../_shared/initSupabase';
import {createClient} from '@supabase/supabase-js';
import { z } from 'zod';
import { JSONObject } from 'hono/utils/types';
import { userPreamble } from '../_shared/preambles';

const currencyEnums = z.enum(['gold', 'spins', 'affection', 'shields', 'followers', 'sessions', 'conquests', 'rescues', 'conversions']);
export const addCurrencyInputType = z.object({
  currency: currencyEnums,
  power: z.number(),
  tokens: z.object({data: z.object({session: z.object({access_token: z.string(), refresh_token: z.string()})})}),
});

export async function addCurrency(c: Context) {
  try {
    const {jsonObject, user, userClient} = await userPreamble(c, addCurrencyInputType);
    let {data: bankData, error } = await userClient.from('bank').select('*').limit(1).single();
    if (error) {
      console.error("couldn't get the user's bank info", error);
      throw error;
    }

    console.log("bankData updated at", bankData)
    if(!bankData || bankData.updated_at > Date.now() - 1000){
      throw "can't update so soon.";
    }

    // now that we know the user is logged in and has access to the RLS restrict row from the table
    // we're going to get the json info and see if we can update the value
    //@ts-ignore
    const {currency, power} = jsonObject;

    // the service user is required for any inserts or updates

    let {data: updatedRecord, error: updateError} = await sc.from('bank')
      .update({[currency]: bankData.gold + (bankData.currentLevel ?? 1) * 300 * power})
      .eq('user_id', bankData.user_id).select('*');
    if (updateError){
      console.error("couldn't update the user's bank data")
      throw updateError;
    }

    console.log("updatedRecord", updatedRecord);
    c.status(202);
    c.header('Content-Type', 'application/json');
    return {data: updatedRecord};
  }
  catch (e) {
    console.log("ERROR", e);
    c.status(400);
    c.header('Content-Type', 'application/json');
    return {error: 'something broke'};
  }
}