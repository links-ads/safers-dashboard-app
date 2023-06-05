import React from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Badge, Card, CardBody, CardText, Col, Row } from 'reactstrap';

import { formatDate } from 'utility';

const BADGETYPES = {
  STATUS: { attr: 'status', style: 'notification-status-badge' },
  TYPE: { attr: 'type', style: 'notification-type-badge' },
  SCOPE_RESTRICTION: {
    attr: 'scopeRestriction',
    style: 'notification-scope-restriction-badge',
  },
};

const getBadge = (notification, badgeType) => (
  <Badge
    className={`me-1 rounded-pill notification-badge ${badgeType.style} py-0 px-2 pb-0 mb-0`}
  >
    <span>{notification[badgeType.attr]}</span>
  </Badge>
);

const NotificatonCard = ({
  notification,
  selectedNotification,
  setSelectedNotification,
}) => {
  const { t } = useTranslation();

  const isSelected = notification.id === selectedNotification?.id;

  return (
    <Card
      className={`notifications-card mb-2 ${
        isSelected ? 'alert-card-active' : ''
      }`}
      onClick={() => setSelectedNotification(notification)}
    >
      <CardBody className="px-0 py-1 my-2">
        <Row>
          <Col className="ms-4">
            <Row>
              <Col>
                <CardText className="mb-2">
                  {notification?.type
                    ? getBadge(notification, BADGETYPES.TYPE)
                    : null}
                  {notification?.status
                    ? getBadge(notification, BADGETYPES.STATUS)
                    : null}
                  {notification?.scopeRestriction
                    ? getBadge(notification, BADGETYPES.SCOPE_RESTRICTION)
                    : null}
                </CardText>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <CardText className="card-desc">
                    {notification?.description}
                  </CardText>
                </Row>
                <Row>
                  <CardText className="card-desc text-capitalize">
                    {t('location')}: {notification?.country}
                  </CardText>
                </Row>
                <Row className="mt-2">
                  <Col className="">
                    <span className="text-muted card-desc">
                      {formatDate(notification.timestamp)}
                    </span>
                  </Col>
                  <Col>
                    <CardText className="bg-danger">
                      <span className="float-end notification-source-text me-2 text-uppercase">
                        {notification.source}
                      </span>
                    </CardText>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

NotificatonCard.propTypes = {
  notification: PropTypes.any,
  setSelectedNotification: PropTypes.func,
  selectedNotification: PropTypes.object,
};

export default NotificatonCard;
