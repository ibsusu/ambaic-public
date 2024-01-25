import "reflect-metadata";
import "../index.css";
import {Game} from './systems/Game';
import {Renderer} from './systems/Renderer';
import {wait} from './core/_shared/utils';
import { Capacitor } from '@capacitor/core';
import { render } from 'preact';
import 'preact/debug';
import { App } from './ui/App';


export const platform = Capacitor.getPlatform();

async function showSplashScreen() {
  const img = document.createElement('img');
  img.src = '/assets/imgs/cards.png';
  img.width = 360;
  img.height = 360;
  const splash = document.createElement('div');
  splash.classList.add('splash');
  splash.appendChild(img);
  const childToRemove = document.body.appendChild(splash);
  await wait(1500);
  childToRemove.classList.add('faded');
  await wait(800);
  document.body.removeChild(childToRemove);
}

window.addEventListener('DOMContentLoaded', async () => {
  
  try {
    console.log('TRYING');
    if(platform === 'web') {
      render(<App />, document.getElementById('siteRoot')!);
    }
    else {  
      // CardAndCoin();
    }
    console.log("after initing db");
  } catch (err) {
    console.trace(`Error: ${err}`, err);
    throw new Error(`Error: ${err}`)
  }
});
