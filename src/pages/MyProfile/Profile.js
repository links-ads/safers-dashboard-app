import React from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Row, Col, Card, CardBody, CardTitle, Media } from 'reactstrap';

import avatar from 'assets/images/users/profile.png';
import { defaultAoiSelector } from 'store/user.slice';

export const Profile = ({ user, usersRole, usersOrganization }) => {
  const { t } = useTranslation();

  const defaultAoi = useSelector(defaultAoiSelector);

  return (
    <Card color="dark default-panel">
      <CardBody>
        <CardTitle className="mb-2 dflt-seperator pb-3">
          <Media>
            <div className="ms-3">
              <img
                src={avatar}
                alt=""
                className="avatar-md rounded-circle img-thumbnail"
              />
            </div>
            <Media body className="ms-4 align-self-center">
              <h1 className="h5">
                {user?.profile.user.firstName} {user?.profile.user.lastName}
              </h1>
              <h2 className="h6">{usersRole?.title}</h2>
            </Media>
          </Media>
        </CardTitle>
        <div className="p-4">
          <Row className="prof-list">
            <Col md="6" className="p-2 dflt-seperator">
              <i className="bx bx-mail-send me-2"></i>
              <span>{t('Email', { ns: 'myprofile' })}</span>
            </Col>
            <Col md="6" className="p-2 dflt-seperator">
              {user.email}
            </Col>
            <Col md="6" className="p-2 dflt-seperator">
              <i className="bx bx-shopping-bag me-2"></i>
              <span>{t('Organization', { ns: 'common' })}</span>
            </Col>
            <Col md="6" className="p-2 dflt-seperator">
              {usersOrganization?.title}
            </Col>
            <Col md="6" className="p-2 dflt-seperator">
              <i className="bx bx-flag me-2"></i>
              <span>{t('Area of Interest', { ns: 'common' })}</span>
            </Col>
            <Col md="6" className="p-2 dflt-seperator">
              {defaultAoi?.features[0].properties.name}
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};
