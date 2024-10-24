import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Usuario from '../Pages/Usuario';
import Login from '../Pages/Login';
import Home from '../Pages/Home';
import Logout from '../Pages/Logout';
import Rutina from '../Pages/Rutina';
import RutinaAccion from '../Pages/RutinaAccion';
import Accion from '../Pages/Accion';
import Cliente from '../Pages/Cliente';
import Navbar from "../Components/Navbar";


function Router() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" exact element={<Login />} />
                <Route path="/Home" exact element={<Home />} />
                <Route path="/Usuario" exact element={<Usuario />} />
                <Route path="/Logout" exact element={<Logout />} />
                <Route path="/Rutina" exact element={<Rutina />} />
                <Route path="/RutinaAccion" exact element={<RutinaAccion />} />
                <Route path="/Accion" exact element={<Accion />} />
                <Route path="/Cliente" exact element={<Cliente />} />
            </Routes>
        </BrowserRouter>

    );
};

export default Router;

/*import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Usuario from '../Pages/Usuario'
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Navbar from "../Components/Navbar";
import Logout from "../Pages/Logout";
import Rutina from "../Pages/Rutina";
import RutinaAccion from "../Pages/RutinaAccion";
import Accion from "../Pages/Accion";
import Cliente from "../Pages/Cliente";

function Router () {
    return (

        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" exact element={<Login/>} />
                <Route path="/Home" exact element={<Home/>} />
                <Route path="/Usuario" exact element={<Usuario/>} />
                <Route path="/Logout" exact element={<Logout/>} />
                <Route path="/Rutina" exact element={<Rutina/>} />
                <Route path="/RutinaAccion" exact element={<RutinaAccion/>} />
                <Route path="/Accion" exact element={<Accion/>} />
                <Route path="/Cliente" exact element={<Cliente/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;*/
