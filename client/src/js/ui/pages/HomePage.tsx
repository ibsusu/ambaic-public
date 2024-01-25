import Hero from "../components/Hero";
import {Ambaic} from '../components/Game/Ambaic';


// use signals to determine if this should be the website or the game.
export default function HomePage() {
  
  return (
    <div className="w-full h-full">
      {/* { isGame ? 
        <Ambaic /> 
        :
        <Hero />
      } */}
      <Ambaic />
    </div>
  );
}