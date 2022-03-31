import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { ListGroup, ListGroupItem, Collapse } from 'reactstrap';

const TreeView = ({ data }) => {
  const [itemState, setItemState] = useState({});

  const toggle = id => {
    //const id = e.target.id;
    setItemState(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  }

  const mapper = (nodes, parentId, lvl) => {
    return nodes.map((node) => {
      const id = node.id;
      const item =
        <>
          <ListGroupItem
            key={id}
            style={{ width: '350px' }}
            className='dl-item mb-2'
            onClick={() => toggle(id)}
          >
            <>
              <i className='bx bx-info-circle font-size-16 me-1' />
              {
                node.children &&
                <i className={`bx bx-caret-${itemState[id] ? 'down' : 'right'} font-size-16`} />
              }
              {node.text}
            </>
          </ListGroupItem>
          {
            node.children && id &&
            <Collapse
              isOpen={itemState[id] || false}
              style={{ marginLeft: `${50 * (lvl || 1)}px` }}
              className='dl-tree-collapse'
            >
              {mapper(node.children, id, (lvl || 0) + 1)}
            </Collapse>
          }
        </>
      return item;
    });
  }
  return (
    <ListGroup>
      {mapper(data)}
    </ListGroup>
  )
}

TreeView.propTypes = {
  data: PropTypes.any,
}


export default TreeView;
