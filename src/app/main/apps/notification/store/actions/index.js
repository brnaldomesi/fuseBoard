import axios from 'axios';

export const GET_NEW_NOTIFICATIONS_COUNT = '[NOTIFICATION] GET NEW NOTIFICATIONS COUNT';
export const GET_RECENT_NOTIFICATIONS = '[NOTIFICATION] GET RECENT NOTIFICATIONS';
export const DELETE_NOTIFICATION = '[NOTIFICATION] DELETE NOTIFICATION';
export const NOTIFICATION_REMOVED = '[NOTIFICATION] NOTIFICATION REMOVED';
export const OPEN_NOTIFICATION = '[NOTIFICATION] OPEN NOTIFICATION';

export function getNewNotificationsCount()
{
  const request = axios.get('/api/notification/count');

  return (dispatch) =>
    request.then((response) =>
      dispatch({
        type: GET_NEW_NOTIFICATIONS_COUNT,
        payload: response.data
      })
    );
}

export function deleteNotification(id)
{
  const request = axios.post('/api/notification/del', {
    id_notification: id
  });

  return (dispatch) =>
    request.then((response) =>
      dispatch({
        type: DELETE_NOTIFICATION,
        payload: id
      })
    );
}

export function getRecentNotifications()
{
  const request = axios.post('/api/notification/list');
  return (dispatch) =>
    request.then((response) =>
      dispatch({
        type: GET_RECENT_NOTIFICATIONS,
        payload: response.data.notifications
      })
    );
}

export function getNotification(id)
{
  return axios.get('/api/notification/get/' + id);
}