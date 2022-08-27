/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useEffect} from 'react';
import type {Node} from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {requestUserPermission,NotificationListener} from "./src/utlis/pushnotification"
import {
  Colors,
  DebugInstructions,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import PushNotification from "react-native-push-notification";

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function onActionSelected (position) {
    if (position === 0) { // index of 'Settings'
      showSettings();
    }
  }


  PushNotification.createChannel(
    {
      channelId: "test1", // (required)
      channelName: "firstChannelName", // (required)
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

  useEffect(()=>{
    requestUserPermission();
    NotificationListener();



  },[])

  function triggerNotification(){
    PushNotification.localNotification({
      channelId: "test1", 
      message: "My Notification Message"  
    });
  }


  return (
    <View style={styles.container}>
      <View style={{paddingHorizontal:20}}>
        <Text style={{fontSize:24,fontWeight:"bold",color:"black"}}>Title test</Text>
        <Button onPress={()=>{triggerNotification()}}
            title="Add List"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"/>
      </View>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container:{
    marginTop:20,
    flex:1,
    // justifyContent:"center",
    backgroundColor:"#fff",
  }
});

export default App;
