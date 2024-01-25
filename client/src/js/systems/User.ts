import { UserResponse } from '@supabase/supabase-js';
import {type User as ServiceUser} from '@supabase/auth-helpers-react';
import {create, StoreApi as Store, Mutate, UseBoundStore, StoreApi, StateCreator} from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware'
import { supabase } from './initSupabase';
import { Directory, Encoding, Filesystem, ReaddirResult, ReadFileResult } from '@capacitor/filesystem';
import { NpcMeta } from './NpcManager';
import { LocationMeta } from './LocationManager';
import { StoreSubscribeWithSelector, Write } from '../core/_shared/types';
import type {ServerType} from '../../../../server/server';
import { hc } from 'hono/client';

interface UserState {
  gold: number,
  affection: number,
  serviceData: ServiceUser | null | undefined,
  loggedIn: boolean,
  currentLevel: number,
  location: string,
  followers: Record<string, NpcMeta>,
  locations: Record<string, LocationMeta>,
  userResponse: UserResponse | undefined,
  baseDirectory: Directory,
  load: () => Promise<void>,
  unload: () => Promise<void>,
  spin: () => Promise<{winners: number[], spinnableAt: Date}>,
};

type SpinResponse = {
  reel1: number,
  reel2: number,
  reel3: number,
  updatable_at: string,
};

const defaultUserState = {
  gold: 0,
  affection: 0,
  spins: 0,
  loggedIn: false,
  currentLevel: 1,
  followers: {},
  locations: {},
  serviceData: undefined,
  userResponse: undefined,
  baseDirectory: Directory.Documents,
};

//@ts-ignore
export const user: UseBoundStore<Write<StoreApi<UserState>, StoreSubscribeWithSelector<UserState>>> & UserState = create<UserState>()(subscribeWithSelector<UserState>((set,get) => ({
  ...window.structuredClone(defaultUserState),
  load: async function() {

    // this throws
    const {
      data: {user}
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("the user doesn't exist, show the login panel");
      return;
    }
    const sessionData =  await supabase.auth.getSession();

    console.log("userResponse", user);
    const {data: bankData} = await supabase.from('bank').select('gold, affection, conquests, shields, followers, conversions, rescues, sessions, spins, user_id, attack_power, convert_power, special_power').limit(1).single();
    // console.log("bankData", bankData);
    // const userLocalJson = await Filesystem.readFile({
    //   path: 'data/userData.json',
    //   directory: Directory.Documents,
    //   encoding: Encoding.UTF8,
    // });

    const userLocalData = {};
    console.log('userLocalData', userLocalData);

    set({...bankData, serviceData: user});
  },

  unload: async function() {
    const { error } = await supabase.auth.signOut();
    if(error){console.error("couldn't sign out for some reason", error)};

    set((x) => ({...window.structuredClone(defaultUserState), spin: x.spin, load: x.load, unload: x.unload}), true);
  },

  spin: async function() {
    // const response = await (await rpc.spin.$post()).json();
    const {serviceData} = get();
    if(serviceData?.id){
      const {data, error} = await supabase.from('spins_view').update({ac: "ahoy"})
      .match({user_id: serviceData.id})
      .select('*');
      console.log("spins_view Response", data, error);
      
      if(error) return this.spin();
      const spinData = (data as unknown as SpinResponse[])[0];
      // console.log("spin returning with proper data");
      return {
        winners: [spinData.reel1, spinData.reel2, spinData.reel3],
        spinnableAt: new Date(spinData.updatable_at),
      };
    }
  }

})));

//@ts-ignore
window.user = user;
user.load = function () { return user.getState().load(); };
user.unload = function() {return user.getState().unload();};
user.spin = function() {return user.getState().spin();};
user.load();


//@ts-ignore
window.supabaseClient = supabase;
export let rpc = hc<ServerType>(import.meta.env.VITE_PUBLIC_API_URL, {});

user.subscribe(state => state.serviceData, async (user) => {
  const sessionData = await supabase.auth.getSession();
  
  rpc = hc<ServerType>(import.meta.env.VITE_PUBLIC_API_URL, {headers: {
    Authorization: `Bearer ${sessionData.data?.session?.access_token}`,
    'X-UserId': sessionData.data?.session?.user?.id || '',
  }});
});

