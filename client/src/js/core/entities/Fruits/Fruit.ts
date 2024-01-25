// import { PositionManager } from "./PositionManager";
import { DoubleSide, Euler, ImageUtils, Material, Mesh, MeshLambertMaterial, Plane, PlaneGeometry, RepeatWrapping, Scene, TextureLoader, Vector2, Vector3, Vector4 } from "three";
import { SkeletonClipping, Slot } from "@esotericsoftware/spine-core";
import { PositionManager } from "../PositionManager";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import { decodeImage } from "../../_shared/utils";
import { decode } from "punycode";

declare class Fruit {
  // new: (this: Fruit, spinning: boolean[]) => Fruit;
  type: string;
  theme: string;
  effect: (power: number) => void;
  load: (scene: Scene, offset: Vector3, clipPlanes?: Plane[], fruitTheme?: string) => void;
  highlight: boolean;
  position: Vector3;
  rotation: Euler;

  // @ts-ignore: 1183
  constructor (theme?: string, effect?: () => void) {
    this.theme = theme ?? '';
    if(effect)
      this.effect = effect;
  }
}
function Fruit (this: Fruit, effect?: () => void) {
  if(effect){
    this.effect = effect;
  }
}
Fruit.prototype.constructor = Fruit;
Object.setPrototypeOf(Fruit.prototype, PositionManager.prototype);

Fruit.prototype.load = async function (scene: Scene, offset: Vector3, clipPlanes?: Plane[], fruitTheme?: string) {
  const image = await decodeImage(`assets/fruit/${fruitTheme ? fruitTheme + '_' :''}${this.type}.png`);
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load(ImageUtils.getDataURL(image))

  // assuming you want the texture to repeat in both directions:
  texture.wrapS = RepeatWrapping; 
  texture.wrapT = RepeatWrapping;

  // how many times to repeat in each direction; the default is (1,1),
  //   which is probably why your example wasn't working
  texture.repeat.set( 1, 1 );

  const material = new MeshLambertMaterial({ 
    map: texture,
    clippingPlanes: clipPlanes,
    // clipIntersection: true,
  });
  const plane = new Mesh(new PlaneGeometry(0.27, 0.27), material);
  plane.material.side = DoubleSide;
  plane.material.transparent = true;
  // plane.material.depthWrite = false;
  // plane.frustumCulled = false;

  plane.position.x = offset.x; // 0.04;
  plane.position.y = offset.y; // -0.1;
  plane.position.z = offset.z; // 0.01;
  this.position = plane.position;
  this.rotation = plane.rotation;
  // plane.position.x = 100;

  // rotation.z is rotation around the z-axis, measured in radians (rather than degrees)
  // Math.PI = 180 degrees, Math.PI / 2 = 90 degrees, etc.
  // plane.rotation.z = Math.PI / 2;
  // plane.rotation.y = Math.PI / 2;
  // plane.rotation.x = Math.PI / 2;

  scene.add(plane);


  // const loader = new GLTFLoader();
  // loader.load(`assets/fruit/${fruitTheme || fruitTheme + '_'}${this.type}.glb`, (gltf) => {
  //   gltf.scene.children.forEach((model)=>{ ((model as Mesh).material as Material).transparent = true;});
  //   scene.add(gltf.scene);
  // });
  // console.log("load done")
  // return this;
  // return super.load(assetManager);
}
// Fruit.prototype.type = 'fruit';
Fruit.prototype.effect = function (power: number) {
  console.warn(`${this.type} prototype effect`);
}

export {
  Fruit,
};