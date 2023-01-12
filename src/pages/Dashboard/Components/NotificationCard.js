import React from 'react';
import { CardBody, Card, Row, CardGroup, CardTitle } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Does one of the cards in the Notifications bar
// completely generic, content is worked out in the NotificationsBar
// and passed in as a function prop

const NotificationCard = ({cardName, iconClass, contentRenderer, linkURL='/'}) => 
  <div key={`card_${cardName}`} className="card">
    <Card className="justify-items-stretch noshadow">
      <div>
        <CardGroup className="gx-1 p-2 ">
          <Card className="noshadow m-1">
            <CardTitle className="col-12 card noshadow">
              <Row>
                <div className="col-10">{ cardName }</div>
                <div className="col-1">
                  <Link to ={ linkURL }>
                    <span><i className={iconClass}></i></span>
                  </Link>
                </div>
              </Row>
            </CardTitle>
            <CardBody className="noshadow col-12 p-0">
              <Card className="noshadow col-12">
                <hr />
                <div>{ contentRenderer() }</div>
              </Card>  
            </CardBody>
          </Card>
        </CardGroup>
      </div>
    </Card>
  </div>

NotificationCard.propTypes = {
  cardName: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
  contentRenderer: PropTypes.func.isRequired,
  linkURL: PropTypes.string,
}

export default NotificationCard;
