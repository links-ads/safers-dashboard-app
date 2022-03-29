import React,{ useState } from 'react';
import { Row, Col, Pagination } from 'reactstrap';

const PaginatedAlerts = () => {
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedAlerts, setPaginatedAlerts] = useState([]);

  return(
    <Row>
      <Col xl={12} className='px-3'>
        <Row>
          {
            paginatedAlerts.map((alert, index) => getCard(alert, index))
          }
        </Row>
        <Row className='text-center'>
          <Pagination
            pageSize={PAGE_SIZE}
            onChange={updatePage}
            current={currentPage}
            total={filteredAlerts.length}
          />
        </Row>
      </Col>
    </Row>
  );
}