import React  from 'react';
import { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Card } from 'reactstrap';
import { MOCK_REPORTS } from '../mocks/reportsmock.ts';
import { getAllReports } from '../../../store/reports/action';
import Report from '../../Chatbot/Reports/Components/Report'


const ReportBar = () => {
  let [reportList, setReportList] = useState([]);

  const allReports = useSelector(state => {
    if ((!(state?.reports?.allReports)) ||  state.reports.allReports.length === 0) {
      return MOCK_REPORTS;
    }
    return state.reports.allReports
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllReports({}, true));
  }, []);

  useEffect(() => {
    setReportList(allReports);
  }, [allReports])

  return (
    <div className="">
      <Container fluid className="">
        <Card>
          <p className="align-self-baseline">Reports</p>
          <Row xs={1} sm={1} md={2} lg={2} xl={4} className="mx-4 gx-2" >
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

export default ReportBar;
