import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Row } from 'reactstrap';

import MediaContainer from './Containers/MediaContainer';
import SummaryContainer from './Containers/SummaryContainer';
import { getReportDetail } from '../../../../store/reports/action';

const ReportsDashboard = () => {
  const dispatch = useDispatch();
  const { reportDetail } = useSelector(state => state.reports);
  const { id } = useParams();
  useEffect(() => {
    dispatch(getReportDetail(id));
  }, [dispatch, id]);

  return (
    <div className="page-content">
      <Container fluid="true">
        <Row>
          <SummaryContainer reportDetail={reportDetail} />
        </Row>

        <MediaContainer reportDetail={reportDetail} />
      </Container>
    </div>
  );
};

export default ReportsDashboard;
