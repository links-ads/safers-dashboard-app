import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Row } from 'reactstrap';

import { fetchReportDetail, reportDetailSelector } from 'store/reports.slice';

import MediaContainer from './Containers/MediaContainer';
import SummaryContainer from './Containers/SummaryContainer';

const ReportsDashboard = () => {
  const dispatch = useDispatch();
  const reportDetail = useSelector(reportDetailSelector);
  const { id } = useParams();
  useEffect(() => {
    dispatch(fetchReportDetail(id));
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
