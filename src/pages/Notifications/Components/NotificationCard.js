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

const NotificatonCard = ({ card }) => {
  const { t } = useTranslation();

  const getBadge = badgeType => {
    return (
      <Badge
        className={`me-1 rounded-pill notification-badge ${badgeType.style}  py-0 px-2 pb-0 mb-0`}
      >
        <span>{card[badgeType.attr]}</span>
      </Badge>
    );
  };

  return (
    <Card className={'notifications-card mb-2 '}>
      <CardBody className="px-0 py-1 my-2">
        <Row>
          <Col className="ms-4">
            <Row>
              <Col>
                <CardText className="mb-2">
                  {card?.type ? getBadge(BADGETYPES.TYPE) : null}
                  {card?.status ? getBadge(BADGETYPES.STATUS) : null}
                  {card?.scopeRestriction
                    ? getBadge(BADGETYPES.SCOPE_RESTRICTION)
                    : null}
                </CardText>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <CardText className="card-desc">{card?.description}</CardText>
                </Row>
                <Row>
                  <CardText className="card-desc text-capitalize">
                    {t('location')}: {card?.country}
                  </CardText>
                </Row>
                <Row className="mt-2">
                  <Col className="">
                    <span className="text-muted card-desc">
                      {formatDate(card.timestamp)}
                    </span>
                  </Col>
                  <Col>
                    <CardText className="bg-danger">
                      <span className="float-end notification-source-text me-2 text-uppercase">
                        {card.source}
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
  card: PropTypes.any,
  alertId: PropTypes.string,
  setSelectedAlert: PropTypes.func,
  setFavorite: PropTypes.func,
};

export default NotificatonCard;
