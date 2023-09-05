import React, { useEffect, useState, Fragment } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import { ListGroup, ListGroupItem, Collapse } from 'reactstrap';

import { fetchEndpoint } from 'helpers/apiHelper';
import {
  fetchMetadata,
  resetMetaData,
  metaDataSelector,
} from 'store/datalayer.slice';

const TreeView = ({ data, setCurrentLayer, resetMap }) => {
  const [itemState, setItemState] = useState({});
  const [selectedLayer, setSelectedLayer] = useState({}); // Only parent node is set here - used by callback fn

  const [selectedNode, setSelNode] = useState(null);
  const [tooltipInfo, setTooltipInfo] = useState(undefined);
  const [metaActive, setMetaActive] = useState('');

  const metaData = useSelector(metaDataSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentLayer(selectedLayer);
  }, [selectedLayer, setCurrentLayer]);

  useEffect(() => {
    if (!metaData) {
      setMetaActive('');
    }
  }, [metaData]);

  const toggleExpandCollapse = id => {
    setItemState(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const onClickDLItem = (id, node) => {
    if (node.children) {
      toggleExpandCollapse(id);
      setMetaActive('');
      dispatch(resetMetaData());
    } else {
      if (selectedLayer?.id === id) {
        resetMap();
        setSelectedLayer({});
        setSelNode(null);
      } else {
        setSelectedLayer(node);
        setSelNode(node);
      }
    }
  };

  const toggleMetaInfo = metaURL => {
    if (!metaData) {
      setMetaActive('alert-card-active');
      dispatch(fetchMetadata(metaURL));
    } else {
      dispatch(resetMetaData());
    }
  };

  const isParentOfSelected = id => {
    /*
     * Node id should follow a syntax inheriting the parent id
     * i.e. parent node - {parent id}, child - {parent id}.{child id}
     * This fn is also appllied to leaf node
     */
    if (!selectedNode) {
      return false;
    }

    if (
      selectedNode.id.substring(0, id.length) === id &&
      id.startsWith(selectedNode.id.split('.')[0])
    ) {
      return true;
    }
    return false;
  };

  const mapper = (nodes, parentId, lvl) => {
    return nodes?.map((node, index) => {
      const id = node.id;
      const tooltipDisplay = tooltipInfo || node.info;
      const item = (
        <Fragment key={id}>
          <ListGroupItem
            key={node}
            className={`dl-item ${
              isParentOfSelected(id) ? `${metaActive} selected` : ''
            } mb-2`}
            onClick={() => {
              onClickDLItem(id, node);
            }}
            onMouseEnter={async () => {
              setTooltipInfo(undefined);
              if (node.info_url && node.children) {
                setTooltipInfo(await fetchEndpoint(node.info_url));
              }
            }}
            onMouseLeave={() => setTooltipInfo(undefined)}
          >
            <>
              {node.children ? (
                <>
                  {(node.info || node.info_url) && (
                    <i
                      data-tooltip-id={`${parentId}-${index}-tooltip`}
                      data-tooltip-content={tooltipDisplay ?? 'Loading...'}
                      className="bx bx-info-circle font-size-16 me-1"
                    />
                  )}
                  <i
                    className={`bx bx-caret-${
                      itemState[id] ? 'down' : 'right'
                    } font-size-16`}
                  />
                  {node.text}
                </>
              ) : (
                <>
                  {node.metadata_url && (
                    <i
                      className={`bx bx-file font-size-18 me-2 meta-icon ${
                        selectedNode && node.id === selectedNode.id && metaData
                          ? 'text-primary'
                          : ''
                      }`}
                      onClick={() => {
                        toggleMetaInfo(node.metadata_url);
                      }}
                    />
                  )}
                  {moment(node.text).format('LLL')}
                </>
              )}
            </>
          </ListGroupItem>
          {node.children && id && (
            <Collapse
              key={node + id + '-' + lvl}
              isOpen={itemState[id] || false}
              className="dl-tree-collapse ms-5"
            >
              {mapper(node.children, id, (lvl || 0) + 1)}
            </Collapse>
          )}
          {(node.info || node.info_url) && (
            <Tooltip
              id={`${parentId}-${index}-tooltip`}
              place="right"
              className="alert-tooltip data-layers-alert-tooltip"
            />
          )}
        </Fragment>
      );
      return item;
    });
  };
  return <ListGroup>{mapper(data)}</ListGroup>;
};

TreeView.propTypes = {
  data: PropTypes.any,
  setCurrentLayer: PropTypes.func,
  resetMap: PropTypes.func,
};

export default TreeView;
