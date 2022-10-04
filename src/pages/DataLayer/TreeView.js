import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import { ListGroup, ListGroupItem, Collapse } from 'reactstrap';
import { fetchEndpoint } from '../../helpers/apiHelper';
import { useDispatch, useSelector } from 'react-redux';

import { getMetaData, resetMetaData } from '../../store/appAction';

const TreeView = ({ data, setCurrentLayer, resetMap }) => {
  const [itemState, setItemState] = useState({});
  const [selectedLayer, setSelectedLayer] = useState({});// Only parent node is set here - used by callback fn
  
  const [selectedNode, setSelNode] = useState(null);
  const [tooltipInfo, setTooltipInfo] = useState(undefined);
  const [metaActive, setMetaActive] = useState('');

  const { metaData } = useSelector(state => state.dataLayer);
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentLayer(selectedLayer);
  }, [selectedLayer]);

  useEffect(() => {
    if(!metaData){
      setMetaActive('');
    }
  }, [metaData]);

  const toggleExpandCollapse = id => {
    setItemState(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  }

  const onClickDLItem = (id, node) => {
    if(node.children){
      toggleExpandCollapse(id); 
      setMetaActive('');
      dispatch(resetMetaData());
    } else {
      if (selectedLayer?.id === id) {
        resetMap();
        setSelectedLayer({});
      } else {
        setSelectedLayer(node);
      }
    }
    setSelNode(node);
  }

  const toggleMetaInfo = (metaURL) => {
    if(!metaData){
      setMetaActive('alert-card-active');
      dispatch(getMetaData(metaURL))
    }
    else {
      dispatch(resetMetaData());
    }
  }

  const isParentOfSelected = (id) => {
    /*
    * Node id should follow a syntax inheriting the parent id 
    * i.e. parent node - {parent id}, child - {parent id}.{child id}
    * This fn is also appllied to leaf node
    */
    if(!selectedNode) {
      return false;
    }

    if(selectedNode.id.substring(0,id.length) === id && id.startsWith(selectedNode.id.split('.')[0])) {
      return true;
    }
    return false;
  }

  const mapper = (nodes, parentId, lvl) => {
    return nodes?.map((node, index) => {
      
      const id = node.id;
      const tooltipDisplay = tooltipInfo || node.info
      const item =
        <>
          <ListGroupItem
            key={index + id}
            className={`dl-item ${isParentOfSelected(id) ? `${metaActive} selected` : ''} mb-2`}
            onClick={() => { onClickDLItem(id, node) }}
            onMouseEnter={async () => {
              setTooltipInfo(undefined);
              setTooltipInfo(await fetchEndpoint(node.info_url));
            }}
            onMouseLeave={() => setTooltipInfo(undefined)}
          >
            <>
              {
                node.children ?
                  <>
                    {(node.info || node.info_url) &&
                      <i data-tip data-for={`${parentId}-${index}-tooltip`} className='bx bx-info-circle font-size-16 me-1' />
                    }
                    <i className={`bx bx-caret-${itemState[id] ? 'down' : 'right'} font-size-16`} />
                    {node.text}
                  </>
                  :
                  <>
                    {(node.metadata_url) &&
                      <i className={`bx bx-file font-size-18 me-2 meta-icon ${selectedNode && node.id === selectedNode.id && metaData ? 'text-primary': ''}`} onClick={()=>{toggleMetaInfo(node.metadata_url)}} />
                    }
                    {moment(node.text).format('LLL')}
                  </>
              }
            </>
          </ListGroupItem>
          {
            node.children && id &&
            <Collapse
              key={index + id + '-' + lvl}
              isOpen={itemState[id] || false}
              className='dl-tree-collapse ms-5'
            >
              {mapper(node.children, id, (lvl || 0) + 1)}
            </Collapse>
          }
          {(node.info || node.info_url) &&
            <ReactTooltip id={`${parentId}-${index}-tooltip`}
              aria-haspopup="true"
              role={tooltipInfo || node.info}
              place='right'
              class="alert-tooltip data-layers-alert-tooltip"
            >
              {tooltipDisplay ?? 'Loading...'}
            </ReactTooltip>}
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
  setCurrentLayer: PropTypes.func,
  resetMap: PropTypes.func,
}


export default TreeView;
