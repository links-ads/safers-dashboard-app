/* Chatbot - front-end filtering/sorting */
/* Note: Only Date and Geometry related data filtered on backend */

import _ from 'lodash';

export const getFilteredRec = (allRecords, filters, sort) => {
  let actFiltered = [...allRecords];
  const filterNames = Object.keys(filters);
  filterNames.forEach(key => {
    if (filters[key] !== '') {
      actFiltered = actFiltered.filter(o => {
        // matches against arrays of values
        if (Array.isArray(o[key])) {
          const lowercased = o[key].map(str => str.toLowerCase());
          if (lowercased.includes(filters[key])) {
            return true;
          }
        }

        // matches against existence of property (truthy value)
        if (typeof filters[key] === 'boolean') {
          if (!!o[key] === filters[key]) {
            return true;
          }
        }

        return o[key] === filters[key];
      });
    }
  });

  actFiltered = _.orderBy(
    actFiltered,
    [o => new Date(o[sort.fieldName])],
    [sort.order],
  );
  return actFiltered;
};
