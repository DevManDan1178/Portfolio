import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import PolygonTDGamePage from "./pages/games/polygonTD/PolygonTDGamePage";
import EchoArenaGamePage from "./pages/games/echoArena/EchoArenaGamePage";
import MainPage from "./pages/MainPage";
import Bruh from "./pages/misc/Bruh";
import Sidestep2GamePage from "./pages/games/sidestep2/Sidestep2GamePage";
import OriginalMusicPage from "./pages/exhibits/OriginalMusic";
import GamesPage from "./pages/exhibits/Games";


function App() {
  useEffect(() => {
    const handleHashChange = () => {
      // remove hash without reloading or scrolling
      history.replaceState(null, "", window.location.pathname + window.location.search);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div>
        <BrowserRouter> 
          <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/PolygonTD" element={<PolygonTDGamePage/>}/>  
            <Route path="/EchoArena" element={<EchoArenaGamePage/>}/>
            <Route path="/Sidestep2" element={<Sidestep2GamePage/>}/>
            <Route path="/SecretRealPortfolio" element={<Bruh/>}/>
            <Route path="/OST" element={<OriginalMusicPage/>}/>
            <Route path="/Games" element={<GamesPage/>} />
          </Routes>
        </BrowserRouter>
    </div>    
  )
    
}


export default App;
