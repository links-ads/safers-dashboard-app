import * as actionTypes from './types';
import { getDefaultDateRange, updateObject } from '../utility';

const initialState = {
  allNotifications: [],
  paginatedNotifications: [],
  filteredNotifications: [],
  sortByDate: 'desc',
  notificationSource: 'all',
  dateRange : getDefaultDateRange(),
  currentPage: 1,
  error: false,
  success: null
};

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.GET_NOTIFICATIONS_SUCCESS: return getNotificationSuccess(state, action);
  case actionTypes.GET_NOTIFICATIONS_FAIL: return getNotificationsFail(state, action);
  
  case actionTypes.SET_FILTERED_NOTIFICATIONS: return setFilteredNotifications(state, action);
  case actionTypes.SET_PAGINATED_NOTIFICATIONS: return setPaginatedNotifications(state, action);
  case actionTypes.SET_CURRENT_NOTIFICATIONS_PAGE: return setNotificationCurrentPage(state, action);
  
  case actionTypes.SET_NOTIFICATION_SORT_BY_DATE: return setNotificationSortByDate(state, action);
  case actionTypes.SET_NOTIFICATION_SOURCE: return setNotificationSource(state, action);
  case actionTypes.SET_NOTIFICATION_DATE_RANGE: return setNotificationDateRange(state, action);

  default:
    return state;
  }
};

const getNotificationSuccess = (state, action) => {
  const updatedState = {
    allNotifications: action.payload,
    error: false,
  }
  return updateObject(state, updatedState);
}
const getNotificationsFail = (state) => {
  const updatedState = {
    error: true,
  }
  return updateObject(state, updatedState);
}

const setFilteredNotifications = (state, action) => {
  const updatedState = {
    filteredNotifications: action.payload,
  }
  return updateObject(state, updatedState);
}
const setPaginatedNotifications = (state, action) => {
  const updatedState = {
    paginatedNotifications: action.payload,
  }
  return updateObject(state, updatedState);
}
const setNotificationCurrentPage = (state, action) => {
  const updatedState = {
    currentPage: action.payload,
  }
  return updateObject(state, updatedState);
}

const setNotificationSortByDate = (state, action) => {
  const updatedState = {
    sortByDate: action.payload,
  }
  return updateObject(state, updatedState);
}
const setNotificationSource = (state, action) => {
  const updatedState = {
    notificationSource: action.payload,
  }
  return updateObject(state, updatedState);
}
const setNotificationDateRange = (state, action) => {
  const updatedState = {
    dateRange: action.payload,
  }
  return updateObject(state, updatedState);
}


export default notificationsReducer;
