import React, { useEffect, useState }  from 'react';
import { Container, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEventAlerts } from '../../../store/events/action';
import NotificationCard from './NotificationCard';
//import { set } from 'lodash';

const NotificationsBar = () => {
  const dispatch = useDispatch();
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  let [activityStatusCounts, setActivityStatusCounts] = useState({undefined: 0});
  const defaultAoi = useSelector(state => state?.user?.defaultAoi);
  const { allAlerts: alerts, filteredAlerts } = useSelector(state => state?.alerts);
  
  console.log('defaultAOI', defaultAoi);

  console.log('alerts', alerts);
  console.log('filteredalerts', filteredAlerts);

  const getAlertCountByStatus = (alerts) => {
    // build an object whose keys are alert types and values are
    // counts of alerts matching that status
    let statusCounts = {};
    alerts.forEach( alert=> {
      if (alert?.status in statusCounts) {
        statusCounts[alert.status] += 1;
      } else {
        statusCounts[alert.status] = 1;
      }
    })
    console.log('Status Counts', statusCounts);
    return statusCounts;
  };

  // renderer functions. These are passed to the individual NotificationCards
  // These should return some JSX which will be rendered as the contents
  // of the panel. (The panel - NotificationCard - is completely generic)

  const renderLorem = () => {
    return lorem;
  };

  const renderActivities = () => {
    if (!activityStatusCounts) {
      console.log('bugging out');
      return null;
    }
    Object.keys(activityStatusCounts).forEach(key => console.log('Status count', `${key} : ${activityStatusCounts[key]}`))
    return (
      <>
        {
          Object.keys(activityStatusCounts).map(key => 
            <h1 key={`item_${key}`}>
              {`${key} : ${activityStatusCounts[key]}`}
            </h1>
          )
        }
      </>
    );
  }

  // useEffects

  useEffect(() => {
    dispatch(getAllEventAlerts());
  }, []);

  useEffect(() => {
    const statusCounts = getAlertCountByStatus(alerts);
    setActivityStatusCounts(statusCounts);
  }, [filteredAlerts, alerts]);

  return (
    <div className="">
      <Container fluid className="">
        <p className="align-self-baseline alert-title">Dashboard</p>
        <Row className="gx-1 row-cols-5">
          <NotificationCard 
            cardName="Fire Alerts" 
            iconClass="bx bx-error-circle" 
            contentRenderer={ renderActivities }
            linkURL="/"
          />
          <NotificationCard 
            cardName="People" 
            iconClass="fas fa-user-alt" 
            contentRenderer={ renderLorem }
            linkURL="/chatbot?tab=1"
          />
          <NotificationCard 
            cardName="Reports" 
            iconClass="fas fa-file-image" 
            contentRenderer={ renderLorem }
            linkURL="/chatbot?tab=4"
          />
          <NotificationCard 
            cardName="Mission" 
            iconClass="fas fa-flag-checkered" 
            contentRenderer={ renderLorem }
            linkURL="/chatbot?tab=3"
          />
          <NotificationCard 
            cardName="Communications" 
            iconClass="fas fa-envelope" 
            contentRenderer={ renderLorem }
            linkURL="/chatbot?tab=2"
          />
        </Row>
      </Container>
    </div>
  );
}

export default NotificationsBar;
