import {Color, PerspectiveCamera, Scene, WebGLRenderer, WebGL1Renderer, LinearToneMapping, PCFSoftShadowMap, AxesHelper} from 'three';

/**
 * Renderer handles the canvas and its relationship with the window
 * as well as the orientation of the device.
 * It's handed to the Game for control from there.
 */
export class Renderer {
  renderer!: THREE.WebGL1Renderer;
  /* these are the basic camera and scene items.
   * the current way of rendering everything is to have one scene
   * that we add everything else to for rendering.
   * Each Level has the things that it loads as well as usually
   * dictating the type of transition to it.
   */
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;

  constructor(canvas?: HTMLCanvasElement) {
    // this.renderer = new WebGL1Renderer({
    //   antialias: true,
    //   canvas
    // });
    // this.setUpScene();
    // this.setUpCamera();
    // this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setPixelRatio(2);
    
    // if(!canvas){
    //   console.log("renderer constructor, no canvas");
    //   // We created the canvas so we just append it.
    //   document.body.appendChild(this.renderer.domElement);
    // }
  }

  initialize(canvas: HTMLCanvasElement){
    this.renderer = new WebGL1Renderer({
      antialias: true,
      canvas
    });
    console.log("setting up scene");
    this.setUpScene();

    console.log("setting up camera");
    this.setUpCamera();

    console.log("setting render size");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    console.log("setting pixel ratio");
    // HDR GO GO GO
    this.renderer.setPixelRatio(2);
    this.renderer.localClippingEnabled = true;
    this.renderer.useLegacyLights = true;
    this.renderer.toneMapping = LinearToneMapping;
    // this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.toneMappingExposure  = 0.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    // CAN YOU FEEL THE SHINE?  AWWW YEAH.

    if(!canvas){
      // We created the canvas so we just append it.
      console.log("canvas doesn't exist so we're going to append it");
      document.body.appendChild(this.renderer.domElement);
    }
    console.log("finished initializing renderer")
  }

  setUpScene(){
    this.scene = new Scene();
    this.scene.background = new Color( 0xf1f1f1 );
    const axesHelper = new AxesHelper( 5 );
    this.scene.add( axesHelper );
  }

  setUpCamera(){
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    // this.camera.position.y = 0;
    // this.camera.position.z = 1000;
    this.camera.position.set( 0, 0, 2.5 );
  }

  render(currentTime: number){
    // console.log("render!");
    this.renderer.render(this.scene, this.camera);
  }

  get domElement() {
    return this.renderer.domElement;
  }
};