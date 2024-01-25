import { user } from "./User";
import {create, StoreApi as Store, Mutate} from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware'
import { Directory, Encoding, Filesystem, ReaddirResult, ReadFileResult } from '@capacitor/filesystem';


export type NpcMeta = {
  id: string; // the thumbnail is pulled from this.
  name: string;
  devotion: number;
  stress: number;
  likes: string[];
	dislikes: string[];
	charisma: number;
	caring: number;
};

/**
 * This is in charge of loading and unloading the currently available npcs
 */
export class NpcManager {
  subscribe!: Store<NpcManager>["subscribe"];
  private static readonly BASE_DIRECTORY: Directory = Directory.Documents;

  constructor(
    private set: Store<NpcManager>["setState"],
    private get: Store<NpcManager>["getState"],
    private store: Mutate<Store<NpcManager>, [/* add middlware mutators here */]>
  ){}
}
export const npcManager = create<NpcManager>()(subscribeWithSelector((set, get, store) => new NpcManager(set, get, store)));

user.subscribe(s => s.followers, (followers) => console.log("followers", followers));

