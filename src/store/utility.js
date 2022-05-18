import moment from 'moment';

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};
export const formatNumber = (number) => {
  if(number>1000) 
    return Math.floor(parseInt(number/1000)) + 'K'
  return number
}

export const getDefaultDateRange = () => {
  const from = moment(new Date()).add(-3, 'days').format('YYYY-MM-DD');
  const to = moment(new Date()).format('YYYY-MM-DD');
  return [from, to];
}

export const formatDefaultDate = (date, format='L') => {
  return moment(date).format(format);
}

export const formatDate = (date, format='ll') => {
  console.log(date)
  return moment(date).format(format)
}
