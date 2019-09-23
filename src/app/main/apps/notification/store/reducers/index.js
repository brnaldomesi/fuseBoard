import * as Actions from '../actions';

const initialState = [];

const notificationReducer = function (state = initialState, action) {
  switch ( action.type )
  {
    case Actions.GET_NEW_NOTIFICATIONS_COUNT:
    {
      return {
        ...state,
        //newNotificationsCount: action.payload.count      
        newNotificationsCount: 6      
      };
    }
    case Actions.GET_RECENT_NOTIFICATIONS:
      return {
        ...state,
        recentNotifications: action.payload
      }
    case Actions.DELETE_NOTIFICATION:
      const unread = !state.recentNotifications.filter( ({ _id }) => _id === action.payload).read
      console.log('dd', state.newNotificationsCount)
      return {
        ...state,
        recentNotifications: state.recentNotifications.filter( ({ _id }) => _id !== action.payload),
        newNotificationsCount: unread ? state.newNotificationsCount-1 : state.newNotificationsCount
      }
    default:
      return state;
  }
};

export default notificationReducer;
