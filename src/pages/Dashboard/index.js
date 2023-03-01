import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'reactstrap';

import {
  fetchAlerts,
  allAlertsSelector,
  filteredAlertsSelector,
} from 'store/alerts.slice';
import { fetchComms, allCommsSelector } from 'store/comms.slice';
import { fetchMapRequests } from 'store/datalayer.slice';
import { fetchEvents } from 'store/events.slice';
import { fetchMissions, allMissionsSelector } from 'store/missions.slice';
import {
  fetchPeople,
  allPeopleSelector,
  filteredPeopleSelector,
} from 'store/people.slice';
import { fetchReports, allReportsSelector } from 'store/reports.slice';

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
  const orgPplList = useSelector(allPeopleSelector);
  const filteredPeople = useSelector(filteredPeopleSelector);

  const orgReportList = useSelector(allReportsSelector);

  const alerts = useSelector(allAlertsSelector);
  const filteredAlerts = useSelector(filteredAlertsSelector);

  const allMissions = useSelector(allMissionsSelector);
  const allCommunications = useSelector(allCommsSelector);

  const layerVisibilities = {
    events: true,
    alerts: false,
    people: false,
    reports: false,
    missions: false,
    communications: false,
  };

  const [visibleLayers, setVisibleLayers] = useState(layerVisibilities);

  const toggleLayer = layerName =>
    setVisibleLayers({
      ...visibleLayers,
      [layerName]: !visibleLayers[layerName],
    });

  useEffect(() => {
    const params = {
      bbox: undefined,
      default_date: false,
      default_bbox: true, // user AOI only
    };
    dispatch(fetchEvents({ options: params, feFilters: {} }));
    dispatch(fetchPeople({ options: params, feFilters: {} }));
    dispatch(fetchReports({ options: params }));
    dispatch(fetchComms({ options: params, feFilters: {} }));
    dispatch(fetchMissions({ options: params, feFilters: {} }));
    dispatch(fetchAlerts({ options: params }));
    dispatch(fetchMapRequests({ options: params }));
  }, [dispatch]);

  useEffect(() => {
    const statusCounts = getStatusCountsForItems(alerts);
    setActivityStatusCounts(statusCounts);
  }, [filteredAlerts, alerts]);

  useEffect(() => {
    const statusCounts = getStatusCountsForItems(orgPplList);
    setPeopleStatusCounts(statusCounts);
  }, [orgPplList, filteredPeople]);

  useEffect(() => {
    const statusCounts = getStatusCountsForItems(orgReportList);
    setReportStatusCounts(statusCounts);
  }, [orgReportList]);

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
          toggleLayerCallback={toggleLayer}
          visibleLayers={visibleLayers}
        />
        <AOIBar
          orgPplList={orgPplList}
          orgReportList={orgReportList}
          commsList={allCommunications}
          missionsList={allMissions}
          alertsList={alerts}
          visibleLayers={visibleLayers}
        />
        <PhotoBar />
        <ReportBar />
      </Container>
    </div>
  );
};

export default NewDashboard;
