import { Context } from "hono";
import { z } from "zod";
import { sc } from "../_shared/initSupabase";
import { userPreamble } from "../_shared/preambles";

enum Fruit {
  BigMoney,
  Money,
  Convert,
  Defend,
  Cuddle,
  Special,
  Attack,
};

export async function spin(c: Context){
  try{
    console.log("SPINNING");
    const {user_id, userClient} = await userPreamble(c);
    const updateValues = {
      // reel1: calculateSpinResult(),
      // reel2: calculateSpinResult(),
      // reel3: calculateSpinResult(),
      // gold: 200,
      // ac: 'df9sfsnf9s7df354#$&%&^$r79f9d7fsfv97xvxfSDF45$%'
    };
    let {data: spinData, error} = await userClient.from('spins_view')
      .update(updateValues)
      .match({user_id})
      .select(`*`);

    if (error) {
      console.error("couldn't update the user's spin data", error);
      throw error;
    }
    if(!spinData){
      throw "no spin data";
    }

    console.log("spinData updated record", spinData);

    c.status(200);
    c.header('Content-Type', 'application/json');
    return {data: spinData};
  }
  catch (e) {
    console.log("ERROR", e);
    c.status(400);
    c.header('Content-Type', 'application/json');
    return {error: 'something broke'};
  }
}

function calculateSpinResult(){
  const outcome = Math.random();
  if(outcome < .26) return Fruit.BigMoney;
  if(outcome < .50) return Fruit.Money;
  if(outcome < .60) return Fruit.Convert;
  if(outcome < .69) return Fruit.Defend;
  if(outcome < .74) return Fruit.Cuddle;
  if(outcome < .87) return Fruit.Attack;
  return Fruit.Special;
}