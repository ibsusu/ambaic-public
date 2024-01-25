import {Fruit} from './Fruit'; 
declare class Cuddle extends Fruit {}
function Cuddle (this: Cuddle, image: string, effect?: () => void) {
  if (effect){
    this.effect = effect;
  }
}
Object.setPrototypeOf(Cuddle.prototype, Fruit.prototype);
Cuddle.prototype.constructor = Cuddle;
Cuddle.prototype.type = 'cuddle';

export {Cuddle};