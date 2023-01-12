import React, { Fragment, useEffect, useState }  from 'react';
import { Container, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEventAlerts } from '../../../store/events/action';
import NotificationCard from './NotificationCard';
import { getAllPeople } from '../../../store/people/action';
import { getAllReports } from '../../../store/reports/action';
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types';

const NotificationsBar = ({ t }) => {
  const dispatch = useDispatch();
  
  const [activityStatusCounts, setActivityStatusCounts] = useState( {undefined: 0} );
  const [peopleStatusCounts, setPeopleStatusCounts] = useState( {undefined: 0} );
  const [reportStatusCounts, setReportStatusCounts] = useState( {undefined: 0});
  const [missionStatusCounts, setMissionStatusCounts] = useState( { undefined: 0} );
  const [communicationStatusCounts, setCommunicationStatusCounts] = useState( { undefined: 0} );

  const defaultAOI = useSelector(state => state?.user?.defaultAoi);
  const { allReports: OrgReportList } = useSelector(state => state?.reports);
  const { allAlerts: alerts, filteredAlerts } = useSelector(state => state?.alerts);
  const { allPeople: orgPplList, filteredPeople } = useSelector(state => state.people);
  const allMissions  =  useSelector(state => state?.missions?.allMissions || []);
  const allCommunications = useSelector(state => state.comms.allComms  || []);

  const nameOfAOI = defaultAOI?.features[0]?.properties?.name;

  const getStatusCountsForItems = (items) => {
    // build an object whose keys are mission types and values are
    // counts of missions matching that status
    let statusCounts = {};
    items.forEach( item => 
      item?.status in statusCounts
        ? statusCounts[item.status] += 1
        : statusCounts[item.status] = 1
    )
    return statusCounts;
  }

  // renderer functions. These are passed to the individual NotificationCards
  // These should return some JSX which will be rendered as the contents
  // of the panel. (The panel - NotificationCard - is completely generic)

  const renderer = (noDataMessage, label, itemsCounts) => {
    if (!itemsCounts) {
      return <p>Loading...</p>
    } 
    if (Object.keys(itemsCounts).length === 0 ) {
      return <p>{noDataMessage}</p>;
    }
    return (
      <>
        {
          Object.keys(itemsCounts).map(key => 
            <Fragment key={`${label}_row_${key}`}>
              <Row fluid="true" xs={2}>
                <div className="w-8">
                  {`${key}`}
                </div>
                <div className="w-2">
                  {`${itemsCounts[key]}`}
                </div>
              </Row><hr />
            </Fragment>
          )
        }
      </>
    );
  }

  const renderCommunications = () => renderer(t('No new communications', {ns: 'dashboard'}), 'comms', communicationStatusCounts);
  
  const renderActivities = () => renderer(t('No new activities', {ns: 'dashboard'}), 'act', activityStatusCounts);

  const renderPeople = () => renderer(t('No new people activity', {ns: 'dashboard'}), 'ppl', peopleStatusCounts);

  const renderReports = () => renderer(t('No new reports', {ns: 'dashboard'}), 'reps', reportStatusCounts);

  const renderMissions = () => renderer(t('No new missions', {ns: 'dashboard'}), 'miss', missionStatusCounts);

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
    <div className="mx-2 px-1">
      <Container fluid="true">
        <p className="align-self-baseline alert-title">{t('Area of Interest')} : { nameOfAOI }</p>
        <Row xs={1} sm={2} md={3} lg={5} >
          <NotificationCard 
            cardName={t('fire-alerts')}
            iconClass="bx bx-error-circle" 
            contentRenderer={ renderActivities }
            linkURL="/"
          />
          <NotificationCard 
            cardName={t('people')}
            iconClass="fas fa-user-alt" 
            contentRenderer={ renderPeople }
            linkURL="/chatbot?tab=1"
          />
          <NotificationCard 
            cardName={t('Reports')}
            iconClass="fas fa-file-image" 
            contentRenderer={ renderReports }
            linkURL="/chatbot?tab=4"
          />
          <NotificationCard 
            cardName={t('mission')}
            iconClass="fas fa-flag-checkered" 
            contentRenderer={ renderMissions }
            linkURL="/chatbot?tab=3"
          />
          <NotificationCard 
            cardName={t('comms')}
            iconClass="fas fa-envelope" 
            contentRenderer={ renderCommunications }
            linkURL="/chatbot?tab=2"
          />
        </Row>
      </Container>
    </div>
  );
}

NotificationsBar.propTypes = {
  t: PropTypes.func
}

export default withTranslation(['common'])(NotificationsBar);
