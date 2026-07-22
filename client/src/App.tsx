import { BrowserRouter, Routes, Route } from "react-router-dom";
import PolygonTDGamePage from "./pages/games/polygonTD/PolygonTDGamePage";
import EchoArenaGamePage from "./pages/games/echoArena/EchoArenaGamePage";
import MainPage from "./pages/MainPage";
import Sidestep2GamePage from "./pages/games/sidestep2/Sidestep2GamePage";
import OriginalSoundtracksPage from "./pages/exhibits/OriginalSoundtracks";
import GamesPage from "./pages/exhibits/Games";
import ProjectsPage from "./pages/exhibits/Projects";
import Glungus404 from "./pages/misc/Glungus404Page";


function App() {
  return (
    <div>
        <BrowserRouter> 
          <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/PolygonTD" element={<PolygonTDGamePage/>}/>  
            <Route path="/EchoArena" element={<EchoArenaGamePage/>}/>
            <Route path="/Sidestep2" element={<Sidestep2GamePage/>}/>
            <Route path="/OST" element={<OriginalSoundtracksPage/>}/>
            <Route path="/Play" element={<GamesPage/>} />
            <Route path="/Projects"  element= {<ProjectsPage/>}/>
            <Route path="/404-not-found" element={<Glungus404/>}/>
          </Routes>
        </BrowserRouter>
    </div>    
  )
    
}


export default App;
