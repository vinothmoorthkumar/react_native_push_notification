/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Appearance } from 'react-native';



import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';



import {HomeScreen} from "./src/components/HomeScreen"
import {ProfileScreen} from "./src/components/Profile"
import {Notification} from "./src/components/Notification"


const App = () => {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
        <Stack.Navigator>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ title: 'Welcome' }}
                />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Notification" component={Notification} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;
