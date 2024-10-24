import './App.css'

import React,{lazy,Suspense} from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';

const Usuario =lazy(()=>import('./Pages/Usuario'));
const Login =lazy(()=>import('./Pages/Login'));
const Home =lazy(()=>import('./Pages/Home'));
const Rutina =lazy(()=>import('./Pages/Rutina'));
const RutinaAccion =lazy(()=>import('./Pages/RutinaAccion'));
const Accion =lazy(()=>import('./Pages/Accion'));
const Cliente =lazy(()=>import('./Pages/Cliente'));

function App() {
  return (
    <Suspense fallback={<p>Cargando</p>}>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' exact element={<Login/>} />
          <Route path='/Home' exact element={<Home/>} />
          <Route path='/Usuario' exact element={<Usuario/>} />
          <Route path='/Rutina' exact element={<Rutina/>} />
          <Route path='/RutinaAccion' exact element={<RutinaAccion/>} />
          <Route path='/Accion' exact element={<Accion/>} />
          <Route path='/Cliente' exact element={<Cliente/>} />
        </Routes>
      </BrowserRouter>
   </Suspense>
  )
}

export default App