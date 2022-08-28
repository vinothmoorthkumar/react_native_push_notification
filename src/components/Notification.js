import { requestUserPermission, NotificationListener } from "../../src/utlis/pushnotification"
import PushNotification from "react-native-push-notification";
import React,{useEffect} from "react";
import {
    Button,
    Text,
    View,
    StyleSheet
  } from 'react-native';



export const Notification = () => {

  
    PushNotification.createChannel(
      {
        channelId: "test1", // (required)
        channelName: "firstChannelName", // (required)
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  
    useEffect(() => {
      requestUserPermission();
      NotificationListener();
  
    }, [])
  
    function triggerNotification() {
      PushNotification.localNotification({
        channelId: "test1",
        message: "My Notification Message"
      });
    }
  
  
    return (
        <View style={styles.container}>
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "black" }}>Title test</Text>
            <Button onPress={() => { triggerNotification() }}
              title="Add List"
              color="#841584"
              accessibilityLabel="Learn more about this purple button" />
          </View>
        </View> 
    );
  
}

  const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      flex: 1,
      backgroundColor: "#fff",
    }
  });