import React from 'react'
import {
    Text,
    View,
  } from 'react-native';



export const ProfileScreen = ({ navigation, route }) => {
    return <Text>This is {route.params.name}'s profile</Text>;
  };
