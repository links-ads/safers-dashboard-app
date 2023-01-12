import React  from 'react';
import { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Card } from 'reactstrap';
import { getAllReports } from '../../../store/reports/action';
import Report from '../../Chatbot/Reports/Components/Report'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types';

const ReportBar = ({t}) => {
  const [reportList, setReportList] = useState([]);

  const allReports = useSelector(state => {
    if ((!(state?.reports?.allReports)) ||  state.reports.allReports.length === 0) {
      return [];
    }
    return state.reports.allReports
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllReports({}, true));
  }, []);

  useEffect(() => setReportList(allReports), [allReports])

  return (
    <div>
      <Container fluid="true">
        <Card>
          <Row className="align-self-baseline alert-title mx-4">{t('Reports', {ns: 'common'})}</Row>
          <Row xs={1} sm={1} md={2} lg={2} xl={3} className="mx-4 gx-2" >
            {
              reportList ? 
                reportList.map(report=> 
                  <Card className="my-3" key={`report_${report.report_id}`}>
                    <Report
                      key={report.report_id}
                      card={report}
                      reportId={report.report_id}
                      setSelectedReport={() => {}}
                      setFavorite={() => {}}
                    />
                  </Card>
                ) : null
            }
          </Row>
        </Card>
      </Container>
    </div>
  );
}

ReportBar.propTypes = {
  t: PropTypes.func
}

export default withTranslation(['dashboard'])(ReportBar);
