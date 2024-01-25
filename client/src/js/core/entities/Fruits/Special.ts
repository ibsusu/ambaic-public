import {Fruit} from './Fruit'; 
declare class Special extends Fruit {}
function Special (this: Special, image: string, effect?: () => void) {
  if (effect){
    this.effect = effect;
  }
}
Object.setPrototypeOf(Special.prototype, Fruit.prototype);
Special.prototype.effect = function () {
  // Special.prototype.
  console.log("Special prototype effect");
  // Object.getPrototypeOf(this).effect();
};
Special.prototype.constructor = Special;
Special.prototype.type = 'special';

export {Special};