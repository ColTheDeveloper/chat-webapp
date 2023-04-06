
import { Route,Routes } from 'react-router-dom';
import './App.css';
import Chatpage from './Pages/Chatpage';
import Homepage from './Pages/Homepage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Homepage />}/>
        <Route path='/chats' element={<Chatpage />}/>
      </Routes>
    </div>
  );
}

export default App;
