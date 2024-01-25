import { useEffect, useRef } from 'preact/hooks';
import {Game} from '../../../systems/Game';
import {Renderer} from '../../../systems/Renderer';

// TODO handle signal stuff for controlling the gmae.
// const runGame = signal(false);
const renderer = new Renderer();
const game = new Game(renderer);

export function Ambaic() {
  const canvasRef = useRef(null)

  useEffect(() => {
    console.log("ambaic useeffect");
    const intialization = async function (){
      if(!canvasRef.current) return;
      let renderPromise = renderer.initialize(canvasRef.current!);
      let gamePromise = game.initialize();

      // doesn't do anything else.  renderer should be on webworker
      await renderPromise;

      await gamePromise;
      

      await game.start();
      console.log("game finished running");
    }
    intialization();
  }, [canvasRef.current]);

  return (
    <canvas ref={canvasRef} id="gameRoot">
    </canvas>
  )
}