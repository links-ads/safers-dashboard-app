import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'

// //Import Scrollbar
import SimpleBar from 'simplebar-react'

// MetisMenu
import MetisMenu from 'metismenujs'
// import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'

const SidebarContent = () => {
  const ref = useRef()
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = '';

    const initMenu = () => {
      new MetisMenu('#side-menu')
      let matchingMenuItem = null
      const ul = document.getElementById('side-menu')
      const items = ul.getElementsByTagName('a')
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i]
          break
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem)
      }
    }
    initMenu()
  }, [])

  useEffect(() => {
    ref.current.recalculate()
  })

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
            <li className='menu-title'>Menu </li>
            <li>
              <Link to='/#' className=''>
                <i className='bx bx-home-circle'></i>
                <span className='badge rounded-pill bg-info float-end'>
                  04
                </span>
                <span>Dashboards</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/dashboard'>Default</Link>
                </li>
                <li>
                  <Link to='/dashboard-saas'>Saas</Link>
                </li>
                <li>
                  <Link to='/dashboard-crypto'>Crypto</Link>
                </li>
                <li>
                  <Link to='/blog'>Blog</Link>
                </li>
              </ul>
            </li>

            <li className='menu-title'>Apps</li>

            <li>
              <Link to='/calendar' className=' '>
                <i className='bx bx-calendar'></i>
                <span>Calendar</span>
              </Link>
            </li>

            <li>
              <Link to='/chat' className=''>
                <i className='bx bx-chat'></i>
                <span>Chat</span>
              </Link>
            </li>
            <li>
              <Link to='/apps-filemanager' className=''>
                <i className='bx bx-file'></i>
                <span className='badge rounded-pill bg-success float-end'>
                  New
                </span>
                <span>File Manager</span>
              </Link>
            </li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bx-store'></i>
                <span>Ecommerce</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/ecommerce-products'>Products</Link>
                </li>
                <li>
                  <Link to='/ecommerce-product-detail/1'>
                    Product Detail
                  </Link>
                </li>
                <li>
                  <Link to='/ecommerce-orders'>Orders</Link>
                </li>
                <li>
                  <Link to='/ecommerce-customers'>Customers</Link>
                </li>
                <li>
                  <Link to='/ecommerce-cart'>Cart</Link>
                </li>
                <li>
                  <Link to='/ecommerce-checkout'>Checkout</Link>
                </li>
                <li>
                  <Link to='/ecommerce-shops'>Shops</Link>
                </li>
                <li>
                  <Link to='/ecommerce-add-product'>
                    Add Product
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bx-bitcoin'></i>
                <span>Crypto</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/crypto-wallet'>Wallet</Link>
                </li>
                <li>
                  <Link to='/crypto-buy-sell'>Buy/Sell</Link>
                </li>
                <li>
                  <Link to='/crypto-exchange'>Exchange</Link>
                </li>
                <li>
                  <Link to='/crypto-lending'>Lending</Link>
                </li>
                <li>
                  <Link to='/crypto-orders'>Orders</Link>
                </li>
                <li>
                  <Link to='/crypto-kyc-application'>
                    KYC Application
                  </Link>
                </li>
                <li>
                  <Link to='/crypto-ico-landing'>ICO Landing</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bx-envelope'></i>
                <span>Email</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/email-inbox'>Inbox</Link>
                </li>
                <li>
                  <Link to='/email-read'>Read Email </Link>
                </li>
                <li>
                  <Link to='/#'>
                    <span
                      className='badge rounded-pill badge-soft-success float-end'
                      key='t-new'
                    >
                      New
                    </span>
                    <span key='t-email-templates'>Templates</span>
                  </Link>
                  <ul className='sub-menu' aria-expanded='false'>
                    <li>
                      <Link to='/email-template-basic'>
                        Basic Action
                      </Link>
                    </li>
                    <li>
                      <Link to='/email-template-alert'>
                        Alert Email{' '}
                      </Link>
                    </li>
                    <li>
                      <Link to='/email-template-billing'>
                        Billing Email{' '}
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bx-receipt'></i>
                <span>Invoices</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/invoices-list'>Invoice List</Link>
                </li>
                <li>
                  <Link to='/invoices-detail'>Invoice Detail</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bx-briefcase-alt-2'></i>
                <span>Projects</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/projects-grid'>Projects Grid</Link>
                </li>
                <li>
                  <Link to='/projects-list'>Projects List</Link>
                </li>
                <li>
                  <Link to='/projects-overview'>
                    Project Overview
                  </Link>
                </li>
                <li>
                  <Link to='/projects-create'>Create New</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bx-task'></i>
                <span>Tasks</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/tasks-list'>Task List</Link>
                </li>
                <li>
                  <Link to='/tasks-kanban'>Kanban Board</Link>
                </li>
                <li>
                  <Link to='/tasks-create'>Create Task</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bxs-user-detail'></i>
                <span>Contacts</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/contacts-grid'>User Grid</Link>
                </li>
                <li>
                  <Link to='/contacts-list'>User List</Link>
                </li>
                <li>
                  <Link to='/contacts-profile'>Profile</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className=''>
                <span className='badge rounded-pill bg-success float-end'>
                  New
                </span>
                <i className='bx bxs-detail' />

                <span>Blog</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/blog-list'>Blog List</Link>
                </li>
                <li>
                  <Link to='/blog-grid'>Blog Grid</Link>
                </li>
                <li>
                  <Link to='/blog-details'>Blog Details</Link>
                </li>
              </ul>
            </li>

            <li className='menu-title'>Pages</li>
            <li>
              <Link to='/#' className=''>
                <i className='bx bx-user-circle'></i>
                <span className='badge rounded-pill bg-success float-end'>
                  New
                </span>
                <span>Authentication</span>
              </Link>
              <ul className='sub-menu'>
                <li>
                  <Link to='/pages-login'>Login</Link>
                </li>
                <li>
                  <Link to='/pages-login-2'>Login 2</Link>
                </li>
                <li>
                  <Link to='/pages-register'>Register</Link>
                </li>
                <li>
                  <Link to='/pages-register-2'>Register 2</Link>
                </li>
                <li>
                  <Link to='/page-recoverpw'>
                    Recover Password
                  </Link>
                </li>
                <li>
                  <Link to='/page-recoverpw-2'>
                    Recover Password 2
                  </Link>
                </li>
                <li>
                  <Link to='/auth-lock-screen'>Lock Screen</Link>
                </li>
                <li>
                  <Link to='/auth-lock-screen-2'>
                    Lock Screen 2
                  </Link>
                </li>
                <li>
                  <Link to='/page-confirm-mail'>Confirm Mail</Link>
                </li>
                <li>
                  <Link to='/page-confirm-mail-2'>
                    Confirm Mail 2
                  </Link>
                </li>
                <li>
                  <Link to='/auth-email-verification'>
                    Email verification
                  </Link>
                </li>
                <li>
                  <Link to='/auth-email-verification-2'>
                    Email verification 2
                  </Link>
                </li>
                <li>
                  <Link to='/auth-two-step-verification'>
                    Two step verification
                  </Link>
                </li>
                <li>
                  <Link to='/auth-two-step-verification-2'>
                    Two step verification 2
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bx-file'></i>
                <span>Utility</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/pages-starter'>Starter Page</Link>
                </li>
                <li>
                  <Link to='/pages-maintenance'>Maintenance</Link>
                </li>
                <li>
                  <Link to='/pages-comingsoon'>Coming Soon</Link>
                </li>
                <li>
                  <Link to='/pages-timeline'>Timeline</Link>
                </li>
                <li>
                  <Link to='/pages-faqs'>FAQs</Link>
                </li>
                <li>
                  <Link to='/pages-pricing'>Pricing</Link>
                </li>
                <li>
                  <Link to='/pages-404'>Error 404</Link>
                </li>
                <li>
                  <Link to='/pages-500'>Error 500</Link>
                </li>
              </ul>
            </li>

            <li className='menu-title'>Components</li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bx-tone'></i>
                <span>UI Elements</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/ui-alerts'>Alerts</Link>
                </li>
                <li>
                  <Link to='/ui-buttons'>Buttons</Link>
                </li>
                <li>
                  <Link to='/ui-cards'>Cards</Link>
                </li>
                <li>
                  <Link to='/ui-carousel'>Carousel</Link>
                </li>
                <li>
                  <Link to='/ui-dropdowns'>Dropdowns</Link>
                </li>
                <li>
                  <Link to='/ui-grid'>Grid</Link>
                </li>
                <li>
                  <Link to='/ui-images'>Images</Link>
                </li>
                <li>
                  <Link to='/ui-lightbox'>Lightbox</Link>
                </li>
                <li>
                  <Link to='/ui-modals'>Modals</Link>
                </li>
                <li>
                  <Link to='/ui-rangeslider'>Range Slider</Link>
                </li>
                <li>
                  <Link to='/ui-session-timeout'>
                    Session Timeout
                  </Link>
                </li>
                <li>
                  <Link to='/ui-progressbars'>Progress Bars</Link>
                </li>
                <li>
                  <Link to='/ui-sweet-alert'>Sweet-Alert</Link>
                </li>
                <li>
                  <Link to='/ui-tabs-accordions'>
                    Tabs & Accordions
                  </Link>
                </li>
                <li>
                  <Link to='/ui-typography'>Typography</Link>
                </li>
                <li>
                  <Link to='/ui-video'>Video</Link>
                </li>
                <li>
                  <Link to='/ui-general'>General</Link>
                </li>
                <li>
                  <Link to='/ui-colors'>Colors</Link>
                </li>
                <li>
                  <Link to='/ui-rating'>Rating</Link>
                </li>
                <li>
                  <Link to='/ui-notifications'>Notifications</Link>
                </li>
                <li>
                  <Link to='/ui-drawer'>Drawer</Link>
                </li>
                <li>
                  <Link to='/ui-breadcrumb'>
                    Breadcrumb
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className=''>
                <i className='bx bxs-eraser'></i>
                <span className='badge badge-pill bg-danger float-end'>
                  10
                </span>
                <span>Forms</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/form-elements'>Form Elements</Link>
                </li>
                <li>
                  <Link to='/form-layouts'>Form Layouts</Link>
                </li>
                <li>
                  <Link to='/form-validation'>
                    Form Validation
                  </Link>
                </li>
                <li>
                  <Link to='/form-advanced'>Form Advanced</Link>
                </li>
                <li>
                  <Link to='/form-editors'>Form Editors</Link>
                </li>
                <li>
                  <Link to='/form-uploads'>Form File Upload </Link>
                </li>
                <li>
                  <Link to='/form-xeditable'>Form Xeditable</Link>
                </li>
                <li>
                  <Link to='/form-repeater'>Form Repeater</Link>
                </li>
                <li>
                  <Link to='/form-wizard'>Form Wizard</Link>
                </li>
                <li>
                  <Link to='/form-mask'>Form Mask</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bx-list-ul'></i>
                <span>Tables</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/tables-basic'>Basic Tables</Link>
                </li>
                <li>
                  <Link to='/tables-datatable'>Data Tables</Link>
                </li>
                <li>
                  <Link to='/tables-responsive'>
                    Responsive Table
                  </Link>
                </li>
                <li>
                  <Link to='/tables-editable'>Editable Table</Link>
                </li>
                <li>
                  <Link to='/tables-dragndrop'>Drag & Drop Table</Link>
                </li>
                <li>
                  <Link to='/dual-listbox'>Transfer List</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bxs-bar-chart-alt-2'></i>
                <span>Charts</span>
              </Link>

              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/apex-charts'>Apex charts</Link>
                </li>
                <li>
                  <Link to='/chartist-charts'>Chartist Chart</Link>
                </li>
                <li>
                  <Link to='/chartjs-charts'>Chartjs Chart</Link>
                </li>
                <li>
                  <Link to='/e-charts'>E Chart</Link>
                </li>
                <li>
                  <Link to='/tui-charts'>Toast UI Chart</Link>
                </li>
                <li>
                  <Link to='/sparkline-charts'>
                    Sparkline Chart
                  </Link>
                </li>
                <li>
                  <Link to='/charts-knob'>Knob Chart</Link>
                </li>
                <li>
                  <Link to='/re-charts'>Re Chart</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bx-aperture'></i>
                <span>Icons</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/icons-boxicons'>Boxicons</Link>
                </li>
                <li>
                  <Link to='/icons-materialdesign'>
                    Material Design
                  </Link>
                </li>
                <li>
                  <Link to='/icons-dripicons'>Dripicons</Link>
                </li>
                <li>
                  <Link to='/icons-fontawesome'>Font awesome</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bx-map'></i>
                <span>Maps</span>
              </Link>
              <ul className='sub-menu' aria-expanded='false'>
                <li>
                  <Link to='/maps-google'>Google Maps</Link>
                </li>
                <li>
                  <Link to='/maps-vector'>Vector Maps</Link>
                </li>
                <li>
                  <Link to='/maps-leaflet'>Leaflet Maps</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to='/#' className='has-arrow '>
                <i className='bx bx-share-alt'></i>
                <span>Multi Level</span>
              </Link>
              <ul className='sub-menu' aria-expanded='true'>
                <li>
                  <Link to='/#'>Level 1.1</Link>
                </li>
                <li>
                  <Link to='/#' className='has-arrow'>
                    Level 1.2
                  </Link>
                  <ul className='sub-menu' aria-expanded='true'>
                    <li>
                      <Link to='/#'>Level 2.1</Link>
                    </li>
                    <li>
                      <Link to='/#'>Level 2.2</Link>
                    </li>
                  </ul>
                </li>
              </ul>
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
