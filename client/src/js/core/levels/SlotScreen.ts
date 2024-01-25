import {Screen} from './Screen';
import { AmbientLight, AudioListener, AudioLoader, Audio, DirectionalLight, Mesh, BoxGeometry, Material, MeshBasicMaterial, Scene} from "three";
import SlotMachine from '../entities/SlotMachine';
import { AssetManager } from '@esotericsoftware/spine-threejs';
import { Button } from '../entities/Button';
import { Character } from '../entities/Npcs/Character';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {user} from '../../systems/User';


export class SlotScreen extends Screen {
  slotMachine!: SlotMachine;
  spinButton!: Button;
  characters!: Character[];
  bgm!: Audio;
  listener!: AudioListener;
  audioLoader!: AudioLoader;
  audioPaused: boolean = false;
  constructor(zone: string, rendererScene: Scene) {
    super('SlotScreen', rendererScene);
    this.slotMachine = new SlotMachine();
    this.spinButton = new Button('.spinButton', '.spinButtonSide', '', this.spin.bind(this));
    this.children.push(this.slotMachine);
    this.children.push(this.spinButton);
  }

  soundPlayer(buffer: AudioBuffer){
    this.bgm.setBuffer(buffer);
    this.bgm.setLoop(true);
    this.bgm.setVolume(0.1);
  }

  spin() {
    this.slotMachine.spin();
    
    if(!this.bgm.isPlaying && !this.audioPaused){
      // this.bgm.play();
    }
  }

  async load(assetManager: AssetManager) {
    await this.slotMachine.load(this.scene);
    this.slotMachine.spinButton = this.spinButton;
    await this.spinButton.load(this.scene);
    this.listener = new AudioListener();
    // need camera for listener

    this.bgm = new Audio(this.listener);
    this.audioLoader = new AudioLoader();

    this.audioLoader.load('assets/bgm/slots_full.mp3', this.soundPlayer.bind(this));

    console.log("slotscreen load");

    window.addEventListener('keyup', (event) => {
      console.log("event", event.code);
      if (event.code === 'KeyS') {
        this.spin();
      }
      else if (event.code === 'KeyM') {
        if(this.bgm.isPlaying){
          this.bgm.pause();
          this.audioPaused = true;
        }
        else{
          // this.bgm.play();
          this.audioPaused = false;
        }
      }
    });
    const loader = new GLTFLoader();
    const ambientLight = new AmbientLight( 0xffffff, 1.2 );
    this.scene.add( ambientLight );
    this.addShadowLight();
    loader.load('assets/slots/slotmachine.glb', (gltf) => {
      gltf.scene.children.forEach((model)=>{ 
        const mat = ((model as Mesh).material as Material);
        mat.depthWrite = false;
        mat.transparent = true;
        mat.depthTest = false;
        model.rotation.x = -Math.PI / 2;
        model.rotation.z = Math.PI;
        // model.rotation.y = 0;//Math.PI / 2;

        // model.rotation.z = 0;
      });
      gltf.scene.renderOrder = -1;
      this.scene.add(gltf.scene);
    });

    
    console.log("load done")
    return this;
    // return super.load(assetManager);
  }

  addShadowLight() {
  var light = new DirectionalLight(0xc0e0ff,12.5);
	light.position.y = .9;
	light.position.z = .4;
	light.castShadow = true;


    
	light.castShadow = true;
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	light.shadow.bias = 0.0000001;
	light.shadow.normalBias = 0.01;
	light.shadow.camera.left = -1.5;
	light.shadow.camera.right = 1.5;
	light.shadow.camera.top = 1.5;
	light.shadow.camera.bottom = -1.5;

	light.shadow.camera.far = 4.5;
	this.scene.add(light);
}
}