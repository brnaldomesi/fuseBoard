import axios from 'axios';

export const GET_NEW_NOTIFICATIONS_COUNT = '[NOTIFICATION] GET NEW NOTIFICATIONS COUNT';
export const GET_RECENT_NOTIFICATIONS = '[NOTIFICATION] GET RECENT NOTIFICATIONS';
export const DELETE_NOTIFICATION = '[NOTIFICATION] DELETE NOTIFICATION';
export const NOTIFICATION_REMOVED = '[NOTIFICATION] NOTIFICATION REMOVED';

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
    _id: id
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
  const recentNotifications = [
    {
        'read' : false,
        '_id'     : 1,
        'source'   : {
            'name'  : 'Alice',
            'lastname' : 'Freeman',
            'avatar': 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=128',
            '_id': '1'
        },
        'title': 'Notification 1',
        'description': 'First notification',
        'date' : '2019/9/22',
        'time'   : '09:02'
    },
    {
        'read' : false,
        '_id'     : 2,
        'source'   : {
            'name'  : 'Alice1',
            'lastname' : 'Freeman',
            'avatar': 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=128',
            '_id': '1'
        },
        'title': 'Notification 1',
        'description': 'First notification',
        'date' : '2019/9/22',
        'time'   : '09:02'
    },
    {
        'read' : false,
        '_id'     : 3,
        'source'   : {
            'name'  : 'Alice2',
            'lastname' : 'Freeman',
            'avatar': 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=128',
            '_id': '1'
        },
        'title': 'Notification 1',
        'description': 'First notification',
        'date' : '2019/9/22',
        'time'   : '09:02'
    },
    {
        'read' : false,
        '_id'     : 4,
        'source'   : {
            'name'  : 'Alice3',
            'lastname' : 'Freeman',
            'avatar': 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=128',
            '_id': '1'
        },
        'title': 'Notification 1',
        'description': 'First notification',
        'date' : '2019/9/22',
        'time'   : '09:02'
    },
    {
        'read' : false,
        '_id'     : 5,
        'source'   : {
            'name'  : 'Alice4',
            'lastname' : 'Freeman',
            'avatar': 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=128',
            '_id': '1'
        },
        'title': 'Notification 1',
        'description': 'First notification',
        'date' : '2019/9/22',
        'time'   : '09:02'
    }
  ];
  return (dispatch) =>
    request.then((response) =>
      dispatch({
        type: GET_RECENT_NOTIFICATIONS,
        //payload: response.data.notifications
        payload: recentNotifications
      })
    );
}