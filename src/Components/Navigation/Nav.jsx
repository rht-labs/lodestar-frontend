import React from "react";
import {
  Nav,
  NavExpandable,
  NavItem,
  NavItemSeparator,
  NavList,
  NavGroup,
  NavVariants
} from "@patternfly/react-core";
import { Link } from "react-router-dom";

class NavDefaultList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 0
    };
    this.onSelect = result => {
      this.setState({
        activeItem: result.itemId
      });
    };
  }

  render() {
    const { activeItem } = this.state;
    return (
      <Nav onSelect={this.onSelect} theme="dark">
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
}

// const Logo = () => (
//   <ul>
//     <li>
//       <Link to="/">Form</Link>
//     </li>
//     <li>
//       <Link to="/about">About</Link>
//     </li>
//     <li>
//       <Link to="/dashboard">Dashboard</Link>
//     </li>
//   </ul>
// );

export default NavDefaultList;
