import {Fruit} from './Fruit'; 

export {};
declare class Attack extends Fruit {}
Object.setPrototypeOf(Attack.prototype, Fruit.prototype);
function Attack (this: Attack, image: string, effect?: () => void) {
  if (effect){
    this.effect = effect;
  }
}
Attack.prototype.constructor = Attack;
Attack.prototype.type = 'attack';

export {Attack};