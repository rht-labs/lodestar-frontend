import React, { useState } from "react";
import {
  Nav,
  NavItem,
  NavList,
} from "@patternfly/react-core";
import { Link } from "react-router-dom";

const NavDefaultList = () => {
  const [activeItem, setActiveItem] = useState<number>(0);

  const onSelect = (result: any) => {
    setActiveItem(result.itemId)
  }

  return (
    <Nav onSelect={onSelect} theme="dark">
      <NavList>
        <NavItem
          id="engagementFormLink"
          itemId={0}
          isActive={activeItem === 0}
        >
          <Link to="/">Engagement Form</Link>
        </NavItem>
        <NavItem id="privateLink" itemId={3} isActive={activeItem === 3}>
          <Link to="/private">Private Page</Link>
        </NavItem>
        <NavItem id="secondPageLink" itemId={1} isActive={activeItem === 1}>
          <Link to="/one">Second Page</Link>
        </NavItem>
        <NavItem id="thirdPageLink" itemId={2} isActive={activeItem === 2}>
          <Link to="/two">Third Page</Link>
        </NavItem>
      </NavList>
    </Nav>
  );
}

export default NavDefaultList;
