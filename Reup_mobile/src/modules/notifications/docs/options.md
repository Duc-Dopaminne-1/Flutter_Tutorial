### Optional for Local Notification

- Optional 1: Basic pop-up notifications from firebase (Note: Only support drop down pop up for android version > 8.0)

```bash
this.notificationListener = firebase
            .notifications()
            .onNotification(notifications => {
                if (Platform.OS === 'ios') {
                    const notification = new firebase.notifications.Notification()
                        .setNotificationId(notifications.notificationId)
                        .setTitle(notifications.title)
                        .setBody(notifications.body)
                    firebase.notifications().displayNotification(notification);
                }
                if (Platform.OS === 'android') {
                    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.High)
                        .setDescription('My apps test channel');
                    // Create the channel
                    firebase.notifications().android.createChannel(channel);
                    const notification = new firebase.notifications.Notification()
                        .setTitle(notifications.title)
                        .setBody(notifications.body)
                    notification.android.setChannelId(channel.channelId).setSound('default')
                    firebase.notifications().displayNotification(notification);
                }
            });
```

- Optional 2 : You can custom your pop-up local notification on your app (on Notification Class)

```bash
         this.notificationListener = firebase
         .notifications()
             .onNotification(notification => {
                const { title, body } = notification;
                 this.showAlert(title, body);
               let mess = {
                   id: '3',
                    code: "CODE",
                    type: "information",
                    message: body,
                     title
                 }
                this.store.dispatch(NotificationActions.addNotification(mess));
             });
```
