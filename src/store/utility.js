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