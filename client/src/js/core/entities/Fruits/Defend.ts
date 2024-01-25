import {Fruit} from './Fruit'; 
declare class Defend extends Fruit {}
function Defend (this: Defend, image: string, effect?: () => void) {
  if (effect){
    this.effect = effect;
  }
}
Object.setPrototypeOf(Defend.prototype, Fruit.prototype);

Defend.prototype.constructor = Defend;
Defend.prototype.type = 'defend';

export {Defend};