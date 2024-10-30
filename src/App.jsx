import './Styles/App.css'

import React,{lazy,Suspense} from 'react';
import './Styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';

const Usuario =lazy(()=>import('src/Pages/Usuario/Usuario.jsx'));
const Login =lazy(()=>import('src/Pages/Login/Login.jsx'));
const Home =lazy(()=>import('src/Pages/Home/Home.jsx'));
const Rutina =lazy(()=>import('src/Pages/Rutina/Rutina.jsx'));
const RutinaAccion =lazy(()=>import('src/Pages/RutinaAccion/RutinaAccion.jsx'));
const Accion =lazy(()=>import('src/Pages/Accion/Accion.jsx'));
const Cliente =lazy(()=>import('src/Pages/Cliente/Cliente.jsx'));

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