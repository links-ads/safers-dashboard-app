import React, { useEffect }  from 'react';
import { Container, CardBody, Card, Row, CardGroup, CardTitle } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { getAllEventAlerts } from '../../../store/events/action';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Does one of the cards in the Notifications bar
// completely generic, content is worked out in the NotificationsBar
// and passed in as a function prop

const NotificationCard = ({cardName, iconClass, contentRenderer, linkURL='/'}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventAlerts());
  }, []);

  return (
    <div className="card noborder">
      <Card className="justify-items-stretch">
        <Container fluid>
          <CardGroup className="gx-1 p-2 ">
            <Card className="noborder">
              <CardTitle className="col-12 card p-1 ">
                <Row>
                  <div className="col-9">{ cardName }</div>
                  <div className="col-3">
                    <Link to ={ linkURL }>
                      <span className='d-none d-sm-block'><i className={iconClass}></i></span>
                    </Link>
                  </div>
                </Row>
              </CardTitle>
              <CardBody className="noborder col-12 p-1">
                <Card className="noborder col-12 p-1">
                  <div className="">{ contentRenderer() }</div>
                </Card>  
              </CardBody>
            </Card>
          </CardGroup>
        </Container>
      </Card>
    </div>
  );
}

NotificationCard.propTypes = {
  cardName: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
  contentRenderer: PropTypes.func.isRequired,
  linkURL: PropTypes.string,
}

export default NotificationCard;