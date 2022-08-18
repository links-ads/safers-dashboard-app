import React, { useEffect }  from 'react';
import { Container, Row  } from 'reactstrap';
import MediaContainer from './Containers/MediaContainer';
import SummaryContainer from './Containers/SummaryContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getReportDetail } from '../../../../store/reports/action';
import { useParams } from 'react-router-dom';

const ReportsDashboard = () => {
  const dispatch = useDispatch();
  const { reportDetail } = useSelector(state => state.reports);
  const { id } = useParams();
  useEffect(() => {
    dispatch(getReportDetail(id))
  }, [])

  return (
    <div className="page-content">
      <Container fluid >

        <Row>
          <SummaryContainer reportDetail={reportDetail} />
        </Row>
      
        
        <MediaContainer reportDetail={reportDetail}/>
        

      </Container>
    </div>
  );
}

export default ReportsDashboard;
