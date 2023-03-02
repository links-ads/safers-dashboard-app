import React, { useEffect, useState, useCallback } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import { MAP_TYPES } from 'constants/common';
import useInterval from 'customHooks/useInterval';
import { fetchEndpoint } from 'helpers/apiHelper';
import { getIconLayer } from 'helpers/mapHelper';
import { dateRangeSelector } from 'store/common.slice';
import {
  fetchPeople,
  allPeopleSelector,
  filteredPeopleSelector,
} from 'store/people.slice';
import { defaultAoiSelector } from 'store/user.slice';

import PeopleList from './Components/PeopleList';
import SortSection from './Components/SortSection';
import MapSection from '../Components/DefaultMapSection';

const People = ({ pollingFrequency }) => {
  const { deckRef, updateViewState } = useMap();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const defaultAoi = useSelector(defaultAoiSelector);
  const allPeople = useSelector(allPeopleSelector);
  const filteredPeople = useSelector(filteredPeopleSelector);
  const dateRange = useSelector(dateRangeSelector);

  const [selectedPerson, setSelectedPerson] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [sortOrder, setSortOrder] = useState('desc');
  const [status, setStatus] = useState('');
  const [activity, setActivity] = useState('');
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [activities, setActivities] = useState([]);
  const [peopleParams, setPeopleParams] = useState({});

  let peopleList = filteredPeople ?? allPeople;

  useEffect(() => {
    (async () => {
      const responseData = await fetchEndpoint('/chatbot/people/activities');
      setActivities(responseData);
    })();
  }, []);

  useEffect(() => {
    setPeopleParams(previous => {
      const options = {
        ...previous,
        bbox: boundingBox?.toString(),
        default_date: false,
        default_bbox: !boundingBox,
        ...(dateRange
          ? {
              start: dateRange[0],
              end: dateRange[1],
            }
          : {}),
      };

      const feFilters = {
        activity,
        status,
        sortOrder,
      };

      dispatch(fetchPeople({ options, feFilters }));

      return options;
    });
  }, [activity, boundingBox, dateRange, dispatch, sortOrder, status]);

  useEffect(() => {
    setIconLayer(
      getIconLayer(peopleList, MAP_TYPES.PEOPLE, 'people', {
        id: selectedPerson?.id,
      }),
    );
  }, [peopleList, selectedPerson?.id]);

  useInterval(
    () =>
      dispatch(
        fetchPeople({
          options: peopleParams,
          feFilters: {
            activity,
            status,
            sortOrder,
          },
          isPolling: true,
        }),
      ),
    pollingFrequency,
    [peopleParams],
  );

  const getPeopleByArea = () =>
    setBoundingBox(deckRef.current.deck.viewManager._viewports[0].getBounds());

  const handleResetAOI = useCallback(
    () =>
      updateViewState({
        longitude: defaultAoi.features[0].properties.midPoint[0],
        latitude: defaultAoi.features[0].properties.midPoint[1],
        zoom: defaultAoi.features[0].properties.zoomLevel,
      }),
    [defaultAoi.features, updateViewState],
  );

  const onClick = info => {
    const id = info?.object?.properties.id;

    if (id) {
      const person = peopleList.find(p => p.id === id);

      if (person) {
        setSelectedPerson(person);
      }
    }
  };

  return (
    <div className="mx-2">
      <Row className="justify-content-end mb-2">
        <Col xl={7}>
          <Button color="link" onClick={handleResetAOI} className="p-0">
            {t('default-aoi', { ns: 'common' })}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xl={5}>
          <SortSection
            status={status}
            activity={activity}
            sortOrder={sortOrder}
            setStatus={setStatus}
            setActivity={setActivity}
            setSortOrder={setSortOrder}
            activities={activities}
          />
          <Row>
            <Col xl={12} className="px-3">
              <PeopleList
                selectedPerson={selectedPerson}
                setSelectedPerson={setSelectedPerson}
              />
            </Col>
          </Row>
        </Col>
        <Col xl={7} className="mx-auto">
          <MapSection
            iconLayer={iconLayer}
            getInfoByArea={getPeopleByArea}
            onClick={onClick}
          />
        </Col>
      </Row>
    </div>
  );
};

People.propTypes = {
  pollingFrequency: PropTypes.number,
};

export default People;
