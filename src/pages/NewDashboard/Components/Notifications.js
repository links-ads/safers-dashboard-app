import React, { useEffect, useState }  from 'react';
import { Container, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEventAlerts } from '../../../store/events/action';
import NotificationCard from './NotificationCard';
import { getAllPeople } from '../../../store/people/action';
//import { set } from 'lodash';

const NotificationsBar = () => {
  const dispatch = useDispatch();
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  let [activityStatusCounts, setActivityStatusCounts] = useState( {undefined: 0} );
  let [peopleStatusCounts, setPeopleStatusCounts] = useState( {undefined: 0} );

  const defaultAOI = useSelector(state => state?.user?.defaultAoi);
  const { allAlerts: alerts, filteredAlerts } = useSelector(state => state?.alerts);
  const { allPeople: orgPplList, filteredPeople } = useSelector(state => state.people);

  console.log('Alerts!', alerts);
  console.log('orgPplList', orgPplList);
  console.log('filteredPeople', filteredPeople);

  const nameOfAOI = defaultAOI?.features[0]?.properties?.name;

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
    console.log('statusCounts', statusCounts);
    return statusCounts;
  };


  const getPersonCountByStatus = (people) => {
    let statusCounts = {};
    people.forEach( person=> {
      if (person?.status in statusCounts) {
        statusCounts[person.status] += 1;
      } else {
        statusCounts[person.status] = 1;
      }
    })
    console.log('statusCounts', statusCounts);
    return statusCounts;
  }

  // renderer functions. These are passed to the individual NotificationCards
  // These should return some JSX which will be rendered as the contents
  // of the panel. (The panel - NotificationCard - is completely generic)

  const renderLorem = () => {
    return lorem;
  };

  const renderActivities = () => {
    if (!activityStatusCounts || Object.keys(activityStatusCounts).length===0 ) {
      return <h3>No new Event activity</h3>;
    }
    return (
      <>
        {
          Object.keys(activityStatusCounts).map(key => 
            <h3 key={`item_${key}`}>
              {`${key} : ${activityStatusCounts[key]}`}
            </h3>
          )
        }
      </>
    );
  }

  const renderPeople = () => {
    if (!peopleStatusCounts || Object.keys(peopleStatusCounts).length===0 ) {
      return <h3>No new People activity</h3>;
    }
    return (
      <>
        {
          Object.keys(peopleStatusCounts).map(key => 
            <h3 key={`item_${key}`}>
              {`${key} : ${peopleStatusCounts[key]}`}
            </h3>
          )
        }
      </>
    );
  }

  // useEffects

  useEffect(() => {
    dispatch(getAllEventAlerts());
    const params = {
      bbox: undefined,
      default_date: false,
      default_bbox: false,
    };
    const feFilters = {};
    dispatch(getAllPeople(params, feFilters));
  }, []);

  useEffect(() => {
    console.log('received new alerts');
    const statusCounts = getAlertCountByStatus(alerts);
    setActivityStatusCounts(statusCounts);
  }, [filteredAlerts, alerts]);

  useEffect(()=> {
    console.log('received new people');
    const statusCounts = getPersonCountByStatus(orgPplList);
    setPeopleStatusCounts(statusCounts);
  }, [orgPplList, filteredPeople])

  return (
    <div className="">
      <Container fluid className="">
        <p className="align-self-baseline alert-title">Area of interest: { nameOfAOI }</p>
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
            contentRenderer={ renderPeople }
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
