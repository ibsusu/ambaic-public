import { CanvasTexture, RepeatWrapping, Vector2 } from "three";
import { PositionManager } from "./PositionManager";
import html2canvas from 'html2canvas';
import { Vector } from "html2canvas/dist/types/render/vector";


declare class SkinnablePositionManager extends PositionManager {
  buildDomTextures: (el: HTMLElement, angle: number) => Promise<{map: CanvasTexture, orm: CanvasTexture, normal: CanvasTexture}>;
  bumpToNormal: (canvas: HTMLCanvasElement, offset?: number, intensity?: number) => HTMLCanvasElement;
  frontSkin: string;
  sideSkin?: string;
  backSkin?: string;
  constructor(skin: string);
}




function SkinnablePositionManager(this: SkinnablePositionManager, skin: string) {
  
}

SkinnablePositionManager.prototype.bumpToNormal = function(canvas,offset=1, intensity = 2) {
	var g = canvas.getContext('2d');
  if(!g) throw "loading bump map but could not get the canvas 2d context";
	const src = g.getImageData(0,0, canvas.width, canvas.height);
	const dest = g.getImageData(0,0, canvas.width, canvas.height);
  // console.log("src ImageData", src);
  // var g = canvas.getContext('webgl');
  // if(!g) throw "loading bump map but could not get the canvas 2d context";
	// const src = g.readPixels(0,0, canvas.width, canvas.height);
	// const dest = g.getImageData(0,0, canvas.width, canvas.height);

	for(var i=0;i< src.data.length;i+=4) {

		//TODO this doens't resolve over the width boundary!
		var red = (src.data[i+0]-src.data[i+4*offset])*intensity;
		var green = (src.data[i+0]-src.data[i+4*offset*canvas.width])*intensity;
		var blue = 255-Math.abs(red)-Math.abs(green);

		dest.data[i+0] = 128+red;
		dest.data[i+1] = 128+green;
		dest.data[i+2] = blue;
		dest.data[i+3] = 255;
	}

	g.putImageData(dest, 0,0);
	return canvas;
}

SkinnablePositionManager.prototype.buildDomTextures = async function(el, angle=0) {
  if(!el) throw "the element that is going to be skinned must exist";
	el.classList.add('null')

	var albedo = await html2canvas(el);
	// var albedo = await html2canvas(el);

	el.classList.add('orm');
	var ormCanvas = await html2canvas(el);
	const orm = new CanvasTexture(ormCanvas);


	el.classList.replace('orm', 'bump');
	var normal = new CanvasTexture(this.bumpToNormal(await html2canvas(el)));
	el.parentElement!.removeChild(el);
	var map = new CanvasTexture(albedo);
  map.center = orm.center = normal.center = new Vector2(0.5, 0.5);
	map.rotation = orm.rotation = normal.rotation = angle;
  // map.flipY = orm.flipY = normal.flipY = true;
  // map.repeat = new Vector2(2,2);
  // map.offset = new Vector2(0.5, 0);
	map.wrapS = map.wrapT = orm.wrapS = orm.wrapT = normal.wrapS = normal.wrapT = RepeatWrapping;
	return {map, orm, normal};
}

export {SkinnablePositionManager};
