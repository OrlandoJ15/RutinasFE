import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import './Styles/variables.css'; 

const SidebarLink = styled(Link)`
  display: flex;
  color: var(--color-primario); 
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-base);
  list-style: none;
  height: 65px;
  text-decoration: none;
  font-size: var(--font-size-heading); 
  font-family: var(--font-primary); 

  &:hover {
    background: var(--color-terciario); 
    border-left: 4px solid var(--color-secundario);
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
  color: var(--color-secundario); 
  font-family: var(--font-primary); 
  font-size: var(--font-size-base); 
`;

const DropdownLink = styled(Link)`
  background: var(--color-terciario);
  height: 65px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-primario); 
  font-size: var(--font-size-heading); 
  font-family: var(--font-primary); 

  &:hover {
    background: var(--color-secundario); 
    cursor: pointer;
  }
`;

/*import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Estilo de Menu Lateral
const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background: #252831;
    border-left: 4px solid green;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #252831;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;

  &:hover {
    background: green;
    cursor: pointer;
  }
`;*/

// Configuración de SubMenu Lateral
const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>

      {subnav &&
        item.subNav.map((item, index) => (
          <DropdownLink to={item.path} key={index}>
            {item.icon}
            <SidebarLabel>{item.title}</SidebarLabel>
          </DropdownLink>
        ))}
    </>
  );
};

export default SubMenu;