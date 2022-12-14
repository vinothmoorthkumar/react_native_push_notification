import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        GetFOMToken();
    }
}


export default async function GetFOMToken() {
    let fcmtoken = await AsyncStorage.getItem("fcmtoken");
    // AsyncStorage.clear()


    // console.log(fcmtoken, "old token");
    if (!fcmtoken) {
        try {
            const fcmtoken = await messaging().getToken();
            if (fcmtoken) {
                console.log(fcmtoken, "new token");
                await AsyncStorage.setItem("fcmtoken", fcmtoken);
                axios.post('http://192.168.33.94:3000/', {
                    token: fcmtoken,})
                  .then(function (response) {
                    console.log(response);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
            }
        } catch (error) {
            console.log(errror, "error in fcmtoken");
        }
    }
}

export function NotificationListener(){
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });


    // Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        });


    messaging().onMessage(async remoteMessage => {
        console.log("notification on frog round state ......", remoteMessage);
    })

}
