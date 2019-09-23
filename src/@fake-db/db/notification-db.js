import _ from '@lodash';
import mock from './../mock';

const notificationDB = {
  notifications: [
    {
        'read' : 'false',
        '_id'     : '1',
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
        'read' : 'false',
        '_id'     : '2',
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
        'read' : 'false',
        '_id'     : '3',
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
        'read' : 'false',
        '_id'     : '4',
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
    }/* ,
    {
        'read' : 'false',
        '_id'     : '5',
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
    },
    {
        'read' : 'false',
        '_id'     : '6',
        'source'   : {
            'name'  : 'Alice5',
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
        'read' : 'false',
        '_id'     : '7',
        'source'   : {
            'name'  : 'Alice6',
            'lastname' : 'Freeman',
            'avatar': 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=128',
            '_id': '1'
        },
        'title': 'Notification 1',
        'description': 'First notification',
        'date' : '2019/9/22',
        'time'   : '09:02'
    } */
  ]
};

/* mock.onPost('/api/notification/list').reply((request) => {
  return [200, notificationDB.notifications]
}); */
