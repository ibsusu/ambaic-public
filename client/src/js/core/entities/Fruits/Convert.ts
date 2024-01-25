import {Fruit} from './Fruit'; 

declare class Convert extends Fruit {}
function Convert (this: Convert, image: string, effect?: () => void) {
  if (effect){
    this.effect = effect;
  }
}
Object.setPrototypeOf(Convert.prototype, Fruit.prototype);
Convert.prototype.effect = function () {
  // Convert.prototype.
  console.log("Convert prototype effect");
  // Object.getPrototypeOf(this).effect();
};
Convert.prototype.constructor = Convert;
Convert.prototype.type = 'convert';

export { Convert };