import { BrowserRouter, Routes, Route } from "react-router-dom";
import PolygonTDGamePage from "./pages/games/polygonTD/PolygonTDGamePage";
import EchoArenaGamePage from "./pages/games/echoArena/EchoArenaGamePage";
import MainPage from "./pages/MainPage";
import Bruh from "./pages/misc/Bruh";
import Sidestep2GamePage from "./pages/games/sidestep2/Sidestep2GamePage";
import OriginalSoundtracksPage from "./pages/exhibits/OriginalSoundtracks";
import GamesPage from "./pages/exhibits/Games";
import ProjectsPage from "./pages/exhibits/Projects";


function App() {
  return (
    <div>
        <BrowserRouter> 
          <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/PolygonTD" element={<PolygonTDGamePage/>}/>  
            <Route path="/EchoArena" element={<EchoArenaGamePage/>}/>
            <Route path="/Sidestep2" element={<Sidestep2GamePage/>}/>
            <Route path="/SecretRealPortfolio" element={<Bruh/>}/>
            <Route path="/OST" element={<OriginalSoundtracksPage/>}/>
            <Route path="/Games" element={<GamesPage/>} />
            <Route path="/Projects"  element= {<ProjectsPage/>}/>
          </Routes>
        </BrowserRouter>
    </div>    
  )
    
}


export default App;
