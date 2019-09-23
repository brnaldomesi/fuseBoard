import * as Actions from 'app/main/apps/notification/store/actions'

import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {Popover} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import { blockStatement } from '@babel/types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import reducer from 'app/main/apps/notification/store/reducers';
import withReducer from 'app/store/withReducer';

const useStyles = makeStyles(theme => ({
  inline: {
    display: 'inline',
  },

  notificationIcon: {
    margin: 'auto'
  },

  notificationList: {
    width: '360px',
    maxHeight: '480px',
    
    '& .flexEnd': {
      justifyContent: 'flex-end'
    },

    '& .spacingTop': {
      marginTop: theme.spacing(1)
    },

    '& .spacingRight': {
      marginRight: theme.spacing(1)
    },
  
    '& .spaceBetween': {
      justifyContent: 'space-between'
    },

    '& .contentCenter': {
      justifyContent: 'center'
    },

    '& .greenColor': {
      color: 'aquamarine'
    },

    '& .alignTop': {
      top: '30%'
    },

    '& .notificationItem': {
      '& .deleteIcon': {
        display: 'none'
      },

      '&:hover': {
        '& .deleteIcon': {
          display: 'block',
          '&:hover': {
            cursor: 'pointer'
          }
        }
      }
    }
  },
}));

function NotificationMenu(props)
{
  const classes = useStyles();
  const [notificationMenu, setNotificationMenu] = useState(null);
  const dispatch = useDispatch();
  const newNotificationsCount = useSelector(({notification}) => notification.newNotificationsCount, shallowEqual);
  const recentNotifications = useSelector(({notification}) => notification.recentNotifications, shallowEqual);

  const notificationMenuClick = event => {
    //if(newNotificationsCount > 0) {
      setNotificationMenu(event.currentTarget);
    //}
  };

  const notificationMenuClose = () => {
    setNotificationMenu(null);
  };

  useEffect(() => {
    dispatch(Actions.getNewNotificationsCount());
    dispatch(Actions.getRecentNotifications());
    const timer = setInterval(() => {
      dispatch(Actions.getNewNotificationsCount());
      dispatch(Actions.getRecentNotifications());
    }, 3000);
    return () => clearInterval(timer);
  }, [dispatch]);
  
  return (
    <React.Fragment>
      <IconButton className={clsx('w-64 h-64', classes.notificationIcon)} color='inherit' onClick={notificationMenuClick}>
        <Badge badgeContent={6} color='error'>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={!!notificationMenu}
        anchorEl={notificationMenu}
        onClose={notificationMenuClose}
        anchorOrigin={{
          vertical  : 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical  : 'top',
          horizontal: 'center'
        }}
        classes={{
          paper: 'py-8'
        }}
      >
        <List className={classes.notificationList}>
          <ListItem alignItems='flex-start' className='flexEnd'>
            <SearchIcon className='spacingRight'/>
            <NotificationsIcon/>
          </ListItem>
          <ListItem alignItems='flex-start' className='spaceBetween' divider={true}>
            <label>Notifications</label>
            <label>Mark all as read</label>
          </ListItem>
          
          { recentNotifications && recentNotifications.map((notification, key) => (
            <ListItem key={key} className='notificationItem' alignItems='flex-start' divider={true}>
              <ListItemAvatar>
                <Avatar alt='Remy Sharp' src={notification.source.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      component='span'
                      variant='body2'
                      className={clsx('greenColor', classes.inline)}
                    >
                      { notification.source.name + ' ' + notification.source.lastname + ' ' }
                    </Typography>
                    { notification.description }
                  </React.Fragment>
                }
              />
              <div>
                <div>
                  { notification.time }
                </div>
                <DeleteIcon className='deleteIcon' />
              </div>
            </ListItem>
          ))}

          { newNotificationsCount > -1 &&
            <ListItem alignItems='flex-start' className='contentCenter greenColor'>
              <label className='spacingTop'>SEE ALL NOTIFICATIONS</label>
            </ListItem>
          }
        </List>
      </Popover>
    </React.Fragment>
  );
}

export default withReducer('notification', reducer)(NotificationMenu);
