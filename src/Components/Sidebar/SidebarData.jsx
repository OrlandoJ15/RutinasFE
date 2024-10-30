import React from 'react';
import * as  mancuerna  from "react-icons/io5";
import * as  people  from "react-icons/io5";
import * as  libro  from "react-icons/ri";
import * as  home  from "react-icons/tfi";
import * as  entrenador  from "react-icons/ai";
import * as calendario from "react-icons/bs";
import * as nota from "react-icons/ci";





////////////////SUB MENUS LATERALES//////////////////
//  AQUI: Se agregan todas las opciones del menu.  // 

export const SidebarData = [
  {
    title: 'Inicio',
    path: '/Home',
    icon: <home.TfiHome/>,
    cName: 'nav-text'
  },
  {
    title: 'Clientes',
    path: '/Cliente',
    icon: <people.IoPeopleOutline/>,
    cName: 'nav-text'
  },
  {
    title: 'Rutinas',
    path: '/Rutina',
    icon: <nota.CiCalendar />,
    cName: 'nav-text'
  },
  {
    title: 'Detalles Rutina',
    path: '/RutinaAccion',
    icon: <nota.CiViewList />,
    cName: 'nav-text'
  },
  {
    title: 'Ejercicios',
    path: '/Accion',
    icon: <mancuerna.IoBarbellOutline />,
    cName: 'nav-text'
  },
  {
    title: 'Usuarios',
    path: '/Usuario',
    icon: <nota.CiUser />,
    cName: 'nav-text'
  }
];