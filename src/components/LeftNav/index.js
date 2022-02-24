/* eslint-disable react/prop-types */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,
  faPaperPlane,
  faQuestion,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import { NavItem, NavLink, Nav } from 'reactstrap';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

const LeftNav = ({ isOpen, toggle }) => (
  <div className={classNames('left-nav', { 'is-open': isOpen })}>
    <div className="left-nav-header">
      <span color="info" onClick={toggle} style={{ color: '#fff' }}>
        &times;
      </span>
      <h3>Bootstrap LeftNav</h3>
    </div>
    <div className="side-menu">
      <Nav vertical className="list-unstyled pb-3">
        <p>Dummy Heading</p>
        <NavItem>
          <NavLink tag={Link} to={'/page1'}>
            <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
            About
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to={'/page2'}>
            <FontAwesomeIcon icon={faImage} className="mr-2" />
            Portfolio
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to={'/faq'}>
            <FontAwesomeIcon icon={faQuestion} className="mr-2" />
            FAQ
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to={'/contact'}>
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
            Contact
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  </div>
);

export default LeftNav;
