import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

import SidebarContent from './SidebarContent'

import { Link } from 'react-router-dom'

import logoPng from '../assets/images/background-light-logo@3x.png'

const Sidebar = props => {

  return (
    <React.Fragment>
      <div className='vertical-menu'>
        <div className='navbar-brand-box'>
          <Link to='/' className='logo logo-light'>
            <span className='logo-sm'>
              <i className='bx bxs-hot fa-2x'></i>
            </span>
            <span className='logo-lg'>
              <img src={logoPng} alt='' height='60' />
            </span>
          </Link>
        </div>
        <div data-simplebar className='h-100'>
          {props.type !== 'condensed' ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className='sidebar-background'></div>
      </div>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
  type: PropTypes.string,
}

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  }
}
export default connect(
  mapStatetoProps,
  {}
)(Sidebar)
