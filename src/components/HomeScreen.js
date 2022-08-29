import React, { useState } from 'react'
import { Button, TextInput, Text, View, useColorScheme, TouchableOpacity } from 'react-native';
import { styles } from "../style/style";
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@react-navigation/native';


// const colorSchemes = {
//   light: {
//     background: 'yellow',
//     text: 'red',
//   },
//   dark: {
//     background: '#333',
//     text: '#fff',
//   },
// };


export const HomeScreen = ({ navigation }) => {

  const colorScheme = useColorScheme();
  // const colors = colorSchemes[colorScheme] || colorSchemes.light;
  const { colors } = useTheme();

  const [currency, setCurrency] = useState('US Dollar');

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>

      <View style={{ flex: 10 }}>
        <TextInput style={{ color: colors.text }}
          placeholderTextColor={colors.text}
          placeholder="Email" />
        <TextInput
          secureTextEntry={true}
          placeholderTextColor={colors.text}
          placeholder="Password"
        />
        <Picker
          selectedValue={currency}
          style={{ color: colors.text }}
          onValueChange={currentCurrency => setCurrency(currentCurrency)}>
          <Picker.Item label="USD" value="US Dollars" />
          <Picker.Item label="EUR" value="Euro" />
          <Picker.Item label="NGN" value="Naira" />
        </Picker>
        <Text style={{ color: colors.text }}>
          Selected: {currency}
        </Text>

      </View>
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={{ backgroundColor: colors.card }}>
          <Text style={{ color: colors.text }}>Button!</Text>
        </TouchableOpacity>

        <Button
          title="Go to Notification"
          onPress={() =>
            navigation.navigate('Notification')
          } />
      </View>



      {/* <Text style={homeStyles.style1}>Text1</Text>
      <Text style={homeStyles.style2}>Text2</Text>
      <View style={homeStyles.style3}>
        <Button
          title="Go to Jane's profile"
          onPress={() =>
            navigation.navigate('Notification')
          } />
      </View> */}
    </View>
  );
};


const homeStyles = StyleSheet.create({
  style1: {
    flex: 1,
    backgroundColor: "red"
  },
  style2: {
    flex: 2,
    backgroundColor: "yellow"

  },
  style3: {
    flex: 3,
    backgroundColor: "orange"
  }
});