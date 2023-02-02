import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'reactstrap';

import { getAllEventAlerts } from 'store/events/action';
import { getAllPeople } from 'store/people/action';
import { getAllReports } from 'store/reports/action';

import AOIBar from './Components/AOIBar';
import NotificationsBar from './Components/Notifications';
import PhotoBar from './Components/PhotoBar';
import ReportBar from './Components/ReportBar';

const getStatusCountsForItems = items => {
  // build an object whose keys are mission types and values are
  // counts of missions matching that status
  let statusCounts = {};
  items.forEach(item =>
    item?.status in statusCounts
      ? (statusCounts[item.status] += 1)
      : (statusCounts[item.status] = 1),
  );
  return statusCounts;
};

const NewDashboard = () => {
  const dispatch = useDispatch();

  const [activityStatusCounts, setActivityStatusCounts] = useState({});
  const [peopleStatusCounts, setPeopleStatusCounts] = useState({});
  const [reportStatusCounts, setReportStatusCounts] = useState({});
  const [missionStatusCounts, setMissionStatusCounts] = useState({});
  const [communicationStatusCounts, setCommunicationStatusCounts] = useState(
    {},
  );
  const { allPeople: orgPplList, filteredPeople } = useSelector(
    state => state.people,
  );
  // console.log('PEOPLE: ', { orgPplList, filteredPeople });

  const { allReports: OrgReportList } = useSelector(state => state?.reports);
  const { allAlerts: alerts, filteredAlerts } = useSelector(
    state => state?.alerts,
  );
  // console.log('PEOPLE: ', { orgPplList, filteredPeople });
  const allMissions = useSelector(state => state?.missions?.allMissions || []);
  const allCommunications = useSelector(state => state.comms.allComms || []);

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
  }, [dispatch]);

  useEffect(() => {
    const statusCounts = getStatusCountsForItems([{ status: 'null' }]);
    setActivityStatusCounts(statusCounts);
  }, [filteredAlerts, alerts]);

  useEffect(() => {
    const statusCounts = getStatusCountsForItems(orgPplList);
    // console.log('UPDATING PEOPLE COUNTS: ', statusCounts);
    setPeopleStatusCounts(statusCounts);
  }, [orgPplList, filteredPeople]);

  useEffect(() => {
    const statusCounts = getStatusCountsForItems(OrgReportList);
    setReportStatusCounts(statusCounts);
  }, [OrgReportList]);

  useEffect(() => {
    const statusCounts = getStatusCountsForItems(allMissions);
    setMissionStatusCounts(statusCounts);
  }, [allMissions]);

  useEffect(() => {
    const statusCounts = getStatusCountsForItems(allCommunications);
    setCommunicationStatusCounts(statusCounts);
  }, [allCommunications]);

  return (
    <div className="page-content">
      <Container fluid="true" className="sign-up-aoi-map-bg">
        <NotificationsBar
          activityStatusCounts={activityStatusCounts}
          peopleStatusCounts={peopleStatusCounts}
          reportStatusCounts={reportStatusCounts}
          missionStatusCounts={missionStatusCounts}
          communicationStatusCounts={communicationStatusCounts}
        />
        <AOIBar orgPplList={orgPplList} />
        <PhotoBar />
        <ReportBar />
      </Container>
    </div>
  );
};

export default NewDashboard;
