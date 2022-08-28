import React, {useState} from 'react'
import { Button, TextInput, Text, View } from 'react-native';
import { styles } from "../style/style";
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export const HomeScreen = ({ navigation }) => {
  const [currency, setCurrency] = useState('US Dollar');

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          placeholder="Email" />
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
        />
        <Picker
          selectedValue={currency}
          onValueChange={currentCurrency => setCurrency(currentCurrency)}>
          <Picker.Item label="USD" value="US Dollars" />
          <Picker.Item label="EUR" value="Euro" />
          <Picker.Item label="NGN" value="Naira" />
        </Picker>
        <Text>
          Selected: {currency}
        </Text>
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