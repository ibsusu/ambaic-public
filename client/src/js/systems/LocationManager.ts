import { user } from "./User";
import {create, StoreApi as Store, Mutate} from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware'
import { Directory, Encoding, Filesystem, ReaddirResult, ReadFileResult } from '@capacitor/filesystem';

/**
 * not sure how i'm going to use this structure meta yet.  
 */
type StructureMeta = {
  id: string; // the thumbnail is pulled from this
  type: StructureEnum; // the icon is pulled from this.
};

type StructureEnum = 'church' | 'cathedral' | 'market' | 'blacksmith' | 'farm' | 'guild' | 'slums' | 'sewer' | 'cabin';


export type LocationMeta = {
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
 * This is in charge of loading and unloading the currently available locations
 */
export class LocationManager {
  subscribe!: Store<LocationManager>["subscribe"];
  private static readonly BASE_DIRECTORY: Directory = Directory.Documents;

  constructor(
    private set: Store<LocationManager>["setState"],
    private get: Store<LocationManager>["getState"],
    private store: Mutate<Store<LocationManager>, [/* add middlware mutators here */]>
  ){}
}
export const locationManager = create<LocationManager>()(subscribeWithSelector((set, get, store) => new LocationManager(set, get, store)));

user.subscribe(s => s.locations, (locations) => console.log("locations", locations));

