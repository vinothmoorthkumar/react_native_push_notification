import React, { useState, useEffect } from 'react'
import { View,ScrollView } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

import { styles } from "../style/style";
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@react-navigation/native';
import IconFA from 'react-native-vector-icons/FontAwesome';
import db from "../db/db_connection"
const LeftContent = props => <Avatar.Icon {...props} icon="folder" />


export const HomeScreen = ({ navigation }) => {

  // const colors = colorSchemes[colorScheme] || colorSchemes.light;
  const { colors } = useTheme();
  const [trips, setTrips] = useState([]);
  useEffect(() => {
    getTrip();
  }, [])
  async function getTrip() {
    const lists = [];
    let results = await db.select("SELECT * FROM TRIP", [])
    const count = results.rows.length;
    for (let i = 0; i < count; i++) {
      const row = results.rows.item(i);
      lists.push(row);
    }
    setTrips(lists)
  }


  const listItems = trips.map((ele ,key) =>
    <View key={key} stye={{marginBottom:20}}>
      <Card>
        <Card.Content>
          <Title>{ele.name}</Title>
          <Paragraph>From {new Date(ele.startDate).toDateString()} to {new Date(ele.endDate).toDateString()}</Paragraph>
        </Card.Content>
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        {/* <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions> */}
      </Card>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <ScrollView style={styles.scrollView}>
        {listItems}
      </ScrollView>

      {/* <View style={{ flex: 10 }}>
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

        <View style={{ position: "absolute", bottom: 0, right: 0 }}>
          <TouchableHighlight onPress={() => { navigation.navigate('AddTrip')}}>
            <View style={{
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 60,
              borderRadius: 100,
              backgroundColor: 'orange'
            }}>
              <IconFA size={40} />
              <IconFA name='plus' size={20} color='white' style={{ position: 'absolute', zIndex: 99 }} />
            </View>
          </TouchableHighlight>
        </View>


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