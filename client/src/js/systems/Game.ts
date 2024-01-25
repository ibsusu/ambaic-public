import { Renderer } from './Renderer';
import { user as userStore } from './User';

import {AssetManager} from "@esotericsoftware/spine-threejs";
import { Mesh, Object3D, Vector3, Vector4 } from "three";

import { OrbitControls } from './OrbitalControls';
import { PositionManager } from '../core/entities/PositionManager';
import SlotMachine from '../core/entities/SlotMachine';
import { SlotScreen } from '../core/levels/SlotScreen';
import { Screen } from '../core/levels/Screen';
import { Interactive } from '../core/_shared/types';


export type GameState = {
  user?: typeof userStore;
  loggedIn: boolean;
  level: string;
  finished: boolean;
};

export class Game extends PositionManager {
  renderer!: Renderer;
  loggedIn?: boolean;
  user?: typeof userStore;
  slotScreen!: SlotScreen;
  // cuddleScreen: CuddleScreen;
  // mapScreen: MapScreen
  // StoreScreen: StoreScreen;
  location!: string;
  clickedObject?: {
      unclick?: () => void,
      clickHandler?: () => {}
  };
  #screen?: Screen;
  shuttingDown?: boolean;
  assetManager?: AssetManager;
  time: number;
  fps: number;
  frameInterval: number;
  controls!: OrbitControls;
  throttled: boolean = false;
  throttleInterval = setInterval(() => {
    // TODO: THROTTLE
    // this.throttled = !this.controls.active;
    // this.controls.active = false;
    // console.log("is the game thottled? ", this.throttled, "are the controls active? ", this.controls.active);
  }, 2000);
  
  // The game holds all of the Entity values

  looper: (number: number) => void;

  gameResolver!: typeof Promise.resolve;

  constructor(renderer: Renderer){
    super();
    console.log('game constructed');
    this.renderer = renderer;
    console.log('game renderer: ', this.renderer);
    this.assetManager = new AssetManager('assets/');
    this.looper = this.loop.bind(this);
    this.time = 0;
    this.fps = 60;
    this.frameInterval = 1000/this.fps;
  }

  async initialize(){
    console.log("game initializing");
    // this.currentLevel?.load(assetManager);
  }

  async start(){
    console.log("game starting");

    this.controls = new OrbitControls(this.renderer.camera, this.renderer.domElement, this);
    this.controls.game = this;
    // if we're not logged in show the overlay
    if(!this.user?.loggedIn){
      // show the title screen until we log in
      this.setLocation("Title")
    }
    else {
      this.location = this.user.location;
    }
    
    // Let's Play!
    
    //@ts-ignore
    const gameEnder = (resolve, _) => {
      this.gameResolver = resolve;
    };

    gameEnder.bind(this);
    this.loop(0);
    return new Promise(gameEnder);
  }

  async close(){
    this.gameResolver();
  }
  

  async setLocation(location: string){
    if(!this.assetManager) throw "No asset manager, the game is broken. :(";
    console.log("SETTING LEVEL");
    const slotScreen = new SlotScreen(location, this.renderer.scene);
    console.log("before slotscreen load");
    await slotScreen.load(this.assetManager);
    //await.. otherScreen.load, etc.
    
    await slotScreen.transition(location);
    slotScreen.run();
    this.slotScreen?.unload();
    this.slotScreen = slotScreen;
    this.location = location;
  }

  loop(currentTime: number){
    // console.log("loop, this is the game renderer", this.renderer, currentTime);
    const deltaTime = currentTime/1000 - this.time;
    this.time = currentTime/1000;
    this.controls.update();
    if(this.controls.pointers.length){
      // console.log("POINTERS THING", {...this.controls.pointers});
      this.controls.raycaster.setFromCamera(this.controls.pointers[0], this.renderer.camera);
      const intersects = this.controls.raycaster.intersectObjects(this.renderer.scene.children) as {object: {unclick?: () => void, clickHandler?: () => {}}}[];
      for ( let i = 0; i < intersects.length; i ++ ) {
        if(intersects[i].object.clickHandler){
          if(!this.clickedObject || this.clickedObject && intersects[i].object != this.clickedObject){
            this.clickedObject?.unclick?.();
            intersects[i].object.clickHandler?.();
            this.clickedObject = intersects[i].object!;
            //@ts-ignore
            // console.log("CLICK", this.clickedObject.uuid);
          }
          break;
        } 
      }

      // console.log("INTERSECTS", this.renderer.scene.children, intersects);
    }
    else{
      if(this.clickedObject){
        //@ts-ignore
        // console.log("RELEASE", this.clickedObject.uuid);
        this.clickedObject.unclick?.();
        this.clickedObject = undefined;
      }
    }

    this.slotScreen?.update(currentTime, deltaTime);

    // this.#screen?.update(deltaTime);

    // const deltaMultiplier = deltaTime / this.frameInterval;
    
    this.renderer.render(currentTime);
    // TODO: THROTTLE
    // if(this.throttled) return;
    requestAnimationFrame(this.looper);
  }
}

setInterval