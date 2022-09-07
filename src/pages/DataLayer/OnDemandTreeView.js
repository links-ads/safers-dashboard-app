import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { ListGroup, ListGroupItem, Collapse } from 'reactstrap';
import { fetchEndpoint } from '../../helpers/apiHelper';
import JsonFormatter from '../../components/JsonFormatter'

const PropsPanel = (node) => {
  const node2=node.node;
  if (!node2.parameters) return null;
  node2.parameters['geometry'] = node2?.geometry_wkt;
  return (
    <div className="props_box">
      <JsonFormatter  data={node2?.parameters} />
    </div>
  );
};

const OnDemandTreeView = ({ data, setCurrentLayer}) => {
  const [itemState, setItemState] = useState({});
  const [itemPropsState, setItemPropsState] = useState({});
  const [selectedLayer, setSelectedLayer] = useState({});
  const [tooltipInfo, setTooltipInfo] = useState(undefined);

  useEffect(() => {
    setCurrentLayer(selectedLayer);
  }, [selectedLayer]);

  const toggleExpandCollapse = id => {
    setItemState(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  }

  const toggleExpandCollapseProps = id => {
    setItemPropsState(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  }


  const mapper = (nodes, parentId, lvl) => {
    return nodes?.map((node, index) => {

      // set children according to level. Prioritise leaf over branch or root
      if (!node.children) {
        node.children= node?.layers || node?.requests || undefined;
      }
      
      //const mockleafnode = MOCK_LEAF_NODE(node);

      // use tree level to define main text
      const nodeTextByLevel = [
        `${node.key} : ${node.category}`,
        `${node.key} : ${node.title || node.id}`,
        //`${node.key} : ${node.datatype} [${node.status}]`
        `${node.key} : ${node.datatype_id}: DATA_LAYER_NAME [STATUS}]`
      ]
      node.text = nodeTextByLevel[lvl];
      node.info = 'I\'m a tooltip';

      const id = node.id ?? node.key;
      const tooltipDisplay = tooltipInfo || node.category || node.id;
      const item =
        <>
          <ListGroupItem
            key={index + id}
            className={`dl-item ${node.children && itemState[id] || selectedLayer.id == node.id ? 'selected' : ''} mb-2`}
            onClick={() => {
              return node.children ? toggleExpandCollapse(id) : setSelectedLayer(node)
            }}
            onMouseEnter={async () => {
              setTooltipInfo(undefined);
              setTooltipInfo(await fetchEndpoint(node.info_url));
            }}
            onMouseLeave={() => setTooltipInfo(undefined)}
          >
            <>
              {(node.info || node.info_url) &&
                <i data-tip data-for={`${parentId}-${index}-tooltip`} className='bx font-size-16 me-1' />
              }
              {
                node.children ?
                  <>
                    <i className={`bx bx-caret-${itemState[id] ? 'down' : 'right'} font-size-16`} />
                    {node.text}
                  </>
                  :
                  node.text
              }
              { node?.parameters ? 
                <>
                  &nbsp;<i onClick={(event)=>{event.stopPropagation(); toggleExpandCollapseProps(id)} } className={'bx bx-cog font-size-16'} />
                </> : null
              }
              { node?.parameters &&  itemPropsState[id] ?  <div className="mt-2"><PropsPanel node={node} /></div>: null}
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
              class="alert-tooltip data-layers-alert-tooltip text-light"
            >
              {tooltipDisplay ?? 'Loading...'}
            </ReactTooltip>}
        </>
      return item;
    });
  }
  return (
    <ListGroup>
      {mapper(data, undefined, 0)}
    </ListGroup>
  )
}

OnDemandTreeView.propTypes = {
  data: PropTypes.any,
  setCurrentLayer: PropTypes.func,
  node: PropTypes.any,
}


export default OnDemandTreeView;
