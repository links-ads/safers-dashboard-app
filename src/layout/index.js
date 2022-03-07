/* eslint-disable react/react-in-jsx-scope */
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.scss';
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

class Layout extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    }
    this.toggleMenuCallback = this.toggleMenuCallback.bind(this)
  }

  toggleMenuCallback = () => {
    if (this.props.leftSideBarType === 'default') {
      this.props.changeSidebarType('condensed', this.state.isMobile)
    } else if (this.props.leftSideBarType === 'condensed') {
      this.props.changeSidebarType('default', this.state.isMobile)
    }
  }
  render() { 
    return (
      <>
        <div id='preloader'>
          <div id='status'>
            <div className='spinner-chase'>
              <div className='chase-dot' />
              <div className='chase-dot' />
              <div className='chase-dot' />
              <div className='chase-dot' />
              <div className='chase-dot' />
              <div className='chase-dot' />
            </div>
          </div>
        </div>

        <div id='layout-wrapper'>
          <Header toggleMenuCallback={this.toggleMenuCallback} />
          <Sidebar/>
          <div className='main-content'>{this.props.children}</div>
          <Footer />
        </div>
      </>
    )
  }
}

Layout.propTypes = {
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarThemeImage: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarThemeImage: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any
}



export default Layout;
