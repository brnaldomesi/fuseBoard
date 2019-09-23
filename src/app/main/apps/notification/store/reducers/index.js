import * as Actions from '../actions';

const initialState = [];

const notificationReducer = function (state = initialState, action) {
  switch ( action.type )
  {
    case Actions.GET_NEW_NOTIFICATIONS_COUNT:
    {
      return {
        ...state,
        newNotificationsCount: action.payload.count      
      };
    }
    case Actions.GET_RECENT_NOTIFICATIONS:
      return {
        ...state,
        recentNotifications: action.payload
      }
    default:
      return state;
  }
};

export default notificationReducer;
