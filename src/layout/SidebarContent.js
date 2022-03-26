import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom';

// //Import Scrollbar
import SimpleBar from 'simplebar-react'

// MetisMenu
import MetisMenu from 'metismenujs'
// import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'

const SidebarContent = () => {
  const ref = useRef();
  const location = useLocation();
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const initMenu = () => {
      new MetisMenu('#side-menu')
    }
    initMenu()
  }, [])

  useEffect(() => {
    ref.current.recalculate()
  })

  useEffect(() => {
    let matchingMenuItem = null;
    const ul = document.getElementById('side-menu')
    const items = ul.getElementsByTagName('a')
    for (let i = 0; i < items.length; ++i) {
      if (location.pathname == items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  }, [location]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add('active')
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== 'side-menu') {
      parent2El.classList.add('mm-show')
    }

    if (parent) {
      parent.classList.add('mm-active')
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add('mm-show') // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add('mm-active') // li
          parent3.childNodes[0].classList.add('mm-active') //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add('mm-show') // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add('mm-show') // li
              parent5.childNodes[0].classList.add('mm-active') // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false
    }
    scrollElement(item);
    return false
  }

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: '100%' }} ref={ref}>
        <div id='sidebar-menu'>
          <ul className='metismenu list-unstyled' id='side-menu'>
      
            <li>
              <Link to='/dashboard' className=''>
                <i className='bx bx-layout'></i>
                
                <span>Dashboard</span>
              </Link>
              
            </li>


            <li>
              <Link to='/fire-alerts' className=' '>
                <i className='bx bxs-hot'></i>
                <span>Fire Alerts</span>
              </Link>
            </li>

            <li>
              <Link to='/chat' className=''>
                <i className='bx bx-copy'></i>
                <span>Data Layers</span>
              </Link>
            </li>
            <li>
              <Link to='/apps-filemanager' className=''>
                <i className='bx bx-calendar-event'></i>
                <span>Events</span>
              </Link>
            </li>

            <li>
              <Link to='/#'>
                <i className='bx bx-clipboard'></i>
                <span>Reports</span>
              </Link>
            </li>

            <li>
              <Link to='/#'>
                <i className='bx bx-bell'></i>
                <span>Notifications</span>
              </Link>
            </li>

            <li>
              <Link to='/#'>
                <i className='bx bxl-twitter'></i>
                <span>Social Monitor</span>
              </Link>
            </li>

            <li>
              <Link to='/#'>
                <i className='bx bx-image'></i>
                <span>In-Situ Cameras</span>
              </Link>
            </li>
  
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default SidebarContent
