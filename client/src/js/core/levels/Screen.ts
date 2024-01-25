import {AssetManager, AtlasAttachmentLoader, SkeletonMesh, SkeletonJson, TextureAtlas} from "@esotericsoftware/spine-threejs";
import { Mesh, BoxGeometry, MeshBasicMaterial, Scene } from "three";
import SlotMachine from '../entities/SlotMachine';

type ScreenState = {
};

type ScriptedEvent  = (levelState: ScreenState) => void;

export class Screen {
  zoneId: string;
  eventQ: ScriptedEvent[];
  assetManager!: AssetManager;
  assetNames: string[];
  skeletons: SkeletonMesh[];
  animations: string[];
  children: any[];
  _currentAnimation?: number;
  scene: Scene;
  skeletonMesh?: SkeletonMesh;
  loadResolver = Promise.resolve;
  loadPromise!: Promise<void>;
  //@ts-ignore
  loadInterval;

  constructor(zoneId: string, rendererScene: Scene){
    this.zoneId = zoneId;
    this.eventQ = [];
    this.assetNames = [];
    this.skeletons = [];
    this.children = [];
    this.animations = ['idle'];
    this.currentAnimation = 0;
    this.scene = rendererScene;
    this.loadPromise;
    console.log('SCENE', this.scene);
  }

  async load(assetManager: AssetManager){
    this.assetManager = assetManager;
    console.log(`loading level: ${this.zoneId}, scene:`, this.scene);
    //@ts-ignore
    const loadInit = (resolve, _) => {
      this.loadResolver = resolve;
    };
    loadInit.bind(this);
    const loaders: {atlasPath: string, skeletonPath: string}[] = [];
    console.log("assetnames", this.assetNames);
    for(let assetName of this.assetNames){
      console.log("assetnameloop", assetName);
      // load the texture atlas using the name.atlas and name.png from the AssetManager.
      // the function passed to TextureAtlas is used to resolve relative paths.
      const atlasFilename = assetName + '.atlas';
      const skeletonJsonFilename = assetName +'.json';

      const skeletonPath = skeletonJsonFilename;
      const atlasPath = atlasFilename;
      console.log("skeletonPath", skeletonPath);
      console.log("atlasPath", atlasPath);

      const loadPromise = new Promise(loadInit);

      //this needs to be rethought, we shouldn't load one at a time since it's too slow.
      this.assetManager.loadText(skeletonPath);
      this.assetManager.loadTextureAtlas(atlasPath);

      this.loadInterval = setInterval(() => {
        console.log("loadinterval");
        if(!this.assetManager.isLoadingComplete()) return;
        window.clearInterval(this.loadInterval)
        this.loadResolver();
      }, 50);

    }

    console.log("before loadpromise");
    await this.loadPromise;
    console.log(" after load promise returned");

    for(let {atlasPath, skeletonPath} of loaders){
      // generic box we're going to add the skeleton to.
      const geometry = new BoxGeometry(200, 200, 200);
      const material = new MeshBasicMaterial({color: 0xff0000, wireframe: true});
      const mesh = new Mesh(geometry, material);
      this.scene.add(mesh)

      let atlasFile = assetManager.require(atlasPath);
      // Create an atlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
      let atlasLoader = new AtlasAttachmentLoader(atlasFile);

      // Create a SkeletonJson instance for parsing the .json file
      let skeletonJson = new SkeletonJson(atlasLoader);

      // Set the scale to apply during parsing, parse the file, and create a new skeleton.
      skeletonJson.scale = 0.3
      let skeletonData = skeletonJson.readSkeletonData(this.assetManager.require(skeletonPath));

      // Create a SkeletonMesh from the data and attach it to the scene
      let skeletonMesh = new SkeletonMesh(skeletonData, (parameters) => {
        parameters.depthTest = true;
        parameters.depthWrite = true;
        parameters.alphaTest = 0.001;
      });
      this.skeletonMesh = skeletonMesh;
      skeletonMesh.state.setAnimation(0, this.currentAnimation, true);
      mesh.add(skeletonMesh);
    }


    return this;
  }

  async load_old(assetManager: AssetManager) {
    this.assetManager = assetManager;
    console.log(`loading zone: ${this.zoneId}, scene:`, this.scene);
    const slotManager = new SlotMachine();
    slotManager.spin();
    //@ts-ignore
    const loadInit = (resolve, _) => {
      this.loadResolver = resolve;
    };

    loadInit.bind(this);

    const atlasLoaders = []
    console.log("assetnames", this.assetNames);
    for(let assetName of this.assetNames){
      console.log("assetnameloop", assetName);
      // load the texture atlas using the name.atlas and name.png from the AssetManager.
      // the function passed to TextureAtlas is used to resolve relative paths.
      const atlasFilename = assetName + '.atlas';
      const skeletonJsonFilename = assetName +'.json';
      const skeletonPath = `zones/${this.zoneId}/${skeletonJsonFilename}`;
      const atlasPath = `zones/${this.zoneId}/${atlasFilename}`;
      console.log("skeletonPath", skeletonPath);
      console.log("atlasPath", atlasPath);
      const loadPromise = new Promise(loadInit);
    
      //this needs to be rethought, we shouldn't load one at a time since it's too slow.
      this.assetManager.loadText(skeletonPath);
      this.assetManager.loadTextureAtlas(atlasPath);

      this.loadInterval = setInterval(() => {
        console.log("loadinterval");
        if(!this.assetManager.isLoadingComplete()) return;
        window.clearInterval(this.loadInterval)
        this.loadResolver();
      }, 50);
      console.log("before loadpromise");
      
      await loadPromise;

      console.log(" after load promise returned");

      // generic box we're going to add the skeleton to.
      const geometry = new BoxGeometry(200, 200, 200);
      const material = new MeshBasicMaterial({color: 0xff0000, wireframe: true});
      const mesh = new Mesh(geometry, material);
      this.scene.add(mesh)

      let atlasFile = assetManager.require(atlasPath);
      // Create an atlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
      let atlasLoader = new AtlasAttachmentLoader(atlasFile);

      // Create a SkeletonJson instance for parsing the .json file
      let skeletonJson = new SkeletonJson(atlasLoader);

      // Set the scale to apply during parsing, parse the file, and create a new skeleton.
      skeletonJson.scale = 0.4
      let skeletonData = skeletonJson.readSkeletonData(this.assetManager.require(skeletonPath));

      // Create a SkeletonMesh from the data and attach it to the scene
      let skeletonMesh = new SkeletonMesh(skeletonData, (parameters) => {
        parameters.depthTest = true;
        parameters.depthWrite = true;
        parameters.alphaTest = 0.001;
      });
      this.skeletonMesh = skeletonMesh;
      skeletonMesh.state.setAnimation(0, this.currentAnimation, true);
      mesh.add(skeletonMesh);
    }

    return this;
  }

  //@ts-ignore TS-2389
  get currentAnimation(): string {
    return this.animations[this._currentAnimation ?? 0];
  }

  set currentAnimation(num: number){
    this._currentAnimation = num;
  }

  update(time: number, deltaTime: number){
    // console.log("screen updating", this.screenId, deltaTime);
    // this.skeletonMesh?.update(deltaTime);
    for(let i=0;i<this.children.length;++i){
      this.children[i].update(time, deltaTime);
    }
  }

  run(){

  }
  
  unload(){
    
  }

  async transition(screenId: string) {
    return;
  }
}