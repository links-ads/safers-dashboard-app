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
    console.log('Now got reports');
    console.log('allReports', allReports);
  }, [allReports])

  return (
    <div className="">
      <Container fluid className="flex-stretch">
        <Card>
          <p className="align-self-baseline">Reports</p>
          <Row className="mx-4 gx-2 row-cols-8 flex-wrap">
            {
              reportList ? 
                reportList.map(report=> 
                  <Card className="col-3 my-3" key={`report_${report.report_id}`}>
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
