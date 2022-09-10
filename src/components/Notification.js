import { requestUserPermission, NotificationListener } from "../../src/utlis/pushnotification"
import PushNotification from "react-native-push-notification";
import React, { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

import {
  Button,
  Text,
  View,
  StyleSheet
} from 'react-native';



export const Notification = () => {




  useEffect(() => {

    PushNotification.createChannel(
      {
        channelId: "test1", // (required)
        channelName: "firstChannelName", // (required)
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );

    requestUserPermission();
    NotificationListener();
    console.log("//listner added")
    
    NetInfo.addEventListener(state => {
      throttleFunction(state,3000)

    })

  }, [])
  var  timerId;
  var  throttleFunction  =  function (state, delay) {
    // If setTimeout is already scheduled, no need to do anything
    if (timerId) {
      clearTimeout(timerId);
    }
  
    // Schedule a setTimeout after delay seconds
    timerId  =  setTimeout(function () {
      if (state.isInternetReachable) {
        triggerNotification()
      }
      timerId  =  undefined;
    }, delay)
  }

  function triggerNotification() {
    PushNotification.localNotification({
      channelId: "test1",
      message: "back to online"
    });
  }


  return (
    <View>
      {/* <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "black" }}>Title test</Text>
        <Button onPress={() => { triggerNotification() }}
          title="Add List"
          color="#841584"
          accessibilityLabel="Learn more about this purple button" />
      </View> */}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    // marginTop: 20,
    // flex: 1,
    // backgroundColor: "#fff",
  }
});