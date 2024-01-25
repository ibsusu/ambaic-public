import { Vector3, Vector4 } from "three";



export class PositionManager {
  // 3d stuff
  positions: Vector3[] = [];
  rotations: Vector4[] = [];
  scales: number[] = [];
  animationOffsets: number[] = [];
  animationMultipliers: number[] = [];

  constructor (){
    this.positions =  [];
    this.rotations = [];
    this.scales = [];
    this.animationOffsets = [];
    this.animationMultipliers = [];
  }
  
}

