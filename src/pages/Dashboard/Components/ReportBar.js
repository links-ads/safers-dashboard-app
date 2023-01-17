import React  from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Card } from 'reactstrap';
import Report from '../../Chatbot/Reports/Components/Report'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ReportBar = ({t}) => {
  const allReports = useSelector(state => {
    if ((!(state?.reports?.allReports)) ||  state.reports.allReports.length === 0) {
      return [];
    }
    return state.reports.allReports
  });

  return (
    <div>
      <Container fluid="true">
        <Card>
          <Row className="align-self-baseline alert-title mx-3">
            <div>
              <Link to="/chatbot?tab=4">
                <p>{t('Reports', {ns: 'common'})} <i className="fas fa-file-image float-right"></i></ p>
              </Link>
            </div>
          </Row>
          <Row xs={1} sm={1} md={2} lg={2} xl={3} className="mx-4 gx-2" >
            { allReports && allReports.length === 0 
              ? <div><p className="ml-3">{t('No new reports in AOI')}</p></div>
              : null
            }
            {
              allReports ? 
                allReports.map(report=> 
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
