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
  changeSidebarType: PropTypes.func,
  children: PropTypes.object,
  leftSideBarType: PropTypes.any,
}



export default Layout;
