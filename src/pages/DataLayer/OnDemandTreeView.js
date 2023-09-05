/* eslint-disable indent */
import React, { Fragment, useEffect, useState } from 'react';

import { PolygonLayer } from 'deck.gl';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import { Badge, ListGroup, ListGroupItem, Collapse, Modal } from 'reactstrap';

import { useMap } from 'components/BaseMap/MapContext';
import JsonFormatter from 'components/JsonFormatter';
import { fetchEndpoint } from 'helpers/apiHelper';
import { getBoundedViewState } from 'helpers/mapHelper';
import { deleteMapRequest, fetchMapRequests } from 'store/datalayer.slice';
import { userInfoSelector } from 'store/user.slice';

const PropsPanel = node => {
  const params = {
    ...node.node.parameters,
    geometry: node.node.geometry_wkt,
  };

  return (
    <div className="props_box">
      <JsonFormatter data={params} />
    </div>
  );
};

const OnDemandTreeView = ({
  data,
  setCurrentLayer,
  t,
  setBboxLayers,
  resetMap,
}) => {
  const dispatch = useDispatch();
  const { deckRef, viewState, setViewState } = useMap();

  const [itemState, setItemState] = useState({});
  const [itemPropsState, setItemPropsState] = useState({});
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [tooltipInfo, setTooltipInfo] = useState(undefined);
  const [isDeleteMapRequestDialogOpen, setIsDeleteMapRequestDialogOpen] =
    useState(false);
  const [mapRequestToDelete, setMapRequestToDelete] = useState(null);
  const [selectedNode, setSelectedNode] = useState({});

  const user = useSelector(userInfoSelector);

  useEffect(() => {
    setCurrentLayer(() => {
      // Strip off anything after the final period. e.g. 2.2.1 -> 2.2
      const key = selectedLayer?.key.replace(/([.])(?!.*[.]).*$/, '');
      // Flatten all the child nodes and find the one matching the key.
      const node = _(data).map('children').flatten().find({ key });
      // If a node was found, get it's bbox and pan/zoom the map to that
      // location.
      if (node) {
        const newViewState = getBoundedViewState(deckRef, node?.bbox);
        setViewState({ ...viewState, ...newViewState });
      }

      return selectedLayer;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLayer]);

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
      selectedNode.key?.substring(0, id.length) === id &&
      id.startsWith(selectedNode.key?.split('.')[0])
    ) {
      return true;
    }
    return false;
  };

  const toggleExpandCollapse = id => {
    setItemState(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const toggleExpandCollapseProps = id => {
    setItemPropsState(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const mapper = (nodes, parentId, lvl) => {
    return nodes?.map((nd, index) => {
      const node = { ...nd };
      // use tree level to define main text
      const nodeTextByLevel = [
        node.title,
        `${node.title || node.key}`,
        `${node.datatype_id}: ${node.title}`,
      ];
      node.text = nodeTextByLevel[lvl];

      const id = node.id ?? node.key;
      const tooltipDisplay = tooltipInfo || node.info;
      const isOwner = node?.user && node.user === user?.id;
      const item = (
        <Fragment key={node.key}>
          <ListGroupItem
            // key={node.key}
            className={`dl-item ${
              isParentOfSelected(node.key) ? `alert-card-active selected` : ''
            } mb-2`}
            onClick={() => {
              let isSameNode = false;
              setSelectedNode(node);
              const selectedLayer = setCurrentLayer(oldLayer => {
                if (oldLayer?.key === node?.key) {
                  isSameNode = true;
                }

                if (oldLayer) {
                  resetMap();
                } else {
                  // Strip off anything after the final period. e.g. 2.2.1 -> 2.2
                  const key = selectedLayer?.key.replace(
                    /([.])(?!.*[.]).*$/,
                    '',
                  );

                  // Flatten all the child nodes and find the one matching the key.
                  const childNode = _(data)
                    .map('children')
                    .flatten()
                    .find({ key });

                  // If a node was found, get it's bbox and pan/zoom the map to that
                  // location.
                  if (childNode) {
                    const newViewState = getBoundedViewState(
                      deckRef,
                      childNode?.bbox,
                    );
                    setViewState({ ...viewState, ...newViewState });
                  }
                  return selectedLayer;
                }
              });

              /* if there are child nodes then expand them */
              /* if this is a leaf node, then toggle the layer */
              return node.children
                ? toggleExpandCollapse(id)
                : isSameNode
                ? setSelectedNode(null) // unselect node will force corresponding layer to be unselected
                : setSelectedLayer(node); // node is already selected; select corresponding layer
            }}
            onMouseEnter={async () => {
              setTooltipInfo(undefined);
              if (node.info_url) {
                setTooltipInfo(await fetchEndpoint(node.info_url));
              }
            }}
            onMouseLeave={() => setTooltipInfo(undefined)}
          >
            <>
              {node.info_url && (
                <i
                  data-tooltip-id={`${parentId}-${index}-tooltip`}
                  className="bx font-size-16 me-1"
                />
              )}
              {node.children ? (
                <>
                  {node.info && (
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
                <div className="on-demand-leaf">
                  <div>
                    {node.info_url && (
                      <i
                        data-tooltip-id={`${parentId}-${index}-tooltip`}
                        data-tooltip-content={tooltipDisplay ?? 'Loading...'}
                        className="bx bx-info-circle font-size-16 me-1"
                      />
                    )}
                    {node.text}
                  </div>
                  {node.status && (
                    <Badge
                      data-tooltip-id={`${parentId}-${index}-status`}
                      data-tooltip-content={node.message}
                      className="rounded-pill alert-badge event-alert-badge d-inline-flex justify-content-center align-items-center p-2"
                    >
                      <span className={`${node.status?.toLowerCase()}`}>
                        {node.status}
                      </span>
                    </Badge>
                  )}
                </div>
              )}
              {node?.parameters ? (
                <>
                  &nbsp;
                  <i
                    onClick={event => {
                      event.stopPropagation();
                      toggleExpandCollapseProps(id);
                    }}
                    className={'bx bx-cog font-size-16'}
                  />
                  &nbsp;
                  <i
                    onClick={async event => {
                      event.stopPropagation();

                      // It's possible that there can be multiple AOI polygons,
                      // so I have re-coded this to extract the feature collection
                      // and for each feature, create a polygon to display on the
                      // map
                      const featureCollection = node.geometry_features;

                      const aoisLayer = new PolygonLayer({
                        id: 'request-bbox',
                        data: featureCollection.features,
                        getPolygon: d => d.geometry.coordinates,
                        getLineColor: [60, 140, 0],
                        getFillColor: [80, 80, 80, 70],
                      });

                      setBboxLayers(oldLayers => {
                        const isExistingLayer = oldLayers.find(
                          // eslint-disable-next-line no-self-compare
                          layer => layer.id === layer.id,
                        );

                        if (!isExistingLayer) {
                          const layers = [aoisLayer];
                          return layers;
                        }

                        return [];
                      });

                      const newViewState = getBoundedViewState(
                        deckRef,
                        node.bbox,
                      );

                      setViewState({ ...viewState, ...newViewState });
                    }}
                    className="bx bx-map font-size-16"
                  />
                  &nbsp;
                  {isOwner && (
                    <i
                      onClick={async event => {
                        event.stopPropagation();
                        setMapRequestToDelete(node);
                        setIsDeleteMapRequestDialogOpen(
                          !isDeleteMapRequestDialogOpen,
                        );
                      }}
                      className="bx bx-trash font-size-16"
                    />
                  )}
                </>
              ) : null}
              {node?.parameters && itemPropsState[id] ? (
                <div className="mt-2">
                  {node ? <PropsPanel node={node} /> : null}
                </div>
              ) : null}
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
          {node.message && (
            <Tooltip
              id={`${parentId}-${index}-status`}
              place="right"
              className="alert-tooltip data-layers-alert-tooltip"
            />
          )}
        </Fragment>
      );
      return item;
    });
  };
  return (
    <>
      <ListGroup>{mapper(data, undefined, 0)}</ListGroup>
      <Modal
        isOpen={isDeleteMapRequestDialogOpen}
        toggle={() => {
          setIsDeleteMapRequestDialogOpen(!isDeleteMapRequestDialogOpen);
        }}
        scrollable={true}
        id="staticBackdrop"
      >
        <div className="modal-header">
          <h5 className="modal-title" id="staticBackdropLabel">
            {t('Warning', { ns: 'common' })}!
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setIsDeleteMapRequestDialogOpen(false);
            }}
            aria-label="Close"
          ></button>
        </div>

        <div className="modal-body">
          <p>{t('Confirm Delete Layer', { ns: 'dataLayers' })}</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => {
              setIsDeleteMapRequestDialogOpen(false);
            }}
          >
            {t('Close', { ns: 'common' })}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              dispatch(deleteMapRequest(mapRequestToDelete.id));
              dispatch(fetchMapRequests());
              setIsDeleteMapRequestDialogOpen(false);
            }}
          >
            {t('Yes', { ns: 'common' })}
          </button>
        </div>
      </Modal>
    </>
  );
};

OnDemandTreeView.propTypes = {
  data: PropTypes.any,
  setCurrentLayer: PropTypes.func,
  node: PropTypes.any,
  t: PropTypes.func,
  setViewState: PropTypes.func,
  viewState: PropTypes.any,
  setBboxLayers: PropTypes.func,
  resetMap: PropTypes.func,
};

export default OnDemandTreeView;
