import React, { Fragment } from 'react';

import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Container, Row } from 'reactstrap';

import NotificationCard from './NotificationCard';

const AreaCount = ({ t, noDataMessage, label, itemsCounts }) => {
  if (!itemsCounts) {
    return <p>Loading...</p>;
  }
  if (Object.keys(itemsCounts).length === 0) {
    return <p>{noDataMessage}</p>;
  }
  return (
    <>
      {Object.keys(itemsCounts).map(key => (
        <Fragment key={`${label}_row_${key}`}>
          <Row fluid="true" xs={2}>
            {/* string 'null' because object.keys() outputs string array */}
            <div className="w-8">{key === 'null' ? t('Unknown') : key}</div>
            <div className="w-2">{itemsCounts[key]}</div>
          </Row>
          <hr />
        </Fragment>
      ))}
    </>
  );
};

const NotificationsBar = ({
  t,
  activityStatusCounts,
  reportStatusCounts,
  peopleStatusCounts,
  missionStatusCounts,
  communicationStatusCounts,
}) => {
  const defaultAOI = useSelector(state => state?.user?.defaultAoi);
  const nameOfAOI = defaultAOI?.features[0]?.properties?.name;

  return (
    <div className="mx-2 px-1">
      <Container fluid="true">
        <p className="align-self-baseline alert-title">
          {t('Area of Interest')} : {nameOfAOI}
        </p>
        <Row xs={1} sm={2} md={3} lg={5}>
          <NotificationCard
            cardName={t('fire-alerts')}
            iconClass="bx bx-error-circle"
            contentRenderer={() => (
              <AreaCount
                t={t}
                noDataMessage={t('No new activities', { ns: 'dashboard' })}
                label="act"
                itemsCounts={activityStatusCounts}
              />
            )}
            linkURL="/fire-alerts"
          />
          <NotificationCard
            cardName={t('people')}
            iconClass="fas fa-user-alt"
            contentRenderer={() => (
              <AreaCount
                t={t}
                noDataMessage={t('No new people activity', { ns: 'dashboard' })}
                label="ppl"
                itemsCounts={peopleStatusCounts}
              />
            )}
            linkURL="/chatbot?tab=1"
          />
          <NotificationCard
            cardName={t('Reports')}
            iconClass="fas fa-file-image"
            contentRenderer={() => (
              <AreaCount
                t={t}
                noDataMessage={t('No new reports', { ns: 'dashboard' })}
                label="reps"
                itemsCounts={reportStatusCounts}
              />
            )}
            linkURL="/chatbot?tab=4"
          />
          <NotificationCard
            cardName={t('mission')}
            iconClass="fas fa-flag-checkered"
            contentRenderer={() => (
              <AreaCount
                t={t}
                noDataMessage={t('No new missions', { ns: 'dashboard' })}
                label="miss"
                itemsCounts={missionStatusCounts}
              />
            )}
            // contentRenderer={() =>
            //   renderer(
            //     t('No new missions', { ns: 'dashboard' }),
            //     'miss',
            //     missionStatusCounts,
            //   )
            // }
            linkURL="/chatbot?tab=3"
          />
          <NotificationCard
            cardName={t('Communications')}
            iconClass="fas fa-envelope"
            contentRenderer={() => (
              <AreaCount
                t={t}
                noDataMessage={t('No new communications', { ns: 'dashboard' })}
                label="Comms"
                itemsCounts={communicationStatusCounts}
              />
            )}
            // contentRenderer={() =>
            //   renderer(
            //     t('No new communications', { ns: 'dashboard' }),
            //     'Comms',
            //     communicationStatusCounts,
            //   )
            // }
            linkURL="/chatbot?tab=2"
          />
        </Row>
      </Container>
    </div>
  );
};

NotificationsBar.propTypes = {
  t: PropTypes.func,
};

export default withTranslation(['common'])(NotificationsBar);
