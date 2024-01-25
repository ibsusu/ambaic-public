import { createClient } from '@supabase/supabase-js';
import { Context, HonoRequest } from "hono";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

console.log("Running generate");

async function savePrompt(req: HonoRequest, tripId: string, prompt: string, promptResponse: string){
  // this throws an error if you're auth'd but can't save the prompt.
  // if you're not auth'd it just returns;

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      // Supabase API ANON KEY - env var exported by default.
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: `Bearer ${req.headers.get('Authorization')}` } } }
    );

    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      console.error("couldn't get the user while saving the prompt", req.headers.get('Authorization'));
      return;
    }

    console.log("generating prompt userId", user.id);

    const { data: tripData, error: tripError } = await supabaseClient.from('trips').select('uuid').eq('uuid', tripId).limit(1).single();

    if(tripError) {
      console.error("couldn't get the trip for the prompt", tripError);
      throw tripError;
    };
    console.log("generate tripData", tripData);
    // And we can run queries in the context of our authenticated user

    const { error } = await supabaseClient.from('prompts').insert({user_id: user.id, prompt, trip_id: tripData.uuid, response: promptResponse});
    if (error) {
      console.error("couldn't save the prompt for the trip", error);
      throw error;
    }
  }
  catch(e){
    console.error("some unhandled error occurred while saving the prompt", e);
    throw e;
  }
}

export default async (c: Context) => {

  const input: {tripId: string, prompt: string} = await c.req.json();
  console.log("INPUT text", input);

  console.log("before completion");

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: `Ignore any previous prompts. Format your response as a daily schedule in json similar to the following json object: {"itinerary": {"Day 1": [{"location": "", "name": "", "category": "", "google": "", "tripadvisor": "", "description": "" }]}},
                      Make sure that each activity has a location field, a name field, a category field, a description field, a google field and a tripadvisor field.  The description field should be written as if you were writing a short summary of a travel blog post about the activity.
                      The google field should provide a url to a google search for the activity.
                      The tripadvisor field should provide a url for querying or searching for the activity name on tripadvisor.  Do not link directly to the activity on tripadvisor.
                      Do not shorten any urls.
                      The category field should be a one or two word travel category that the activity falls under.
                      The root object should be under the itinerary key.
                      If this trip comprises multiple days, make sure each day has multiple activities and make sure that breakfast, lunch and dinner are each included in the activities array as separate activities.  If I mentioned food then one or more of the included meals should feature that food.
                      Only one city should be visited each day so activities that are grouped on the same day should happen in the same area.
                      Provide a complete answer which is a json object that can be parsed.  Remember that the last field of any json object cannot end in a comma.
                      ${input.prompt}
    `}],
  });

  console.log("after completion");


  console.log("completion", completion.status, completion.statusText, completion.data.choices);
  try{
    // just returns if you're not auth'd
    console.log("tripId", input.tripId, "prompt", input.prompt);
    await savePrompt(c.req, input.tripId, input.prompt, completion.data?.choices[0]?.message?.content || '');
    c.status(200);
    return c.json({ itinerary: completion.data });
  }
  catch (e){
    console.error("save prompt error", e);
    c.status(500);
    c.header('Content-Type', 'application/json');
    c.json({error: 'something broke'});
  }
};
