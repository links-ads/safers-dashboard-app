import React , { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, Container, Row, Col, CardText } from 'reactstrap';
import classnames from 'classnames';
import UpdateProfile from './UpdateProfile';


const MyProfile = () => {

  const [customActiveTab, setCustomActiveTab] = useState('1');

  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setCustomActiveTab(tab)
    }
  }

  return (
    <div className="page-content">
      <Container fluid className='p-0'>
        <Row className='g-0'>
          <Col>
            <div className='tab-container p-3'>
              <Nav tabs className='nav-default nav-tabs-custom nav-justified'>
                <NavItem>
                  <NavLink
                    style={{ cursor: 'pointer' }}
                    className={classnames({
                      active: customActiveTab === '1',
                    })}
                    onClick={() => {
                      toggleCustom('1')
                    }}
                  >
                    <span className='d-none d-sm-block me-2'><i className='fas fa-user-alt'></i></span>
                    <span className='d-block'>My Profile</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: 'pointer' }}
                    className={classnames({
                      active: customActiveTab === '2',
                    })}
                    onClick={() => {
                      toggleCustom('2')
                    }}
                  >
                    <span className='d-none d-sm-block me-2'><i className='fas fa-lock'></i></span>
                    <span className='d-block'>Change Password</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: 'pointer' }}
                    className={classnames({
                      active: customActiveTab === '3',
                    })}
                    onClick={() => {
                      toggleCustom('3')
                    }}
                  >
                    <span className='d-none d-sm-block me-2'><i className='fas fa-flag-checkered'></i></span>
                    <span className='d-block'>Area of Interest</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={customActiveTab} className="p-3">
                <TabPane tabId="1">
                  <UpdateProfile />
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <CardText className="mb-0">
                        Food truck fixie locavore, accusamus 
                        marfa nulla single-origin coffee squid.
                        Exercitation +1 labore velit, blog sartorial PBR
                        leggings next level wes anderson artisan four loko
                        farm-to-table craft beer twee. Qui photo booth
                        letterpress, commodo enim craft beer mlkshk
                        aliquip jean shorts ullamco ad vinyl cillum PBR.
                        Homo nostrud organic, assumenda labore aesthetic
                        magna delectus mollit. Keytar helvetica VHS salvia
                        yr, vero magna velit sapiente labore stumptown.
                        Vegan fanny pack odio cillum wes anderson 8-bit.
                      </CardText>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Col sm="12">
                      <CardText className="mb-0">
                        Etsy mixtape wayfarers, ethical wes anderson tofu
                        before they sold out  organic lomo
                        retro fanny pack lo-fi farm-to-table readymade.
                        Messenger bag gentrify pitchfork tattooed craft
                        beer, iphone skateboard locavore carles etsy
                        salvia banksy hoodie helvetica. DIY synth PBR
                        banksy irony. Leggings gentrify squid 8-bit cred
                        pitchfork. Williamsburg banh mi whatever
                        gluten-free, carles pitchfork biodiesel fixie etsy
                        retro mlkshk vice blog. Scenester cred you
                        probably heard of them, vinyl craft beer
                        blog stumptown. Pitchfork sustainable tofu synth
                        chambray yr.
                      </CardText>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Col sm="12">
                      <CardText className="mb-0">
                        Trust fund seitan letterpress, keytar raw denim
                        keffiyeh etsy art party before they sold out
                        master cleanse gluten-free squid scenester freegan
                        cosby sweater. Fanny pack portland seitan DIY, art
                        party locavore wolf cliche high life echo park
                        Austin. Cred vinyl keffiyeh DIY salvia PBR, banh
                        mi before they sold out farm-to-table VHS viral
                        locavore cosby sweater. Lomo wolf viral, mustache
                        readymade thundercats keffiyeh craft beer marfa
                        ethical. Wolf salvia freegan, sartorial keffiyeh
                        echo park vegan.
                      </CardText>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MyProfile;
