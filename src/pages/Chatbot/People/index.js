import React, { useEffect, useState, useCallback } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'reactstrap';
import toastr from 'toastr';

import { useMap } from 'components/BaseMap/MapContext';
import 'toastr/build/toastr.min.css';
import 'rc-pagination/assets/index.css';
import { MAP_TYPES } from 'constants/common';
import useInterval from 'customHooks/useInterval';
import { fetchEndpoint } from 'helpers/apiHelper';
import { getBoundingBox, getViewState, getIconLayer } from 'helpers/mapHelper';
import { dateRangeSelector } from 'store/common.slice';
import {
  fetchPeople,
  resetPeopleResponseState,
  allPeopleSelector,
  filteredPeopleSelector,
  peopleSuccessSelector,
} from 'store/people.slice';
import { defaultAoiSelector } from 'store/user.slice';

import MapSection from './Components/Map';
import PeopleList from './Components/PeopleList';
import SortSection from './Components/SortSection';

const People = ({ pollingFrequency }) => {
  const { viewState, setViewState } = useMap();

  const defaultAoi = useSelector(defaultAoiSelector);
  const allPeople = useSelector(allPeopleSelector);
  const filteredPeople = useSelector(filteredPeopleSelector);
  const success = useSelector(peopleSuccessSelector);
  const dateRange = useSelector(dateRangeSelector);

  let peopleList = filteredPeople ?? allPeople;

  const { t } = useTranslation();

  const [peopleId, setPeopleId] = useState(undefined);
  const [iconLayer, setIconLayer] = useState(undefined);
  const [sortOrder, setSortOrder] = useState('desc');
  const [status, setStatus] = useState('');
  const [activity, setActivity] = useState('');
  const [boundingBox, setBoundingBox] = useState(undefined);
  const [activitiesOptions, setActivitiesOptions] = useState([]);
  const [peopleParams, setPeopleParams] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const activitiesOptions = await fetchEndpoint(
        '/chatbot/people/activities',
      );
      setActivitiesOptions(activitiesOptions);
    })();
  }, []);

  useEffect(() => {
    setPeopleId(undefined);

    setPeopleParams(previous => {
      const params = {
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
      dispatch(fetchPeople({ options: params, feFilters }));
      return params;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, boundingBox, dateRange]);

  useEffect(() => {
    if (success?.detail) {
      toastr.success(success.detail, '');
    }
    dispatch(resetPeopleResponseState());
  }, [dispatch, success]);

  useEffect(() => {
    setIconLayer(
      getIconLayer(peopleList, MAP_TYPES.PEOPLE, 'people', { id: peopleId }),
    );
  }, [peopleList, dispatch, peopleId, setViewState]);

  useInterval(
    () => {
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
      );
    },
    pollingFrequency,
    [peopleParams],
  );

  const getPeopleByArea = () => {
    setBoundingBox(
      getBoundingBox(
        [viewState.longitude, viewState.latitude],
        viewState.zoom,
        viewState.width,
        viewState.height,
      ),
    );
  };

  const handleResetAOI = useCallback(() => {
    setBoundingBox(undefined);
    setViewState(
      getViewState(
        defaultAoi.features[0].properties.midPoint,
        defaultAoi.features[0].properties.zoomLevel,
      ),
    );
  }, [defaultAoi.features, setViewState]);

  const onClick = info => {
    const { id } = info?.object?.properties ?? {};
    setPeopleId(peopleId === id ? undefined : id);
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
            activitiesOptions={activitiesOptions}
          />
          <Row>
            <Col xl={12} className="px-3">
              <PeopleList peopleId={peopleId} setPeopleId={setPeopleId} />
            </Col>
          </Row>
        </Col>
        <Col xl={7} className="mx-auto">
          <MapSection
            iconLayer={iconLayer}
            getPeopleByArea={getPeopleByArea}
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
