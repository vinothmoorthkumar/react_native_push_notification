import React, { useState, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { List, Button, Card, Title, Paragraph, Text } from 'react-native-paper';
import { styles } from "../style/style";
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import IconFA from 'react-native-vector-icons/FontAwesome';
import db from "../db/db_connection"
export const HomeScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const isFocused = useIsFocused()
  const { colors } = useTheme();

  useEffect(() => {
    // db.delete("DROP TABLE TRIP");
    async function getTrip() {
      const lists = [];
      // let results = await db.select("SELECT ID,destination,placeId,name,DATE(startDate) AS started_date,endDate FROM TRIP ORDER BY DATE(startDate) DESC", [])
      let results = await db.select("SELECT * FROM TRIP ORDER BY startDate ASC", [])

      const count = results.rows.length;
      for (let i = 0; i < count; i++) {
        const row = results.rows.item(i);
        lists.push(row);
      }
      setTrips(lists)
    }
    getTrip();

  }, [isFocused])

  function randomIcon(){
    const icons=["plane","bed","globe","ship","umbrella"]
    const random= Math.floor(Math.random()* icons.length);
    return icons[random]
  }

  // const listItems = trips.map((ele, key) =>
  //   <View key={key} style={{ marginBottom: 10 }}>
  //     <TouchableOpacity onPress={() =>
  //       navigation.navigate('Plans', { id: ele.ID })
  //     } style={{ padding: 2 }}>
  //       <Card>
  //         <Card.Content>
  //           <Title>{ele.name}</Title>
  //           <Paragraph>{new Date(ele.startDate).toDateString()}, {new Date(ele.endDate).toDateString()}</Paragraph>
  //         </Card.Content>
  //         <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
  //       </Card>
  //     </TouchableOpacity>
  //   </View>
  // );

  const listItems = trips.map((ele, key) =>
    <View key={key} style={{ marginBottom: 10 }}>
      <TouchableOpacity onPress={() =>
        navigation.navigate('Plans', { id: ele.ID,placeId: ele.placeId,destination: ele.destination })
      } style={{ padding: 2 }}>

        <List.Item style={{backgroundColor:"#fff"}}
          title={ele.name}
          description={new Date(ele.startDate).toDateString()+", "+new Date(ele.endDate).toDateString()}
          left={props => <List.Icon {...props} icon={randomIcon()}/>}
        />
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={[styles.container]}>
      {listItems.length > 0 ? (<ScrollView >
        {listItems}
      </ScrollView>) : <Text style={{color: colors.TextInput}}>Press + button to create plans</Text>}

      <View style={{ position: "absolute", bottom: 20, right: 20 }}>
        <TouchableOpacity onPress={() => { navigation.navigate('AddTrip') }}>
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
        </TouchableOpacity>
      </View>

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