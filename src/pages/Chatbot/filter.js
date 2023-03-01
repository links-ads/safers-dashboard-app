const ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const getFilteredRecords = (records, filters, sort) => {
  let filtered = [...records];
  const filterNames = Object.keys(filters);

  filterNames.forEach(key => {
    if (filters[key] !== '') {
      filtered = filtered.filter(record => {
        // matches against arrays of values
        if (Array.isArray(record[key])) {
          return record[key].includes(filters[key]);
        }

        // matches against existence of property (truthy value)
        if (typeof filters[key] === 'boolean') {
          return !!record[key] === filters[key];
        }

        return record[key] === filters[key];
      });
    }
  });

  // Sort by property representing the timestamp.
  filtered.sort((val1, val2) => {
    if (sort.order === ORDER.ASC) {
      return new Date(val1[sort.fieldName]) - new Date(val2[sort.fieldName]);
    } else if (sort.order === ORDER.DESC) {
      return new Date(val2[sort.fieldName]) - new Date(val1[sort.fieldName]);
    }

    return null;
  });

  return filtered;
};
