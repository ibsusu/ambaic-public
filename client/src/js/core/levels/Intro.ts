import { AssetManager } from "@esotericsoftware/spine-threejs";
import { Scene } from "three";
import { SlotScreen } from "./SlotScreen";

export class Intro extends SlotScreen {
  constructor(screenId: string, scene: Scene){
    super(screenId, scene);
  }
}