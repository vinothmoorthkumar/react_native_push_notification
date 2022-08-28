import React from 'react'
import {
    Button,
    Text,
    View
  } from 'react-native';

export const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Home</Text>
      <Button
      title="Go to Jane's profile"
      onPress={() =>
        navigation.navigate('Notification')
      }
    />
    </View>
 
  );
};
