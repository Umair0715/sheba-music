import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import Audio from './pages/Audio';
import Globe from './pages/Globe';
import Home from './pages/Home';
import Login from './pages/Login';
import Player from './pages/Player';

function App() {
  
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path='/' element={ <Home /> } />
                    <Route path='/login' element={<Login />} />
                    <Route path='/audio' element={<Audio />} />
                    <Route path='/player' element={<Player />} />
                    <Route path='/globe' element={<Globe />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
