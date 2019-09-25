import * as BoardActions from 'app/main/apps/scrumboard/store/actions';
import * as NotificationActions from 'app/main/apps/notification/store/actions'

import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {Popover} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import _ from '@lodash';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
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

    '& .unreadBadge' : {
      position       : 'absolute',
      minWidth       : 18,
      height         : 18,
      top            : 4,
      left           : 10,
      borderRadius   : 9,
      padding        : '0 5px',
      fontSize       : 11,
      textAlign      : 'center',
      display        : 'flex',
      alignItems     : 'center',
      justifyContent : 'center',
      backgroundColor: theme.palette.secondary.main,
      color          : theme.palette.secondary.contrastText,
      boxShadow      : '0 2px 2px 0 rgba(0, 0, 0, 0.35)',
      zIndex         : 10
    },
    
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
    },
    
    '& .bellIcon': {
      '&:hover': {
        cursor: 'pointer'
      }
    }
  },
}));

function NotificationMenu(props)
{
  const classes = useStyles();
  const [notificationMenu, setNotificationMenu] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [notificationId, setNotificationId] = useState(null);
  const dispatch = useDispatch();
  const newNotificationsCount = useSelector(({notification}) => notification.newNotificationsCount, shallowEqual);
  const recentNotifications = useSelector(({notification}) => notification.recentNotifications, shallowEqual);
  const board = useSelector(({scrumboardApp}) => scrumboardApp && scrumboardApp.board);

  const handleNotificationMenuClick = event => {
    if(newNotificationsCount > 0) {
      setNotificationMenu(event.currentTarget);
    }
  };

  const handleOpenNotificationDialog = notificationId => () => {
    setOpenNotificationDialog(true);
    setNotificationId(notificationId);
  }

  const handleOpenNotificationDialogClose = () => {
    setOpenNotificationDialog(false);
  }

  const handleOpenNotification = notificationId => () => {
    handleOpenNotificationDialogClose();
    notificationMenuClose();
    const getNotification = NotificationActions.getNotification(notificationId);
    getNotification.then(response => {
      const card = _.find(board.cards, {id: response.data.notification.id_obj});
      dispatch(BoardActions.openCardDialog(card));
    })
  }

  const handleDeleteNotification = notificationId => () => {
    handleConfirmDeleteClose();
    handleOpenNotificationDialogClose();
    dispatch(NotificationActions.deleteNotification(notificationId));
  }

  const notificationMenuClose = () => {
    setNotificationMenu(null);
  };

  const handleConfirmDelete = notificationId => e => {
    e.stopPropagation();
    setConfirmDelete(true);
    setNotificationId(notificationId);
  }

  const handleConfirmDeleteClose = () => {
    setConfirmDelete(false);
  }

  const getRecentNotifications = () => {
    dispatch(NotificationActions.getRecentNotifications());
  }

  useEffect(() => {
    dispatch(NotificationActions.getNewNotificationsCount());
    dispatch(NotificationActions.getRecentNotifications());
    const timer = setInterval(() => {
      dispatch(NotificationActions.getNewNotificationsCount());
    }, 100000);
    return () => clearInterval(timer);
  }, [dispatch]);
  
  return (
    <React.Fragment>
      <IconButton 
        className={clsx('w-64 h-64', classes.notificationIcon)} 
        color='inherit' 
        onClick={handleNotificationMenuClick}
      >
        <Badge badgeContent={newNotificationsCount} color='error'>
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
            <NotificationsIcon onClick={getRecentNotifications} className='bellIcon' />
          </ListItem>
          <ListItem 
            alignItems='flex-start' 
            className='spaceBetween' 
            divider={true}
          >
            <label>Notifications</label>
            <label>Mark all as read</label>
          </ListItem>
          
          {recentNotifications && recentNotifications.map((notification, key) => (
            <ListItem 
              key={key} 
              className='notificationItem' 
              alignItems='flex-start' 
              divider={true}
              onClick={handleOpenNotificationDialog(notification._id)}
            >
              <ListItemAvatar>
                <div>
                  {!notification.read && (
                    <div className='unreadBadge'></div>
                  )}
                  <Avatar alt='Remy Sharp' src={notification.source.avatar} />
                </div>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      component='span'
                      variant='body2'
                      className={clsx('greenColor', classes.inline)}
                    >
                      {notification.source.name + ' ' + notification.source.lastname + ' '}
                    </Typography>
                    {notification.description}
                  </React.Fragment>
                }
              />
              <div>
                <div>
                  {notification.time}
                </div>
                <DeleteIcon className='deleteIcon' onClick={handleConfirmDelete(notification._id)} />
              </div>
            </ListItem>
          ))}

          {recentNotifications && newNotificationsCount > recentNotifications.length &&
            <ListItem alignItems='flex-start' className='contentCenter greenColor'>
              <label className='spacingTop'>SEE ALL NOTIFICATIONS</label>
            </ListItem>
          }
        </List>
      </Popover>
      <Dialog
        open={confirmDelete}
        onClose={handleConfirmDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Confirmation</DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
            Are you going to delete this notification?
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleDeleteNotification(notificationId)}>
          Yes
        </Button>
        <Button onClick={handleConfirmDeleteClose} autoFocus>
          No
        </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openNotificationDialog}
        onClose={handleOpenNotificationDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Open notification?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            To open notification please click GO button
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpenNotification(notificationId)} autoFocus>
            Go
          </Button>
          <Button onClick={handleOpenNotificationDialogClose}>
            Close
          </Button>
          <Button onClick={handleConfirmDelete(notificationId)}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default withReducer('notification', reducer)(NotificationMenu);
