import { BrowserRouter, Routes, Route } from "react-router-dom";
import PolygonTDGamePage from "./pages/games/polygonTD/PolygonTDGamePage";
import EchoArenaGamePage from "./pages/games/echoArena/EchoArenaGamePage";
import PortfolioPage from "./pages/PortfolioPage";
import Sidestep2GamePage from "./pages/games/sidestep2/Sidestep2GamePage";
import OriginalSoundtracksPage from "./pages/exhibits/OriginalSoundtracks";
import PlayPage from "./pages/exhibits/Play";
import ProjectsPage from "./pages/exhibits/Projects";
import Glungus404 from "./pages/misc/Glungus404Page";
import GlungusClickerFinalBattleGamePage from "./pages/games/glungusClickerFinalBattle/GlungusClickerFinalBattlePage";


function App() {
  return (
    <div>
        <BrowserRouter> 
          <Routes>
            <Route path="/" element={<PortfolioPage/>}/>
            <Route path="/PolygonTD" element={<PolygonTDGamePage/>}/>  
            <Route path="/EchoArena" element={<EchoArenaGamePage/>}/>
            <Route path="/Sidestep2" element={<Sidestep2GamePage/>}/>
            <Route path="/OST" element={<OriginalSoundtracksPage/>}/>
            <Route path="/Play" element={<PlayPage/>} />
            <Route path="/Projects"  element= {<ProjectsPage/>}/>
            <Route path="/GlungusClicker" element={<GlungusClickerFinalBattleGamePage/>}/>
            <Route path="*" element={<Glungus404/>}/>
          </Routes>
        </BrowserRouter>
    </div>    
  )
    
}


export default App;
