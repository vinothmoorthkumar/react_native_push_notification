/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme
} from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { HomeScreen } from "./src/components/HomeScreen"
import { ProfileScreen } from "./src/components/Profile"
import { Notification } from "./src/components/Notification"
import { AddTrip } from "./src/components/trip/AddTrip"
import { Plans } from "./src/components/trip/Plan"
import { AddPlan } from "./src/components/trip/AddPlan"
import { CustomNavigationBar } from "./src/components/customNavbar"
import { CheckList } from "./src/components/trip/checkList"




const CustomlightTheme = {
  ...DefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    background: "#ffffff",
    text: "#333333",
  },
};

const CustomdarkTheme = {
  ...DarkTheme,
  ...PaperDefaultTheme,
  colors: {
    ...DarkTheme.colors,
    ...PaperDefaultTheme.colors,
    background: "#333333",
    text: "#ffffff"
  },
};

const App = () => {

  const Stack = createNativeStackNavigator();
  const scheme = useColorScheme();
  const theme = scheme == 'dark' ? CustomdarkTheme : CustomlightTheme
  return (
    <PaperProvider settings={{
      icon: props => <AwesomeIcon {...props} />,
    }} theme={theme}>
      <NavigationContainer theme={theme}>

        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            header: (props) => <CustomNavigationBar {...props} />,
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Trips' }}
          />
          <Stack.Screen name="AddPlan" component={AddPlan} options={{ title: 'Plan' }} />
          <Stack.Screen name="Plans" component={Plans} options={{ title: 'Plans' }} />
          <Stack.Screen name="AddTrip" component={AddTrip} options={{ title: 'Trip' }} />
          <Stack.Screen name="CheckList" component={CheckList} options={{ title: 'Check List' }} />

          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Notification" component={Notification} />

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>


  );
}



export default App;
