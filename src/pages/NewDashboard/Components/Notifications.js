import React, { useEffect, useState }  from 'react';
import { Container, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEventAlerts } from '../../../store/events/action';
import NotificationCard from './NotificationCard';
import { getAllPeople } from '../../../store/people/action';
import { getAllReports } from '../../../store/reports/action';
import { MOCK_MISSIONS } from '../mocks/missionsmock.ts';
import { MOCK_COMMUNICATIONS } from '../mocks/communicationsmock.ts';

const NotificationsBar = () => {
  const dispatch = useDispatch();
  
  let [activityStatusCounts, setActivityStatusCounts] = useState( {undefined: 0} );
  let [peopleStatusCounts, setPeopleStatusCounts] = useState( {undefined: 0} );
  let [reportStatusCounts, setReportStatusCounts] = useState( {undefined: 0});
  let [missionStatusCounts, setMissionStatusCounts] = useState( { undefined: 0} );
  let [communicationStatusCounts, setCommunicationStatusCounts] = useState( { undefined: 0} );

  const defaultAOI = useSelector(state => state?.user?.defaultAoi);
  const { allReports: OrgReportList } = useSelector(state => state?.reports);
  const { allAlerts: alerts, filteredAlerts } = useSelector(state => state?.alerts);
  const { allPeople: orgPplList, filteredPeople } = useSelector(state => state.people);
  const allMissions  =  MOCK_MISSIONS;
  const allCommunications = MOCK_COMMUNICATIONS;

  const nameOfAOI = defaultAOI?.features[0]?.properties?.name;

  const getStatusCountsForItems = (items) => {
    // build an object whose keys are mission types and values are
    // counts of missions matching that status
    let statusCounts = {};
    items.forEach( item => {
      if (item?.status in statusCounts) {
        statusCounts[item.status] += 1;
      } else {
        statusCounts[item.status] = 1;
      }
    })
    return statusCounts;
  }

  // renderer functions. These are passed to the individual NotificationCards
  // These should return some JSX which will be rendered as the contents
  // of the panel. (The panel - NotificationCard - is completely generic)

  const renderer = (noDataMessage, itemsCounts) => {
    if (!itemsCounts) {
      return <h3>Loading...</h3>
    } 
    if (Object.keys(itemsCounts).length===0 ) {
      return <h3>{noDataMessage}</h3>;
    }
    return (
      <>
        {
          Object.keys(itemsCounts).map(key => 
            <h3 key={`item_${key}`}>
              {`${key} : ${itemsCounts[key]}`}
            </h3>
          )
        }
      </>
    );
  }

  const renderCommunications = () => renderer('No new communications', communicationStatusCounts);
  
  const renderActivities = () => renderer('No new activities', activityStatusCounts);

  const renderPeople = () => renderer('No new people activity', peopleStatusCounts);

  const renderReports = () => renderer('No new reports', reportStatusCounts);

  const renderMissions = () => renderer('No new missions', missionStatusCounts);

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
    const statusCounts = getStatusCountsForItems(alerts);
    setActivityStatusCounts(statusCounts);
  }, [filteredAlerts, alerts]);

  useEffect(()=> {
    const statusCounts = getStatusCountsForItems(orgPplList);
    setPeopleStatusCounts(statusCounts);
  }, [orgPplList, filteredPeople])

  useEffect(()=> {
    const statusCounts = getStatusCountsForItems(OrgReportList);
    setReportStatusCounts(statusCounts);
  }, [OrgReportList])

  useEffect(()=> {
    const statusCounts = getStatusCountsForItems(allMissions);
    setMissionStatusCounts(statusCounts);
  }, [allMissions])

  useEffect(()=> {
    const statusCounts = getStatusCountsForItems(allCommunications);
    setCommunicationStatusCounts(statusCounts);
  }, [allCommunications])

  return (
    <div className="">
      <Container fluid className="">
        <p className="align-self-baseline alert-title">Area of interest: { nameOfAOI }</p>
        <Row style={{alignItems: 'stretch', display: 'flex', flexDirection:'row', justifyContent: 'stretch'}} className="grid gx-1 row-cols-5">
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
            contentRenderer={ renderCommunications }
            linkURL="/chatbot?tab=2"
          />
        </Row>
      </Container>
    </div>
  );
}

export default NotificationsBar;
