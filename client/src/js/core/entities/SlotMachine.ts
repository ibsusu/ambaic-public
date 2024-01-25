// import { PositionManager } from "./PositionManager";
import { Plane, Scene, Vector3, Vector4 } from "three";
import { SkeletonClipping, Slot } from "@esotericsoftware/spine-core";
import { PositionManager } from "./PositionManager";
import {type Fruit} from "./Fruits/Fruit";
import {Defend, Attack, Cuddle, Money, Special, BigMoney, Convert} from './Fruits'
import { WindowIcon } from "@heroicons/react/24/outline";
import { user } from "../../systems/User";
import { Button } from "./Button";


declare class SlotMachine {
  // new: (this: SlotManager, spinning: boolean[]) => SlotManager;
  spinning: boolean[];
  spinSpeed: number[];
  spinButton: Button;
  spinSpeedMinimums: number[];
  spinDeceleration: number[];
  spinTimes: number[];
  currentMaxSpinTime: number;
  spinTimeMax: number;
  reelDimensions: Vector4[];
  reelCount: number;
  reelWinnerIndexes: number[];
  reelOffsets: {x:number, y:number, z:number}
  fruitOffsets: {x:number, y:number, z:number}
  clipPlanes: Plane[];
  winners: Record<string, number>;
  winner: Fruit;
  winnerCount: number;
  reels: Fruit[][];
  spin: () => void;
  load: (scene: Scene) => void;
  update: (time: number, deltaTime: number) => void;
}


function SlotMachine (this: SlotMachine, spinning: boolean[]=[]) {
  this.spinning = spinning;
  this.reelCount = 3;
  this.spinTimeMax = 3;
  this.reels = [];
  this.spinSpeed = [];
  this.spinSpeedMinimums = [];
  this.spinDeceleration = [0.001, 0.001, 0.001];
  this.reelWinnerIndexes = [];
  this.reelOffsets = {x:-.5, y: 0.25, z: 0};
  this.fruitOffsets = {x:0.45, y: 0.38, z: 0.01};
  this.winners = {}

  for(let i=0;i<this.reelCount;++i){
    this.reels.push([
      new Money(), // coin
      new Attack(),  // sword
      new Special(), // icon_energy_yellow
      new BigMoney(), // coin bag
      new Cuddle(), // hand holding heart
      new Money(), // coin
      new Convert(), //  church
      new BigMoney(), // coin bag
      new Defend() // shield
    ]);
  }

  this.spin = async function() {
    this.spinButton.press();
    if(this.spinning.some(x => x)) return;
    // press the button

    this.spinning = [];
    for(let i=0;i<this.reelCount;++i){
      this.spinning.push(true); 
    }

    this.spinTimes = [60, 60, 60];
    this.spinSpeed = [8, 8, 8];
    this.spinDeceleration = [0, 0, 0];
    const {winners, spinnableAt} = await user.spin();
    this.spinTimes = [];
    this.spinDeceleration = [];
    this.spinTimeMax = Math.max((spinnableAt.getTime() - Date.now()-1000) / 1000, 1);
    this.reelWinnerIndexes = [];
    this.currentMaxSpinTime = 1;
    
    for(let i=0;i<this.reelCount;++i){
      // how long each one is going to spin at the minimum.  we may need one more revolution
      const spinTime = Math.max(1, Math.random()*100 % this.spinTimeMax);
      this.currentMaxSpinTime = Math.max(this.currentMaxSpinTime, spinTime);
      this.spinTimes.push(spinTime);
      // which fruit is the winner
      // this should come from the user
      const winnerIndex = winners[i];//Math.floor(Math.random() * 100) % this.reels[i].length;
      // console.log("winnerindex", winnerIndex);
      this.reelWinnerIndexes.push(winnerIndex);
      const winnerType = this.reels[0][winnerIndex].type;
      if(this.winners[winnerType]) this.winners[winnerType]++;
      else this.winners[winnerType] = 1;
      if(this.winners[winnerType] >= 2) {this.winner = this.reels[0][winnerIndex]; this.winnerCount = this.winners[winnerType];}

      this.spinDeceleration.push(Math.max(.003, Math.random() / 300));
      this.spinSpeedMinimums.push(Math.max(3, Math.random() * 100  % 6));

      // spin speed always starts off the same.
      // reels slow down differently and have different minimum speeds.
    }
  }

  this.update = function (time: number, deltaTime: number) {
    if(!this.spinning.some(x => x)) return;

    // spin the reels
    for (let i = this.reels.length-1;i>=0;--i){
      const reel = this.reels[i];

      if(!this.spinning[i]) continue;

      for(let j=reel.length-1; j>=0;--j){
        const fruit = reel[j];
        if(this.spinTimes[i] < 0 && this.spinSpeed[i] > this.spinSpeedMinimums[i]){
          // start slowing down
          this.spinSpeed[i] -= this.spinDeceleration[i];
        }
        if (this.spinSpeed[i] <= this.spinSpeedMinimums[i] &&
            this.reelWinnerIndexes[i] === j &&
            fruit.position.y >= -0.4 && fruit.position.y <= -.2){
          fruit.position.y = -.2;
          reel[((j-1) < 0? reel.length-1 : j-1) % reel.length].position.y = -.2 + this.fruitOffsets.y;
          reel[(j+1) % reel.length].position.y = -.2 - this.fruitOffsets.y;
          // console.log("stopping on the winner", fruit.type);
          // stop on the winner
          this.spinning[i] = false;
          break;
        }

        fruit.position.y -= (this.spinSpeed[i] * deltaTime);
        this.spinTimes[i] -= deltaTime;
        
        // cycle the fruit back to the top position
        if (fruit.position.y < -3) fruit.position.y = reel[(j+1) % reel.length].position.y + this.fruitOffsets.y;
      }
    }

    if(!this.spinning.some(x => x) && this.winnerCount > 1){
      // we're done spinning, handle the winner effects
      this.winner.effect(this.winnerCount);
    }

  }
}

const s = new SlotMachine();
Object.setPrototypeOf(SlotMachine.prototype, PositionManager.prototype);


SlotMachine.prototype.load = function(scene: Scene){
  this.clipPlanes = [
    new Plane( new Vector3( 0, 1, 0 ), 0.56),
    new Plane( new Vector3( 0, -1, 0 ), 0.22)
  ];
  const reelOffsets = this.reelOffsets;
  const fruitOffsets = this.fruitOffsets;
  this.reels.forEach((reel, i) => reel.forEach((fruit, j) => {fruit.load(scene, new Vector3(
      reelOffsets.x+i*fruitOffsets.x, reelOffsets.y-j*fruitOffsets.y, reelOffsets.z
    ),
    this.clipPlanes
  )}));
}

SlotMachine.prototype.constructor = SlotMachine;
export default SlotMachine;


SlotMachine.prototype.spin = function () {
    // set spinning animation per reel
}
