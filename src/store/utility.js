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
  const from = moment(new Date()).add(-3, 'days').format('DD-MM-YYYY');
  const to = moment(new Date()).format('DD-MM-YYYY');
  return [from, to];
}

export const formatDefaultDate = (date) => {
  return moment(date).format('L');
}

export const formatDate = (date) => {
  return moment(date).format('ll') 
}