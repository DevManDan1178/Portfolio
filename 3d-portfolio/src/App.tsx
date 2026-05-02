import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import PolygonTDGamePage from "./pages/games/polygonTD/PolygonTDGamePage";
import EchoArenaGamePage from "./pages/games/echoArena/EchoArenaGamePage";
import MainPage from "./pages/MainPage";



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
          </Routes>
        </BrowserRouter>
    </div>    
  )
    
}


export default App;
