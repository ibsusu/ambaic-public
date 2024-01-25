import {Fruit} from './Fruit'; 
declare class BigMoney extends Fruit {}
function BigMoney (this: BigMoney, image: string, effect?: () => void) {
  if (effect){
    this.effect = effect;
  }
}
Object.setPrototypeOf(BigMoney.prototype, Fruit.prototype);
BigMoney.prototype.effect = function () {
  // BigMoney.prototype.
  console.log("BigMoney prototype effect");
  // Object.getPrototypeOf(this).effect();
};
BigMoney.prototype.constructor = BigMoney;
BigMoney.prototype.type = 'bigmoney';

export {BigMoney};