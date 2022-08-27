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

  useEffect(()=>{
    requestUserPermission();
    NotificationListener();
  },[])


  return (
    <View style={styles.container}>
      <View style={{paddingHorizontal:20}}>
        <Text style={{fontSize:24,fontWeight:"bold",color:"black"}}>Title test</Text>
        <Button
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
