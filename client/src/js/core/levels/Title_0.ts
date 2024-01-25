import {Screen} from './Screen';
import { Mesh, BoxGeometry, MeshBasicMaterial, Scene } from "three";
import SlotMachine from '../entities/SlotMachine';
import { AssetManager } from '@esotericsoftware/spine-threejs';


export class Title_0 extends Screen {
  // slotMachines: SlotMachine[];
  
  
  constructor(_levelId: string, rendererScene: Scene) {
    super('Title_0', rendererScene);

  }

  async load(assetManager: AssetManager) {


    return this;
  }
}