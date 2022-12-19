import React, { useEffect }  from 'react';
import { Container, Row, Card } from 'reactstrap';
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
    <div className="">
      <Card>
        <Container fluid className="">
          <Row className="gx-1 p-2">
            <Card className="col-9 card p-1">
              <div className="col card-body">{ cardName }</div>
            </Card>
            <Card className="col-3 card p-1">
              <div className="card-body">
                <Link to ={ linkURL }>
                  <span className='d-none d-sm-block'><i className={iconClass}></i></span>
                </Link>
              </div>
            </Card>
          </Row>
          <Row className="gx-1">
            <Card className="col-12 p-1"><div className="card-body">{ contentRenderer() }</div></Card>
          </Row>
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
