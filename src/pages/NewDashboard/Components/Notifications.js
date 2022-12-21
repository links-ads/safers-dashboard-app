import React, { useEffect, useState }  from 'react';
import { Container, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEventAlerts } from '../../../store/events/action';
import NotificationCard from './NotificationCard';
import { getAllPeople } from '../../../store/people/action';
import { getAllReports } from '../../../store/reports/action';
import { MOCK_MISSIONS } from '../mocks/missionsmock.ts';

const NotificationsBar = () => {
  const dispatch = useDispatch();
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  let [activityStatusCounts, setActivityStatusCounts] = useState( {undefined: 0} );
  let [peopleStatusCounts, setPeopleStatusCounts] = useState( {undefined: 0} );
  let [reportStatusCounts, setReportStatusCounts] = useState( {undefined: 0});
  let [missionStatusCounts, setMissionStatusCounts] = useState( { undefined: 0} );

  const defaultAOI = useSelector(state => state?.user?.defaultAoi);
  const { allReports: OrgReportList } = useSelector(state => state?.reports);
  const { allAlerts: alerts, filteredAlerts } = useSelector(state => state?.alerts);
  const { allPeople: orgPplList, filteredPeople } = useSelector(state => state.people);
  const allMissions  =  MOCK_MISSIONS;

  console.log('Alerts!', alerts);
  console.log('orgPplList', orgPplList);
  console.log('filteredPeople', filteredPeople);
  console.log('OrgReportList', OrgReportList);
  console.log('allMissions', allMissions);

  const nameOfAOI = defaultAOI?.features[0]?.properties?.name;

  const getMissionCountByStatus = (missions) => {
    // build an object whose keys are mission types and values are
    // counts of missions matching that status
    let statusCounts = {};
    missions.forEach( mission => {
      if (mission?.status in statusCounts) {
        statusCounts[mission.status] += 1;
      } else {
        statusCounts[mission.status] = 1;
      }
    })
    console.log('missionStatusCounts', statusCounts);
    return statusCounts;
  }

  const getAlertCountByStatus = (alerts) => {
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

  const getReportByAssignment = (reports) => {
    let statusCounts = {};
    // TODO: currently, don't have assignments in the data so catgeorise by hazard type instead for now
    reports.forEach( report=> {
      if (report?.hazard in statusCounts) {
        statusCounts[report.hazard] += 1;
      } else {
        statusCounts[report.hazard] = 1;
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
    if (!activityStatusCounts) {
      return <h3>Loading...</h3>
    } 
    if (Object.keys(activityStatusCounts).length===0 ) {
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
    if (!peopleStatusCounts) {
      return <h3>Loading...</h3>
    } 
    if (Object.keys(peopleStatusCounts).length===0 ) {
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
  };

  const renderReports = () => {
    if (!reportStatusCounts) {
      return <h3>Loading...</h3>
    } 
    if (Object.keys(reportStatusCounts).length===0 ) {
      return <h3>No new Report activity</h3>;
    }
    return (
      <>
        {
          Object.keys(reportStatusCounts).map(key => 
            <h3 key={`item_${key}`}>
              {`${key} : ${reportStatusCounts[key]}`}
            </h3>
          )
        }
      </>
    );
  }

  const renderMissions = () => {
    if (!missionStatusCounts) {
      return <h3>Loading...</h3>
    } 
    if (Object.keys(missionStatusCounts).length===0 ) {
      return <h3>No new Mission activity</h3>;
    }
    return (
      <>
        {
          Object.keys(missionStatusCounts).map(key => 
            <h3 key={`item_${key}`}>
              {`${key} : ${missionStatusCounts[key]}`}
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
    dispatch(getAllReports());
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

  useEffect(()=> {
    console.log('received new reports');
    const statusCounts = getReportByAssignment(OrgReportList);
    setReportStatusCounts(statusCounts);
  }, [OrgReportList])

  useEffect(()=> {
    console.log('received new missions');
    const statusCounts = getMissionCountByStatus(allMissions);
    setMissionStatusCounts(statusCounts);
  }, [allMissions])

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
            contentRenderer={ renderReports }
            linkURL="/chatbot?tab=4"
          />
          <NotificationCard 
            cardName="Mission" 
            iconClass="fas fa-flag-checkered" 
            contentRenderer={ renderMissions }
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
