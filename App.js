/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';


import { useColorScheme } from 'react-native';
import { HomeScreen } from "./src/components/HomeScreen"
import { ProfileScreen } from "./src/components/Profile"
import { Notification } from "./src/components/Notification"
import { AddTrip } from "./src/components/trip/AddTrip"


const darkTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1A1A1A",
    accent: "#FAFAFA"
  },
};

const lightTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FAFAFA",
    accent: "#1A1A1A",
  },
};

const App = () => {

  const Stack = createNativeStackNavigator();
  const scheme = useColorScheme();

  return (
    <PaperProvider theme={scheme === 'dark' ? darkTheme : lightTheme} settings={{
      icon: props => <AwesomeIcon {...props} />,
    }}>
      <NavigationContainer theme={scheme === 'dark' ? darkTheme : lightTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Welcome' }}
          />

          <Stack.Screen name="AddTrip" component={AddTrip} options={{ title: 'Trip' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Notification" component={Notification} />

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>

  );
}



export default App;
