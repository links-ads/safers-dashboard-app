import React, { useEffect }  from 'react';
import { Container, Row, Card } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { getAllEventAlerts } from '../../../store/events/action';
import PropTypes from 'prop-types';

const NotificationCard = ({cardName, iconClass, content}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventAlerts());
  }, []);

  return (
    <div className="">
      <Card>
        <Container fluid className="">
          <Row className="gx-1">
            <Card className="col-8 card p-1">
              <div className="col card-body">{ cardName }</div>
            </Card>
            <Card className="col-4 card p-1">
              <div className="card-body">
                <span className='d-none d-sm-block'><i className={iconClass}></i></span>
              </div>
            </Card>
          </Row>
          <Row className="gx-1">
            <Card className="col-12 p-1"><div className="card-body">{ content }</div></Card>
          </Row>
        </Container>
      </Card>
    </div>
  );
}

NotificationCard.propTypes = {
  cardName: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
}

export default NotificationCard;
