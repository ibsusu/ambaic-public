import { createClient } from "@supabase/supabase-js";
import { Context } from "hono";
import { z } from "zod";

export async function userPreamble<T extends z.ZodType>(c: Context, dataType?: T) {
  const user_id = c.req.headers.get('X-UserId');
  if(!user_id || user_id.length === 0) throw 'failed to get the user id';
  const userClient  = createClient(
    process.env.PUBLIC_SUPABASE_URL ?? '',
    // Supabase API ANON KEY - env var exported by default.
    process.env.PUBLIC_SUPABASE_ANON_KEY ?? '',
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    { global: { headers: { Authorization: `${c.req.headers.get('Authorization')}` } } }
  );

  if(!dataType) return {user_id, userClient};

  // finally let's parse the object
  const jsonObject: T = dataType.parse(await c.req.json());
  console.log("JSONOBJECT", jsonObject, 
    '\n\nurl: ', process.env.PUBLIC_SUPABASE_URL, '\n\n key: ', 
    process.env.PUBLIC_SUPABASE_ANON_KEY, '\n\n auth token:', c.req.headers.get('Authorization'));
    
    

    // userClient.auth.setSession({access_token: c.req.headers.get('Authorization')?.replace('Bearer ', '') || '', refresh_token: c.req.headers.get('X-RefreshToken') || ''});
    
    // const {
    //   data: { user },
    //   error: userError,
    // } = await userClient.auth.getUser();
    // if (!user) {
    //   console.error("couldn't get the user", c.req.headers.get('Authorization'));
    //   throw userError;
    // }
    return {jsonObject, user_id, userClient };
}