import {Fruit} from './Fruit';
import {user} from '../../../systems/User';

declare class Money extends Fruit {}
function Money (this: Money, image: string, effect?: () => void) {
  if (effect){
    this.effect = effect;
  }
}
Object.setPrototypeOf(Money.prototype, Fruit.prototype);
Money.prototype.effect = function (power: number) {
  // Money.prototype.
  console.log("Money prototype effect");
  // user.addCurrency('money', power);
  
};
Money.prototype.constructor = Money;
Money.prototype.type = 'money';

export {Money};