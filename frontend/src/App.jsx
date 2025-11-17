import {Routes,Route, Navigate} from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/signup';

function App() {
  return (
   <div className='App'>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='*' element={<Navigate to='/' replace/>}/>
    </Routes>
   </div>
  );
}

export default App;
