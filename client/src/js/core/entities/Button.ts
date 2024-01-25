import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Plane, Scene, Mesh, MeshBasicMaterial, Triangle, Vector3, Vector4, MeshStandardMaterial, DoubleSide, VectorKeyframeTrack, AnimationMixer, AnimationClip, AnimationAction } from "three";
import { PositionManager } from "./PositionManager";
import { SkinnablePositionManager } from './Skinnable';
import { animate, AnimationControls, spring } from 'motion'
import { mix } from '@motionone/utils'
import TWEEN, {Tween} from '@tweenjs/tween.js';


declare class Button extends SkinnablePositionManager {
  pressed: boolean;
  pressing: number;
  holding: boolean;
  releasingHold: boolean;
  color: string;
  text: string;
  mixer: AnimationMixer;
  pressClip: AnimationClip;
  pressAction: AnimationAction;
  pressAnimation: AnimationControls;
  pressTween: Tween<any>;
  unpressTween: Tween<any>;
  frontMaterial: MeshStandardMaterial;
  sideMaterial: MeshStandardMaterial;
  frontClickedMaterial: MeshStandardMaterial;
  sideClickedMaterial: MeshStandardMaterial;
  clickHandler: () => void;
  unclick: () => void;
  mesh: Mesh & {unclick: () => void, clickHandler: () => void};
  press: () => void;
  pressToHold: () => void;
  load: (scene: Scene) => Promise<void>;
  update: (time: number, deltaTime: number) => void;
  setAnimation: () => void;
  constructor(skin: string, side: string, back: string, clickHandler: any);
}

function Button (this: Button, skin: string, side: string, back: string, clickHandler: () => void) {
  this.pressed = false;
  this.holding = false;
  this.releasingHold = false;
  this.pressing = 0;
  this.frontSkin = skin;
  this.sideSkin = side;
  this.backSkin = back;
  this.positions = [new Vector3(0, -1.1, 0.5)];
  this.clickHandler = clickHandler || function() {
    console.log("clickHandler");
  };
  
  this.unclick = function() {
    this.pressing = 0;

    if(this.pressTween.isPlaying()) {
        this.pressTween.stop();
    }

    if(this.unpressTween.isPlaying()) {
      if(this.unpressTween.isPaused()){
        this.unpressTween.resume();
      }
    }
    else{
      this.unpressTween.start();
    }
    
    if(this.releasingHold){
      this.holding = false;
      this.mesh.material = [this.sideMaterial, this.sideMaterial, this.frontMaterial, this.sideMaterial, this.sideMaterial, this.sideMaterial];
    } 
  }

  this.update = function (time: number, deltaTime: number) {
    // this is the animation update
    if(this.holding) return;
    if(this.pressTween.isPlaying() && !this.pressTween.isPaused()){
      this.pressTween.update();
    }
    else if(this.unpressTween.isPlaying() && !this.unpressTween.isPaused()){
      this.unpressTween.update();
    }
  }

  this.pressToHold = function() {
    if(this.pressing){
      this.holding = true;
      // this.mesh.material = [this.sideClickedMaterial, this.sideClickedMaterial, this.frontMaterial, this.sideClickedMaterial, this.sideClickedMaterial, this.sideClickedMaterial];     
    }
  }
}

Object.setPrototypeOf(Button.prototype, SkinnablePositionManager.prototype);

Button.prototype.setAnimation = function() {
  this.pressTween = new Tween(this.mesh.position)
    .to( { y: this.positions[0].y-0.1 }, 1000)
    .dynamic(true)
    .easing(TWEEN.Easing.Elastic.Out);

  this.unpressTween = new Tween(this.mesh.position)
    .to( { y: this.positions[0].y }, 1000)
    .dynamic(true)
    .easing(TWEEN.Easing.Elastic.Out);

  console.log("tweens", this.unpressTween, this.pressTween);
}


Button.prototype.press = function() {

  if(this.unpressTween.isPlaying()){
      this.unpressTween.stop();
  }

  if(this.pressTween.isPlaying()){
    this.pressTween.resume();
  }
  else {
    this.pressTween.start();
  }


  if(this.pressing) return;
  this.pressing = 1; 
  
}

Button.prototype.load = async function(scene: Scene){

  let boxGeom = new RoundedBoxGeometry(.5, .2, .5, 20, 0.1);
  const front = await this.buildDomTextures(document.querySelector(this.frontSkin)!, Math.PI);
  const side = await this.buildDomTextures(document.querySelector(this.sideSkin ?? this.frontSkin)!, Math.PI);
  // this.buildDomTextures(document.querySelector(this.frontSkin + 'Clicked')!, Math.PI).then(frontClicked => {
  //   this.frontClickedMaterial = new MeshStandardMaterial({
  //     transparent:true,
  //     map: frontClicked.map,
  //     side: DoubleSide,
  //     normalMap: frontClicked.normal,
  //     metalness:.1,
  //     roughness:1,
  //     metalnessMap: frontClicked.orm,
  //     roughnessMap: frontClicked.orm
  //   });
  // });
  // this.buildDomTextures(document.querySelector(this.sideSkin ? this.sideSkin + 'Clicked' : this.frontSkin + 'Clicked')!, Math.PI).then(sideClicked => {
  //   this.sideClickedMaterial = new MeshStandardMaterial({
  //     transparent:true,
  //     map: sideClicked.map,
  //     side: DoubleSide,
  //     normalMap: sideClicked.normal,
  //     metalness:.1,
  //     roughness:1,
  //     metalnessMap: sideClicked.orm,
  //     roughnessMap: sideClicked.orm
  //   });
  // });
  
  // const back = await this.buildDomTextures(document.querySelector(this.frontSkin)!, Math.PI);

  this.frontMaterial = new MeshStandardMaterial({
		transparent:true,
		map: front.map,
		side: DoubleSide,
		normalMap: front.normal,
		metalness:.1,
		roughness:1,
		metalnessMap: front.orm,
		roughnessMap: front.orm
	});

  this.sideMaterial = new MeshStandardMaterial({
		transparent:true,
		map: side.map,
		side: DoubleSide,
		normalMap: side.normal,
		metalness:1,
		roughness:1,
		metalnessMap: side.orm,
		roughnessMap: side.orm
	});

  let box = new Mesh(boxGeom,[this.sideMaterial, this.sideMaterial, this.frontMaterial, this.sideMaterial, this.sideMaterial, this.sideMaterial]);
  
  // let box = new Mesh(boxGeom, new MeshBasicMaterial( { color: 0x0000ff, opacity: 1, transparent: true } ));
  box.position.z = 0.5;
  box.position.y = -1.1;
	box.castShadow = box.receiveShadow = true;

  this.mesh = box as unknown as Mesh & {unclick: () => void, clickHandler: () => void} ;
  this.mesh.clickHandler = this.clickHandler.bind(this);
  this.mesh.unclick = this.unclick.bind(this);
  scene.add(box);
  this.setAnimation();
}

Button.prototype.constructor = Button;
export {Button};
