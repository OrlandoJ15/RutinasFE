import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from '../Sidebar/SidebarData';
import '../Navbar/Navbar.css';
import { IconContext } from 'react-icons';
import SubMenu from '../Sidebar/SubMenu';

/////////////////////////Menu Lateral///////////////

function Navbar() {
  const [sidebar, setSidebar] = useState(true);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>

        <div className='navbar'>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>

        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>

          <ul className='nav-menu-items' onClick={showSidebar}>
          <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>

            {SidebarData.map((item, index) => {
              return (
                <SubMenu item={item} key={index} />
              );
            })}

          </ul>

        </nav>

      </IconContext.Provider>
    </>
  );
}

export default Navbar;

/*<li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>*/