import React, { useState, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { List, Button, Card, Title, Paragraph, Text } from 'react-native-paper';
import { styles } from "../style/style";
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import IconFA from 'react-native-vector-icons/FontAwesome';
import db from "../db/db_connection"
export const HomeScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const isFocused = useIsFocused()

  useEffect(() => {
    // db.delete("DROP TABLE TRIP");
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
    getTrip();

  }, [isFocused])



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

        <List.Item
          title={ele.name}
          description={new Date(ele.startDate).toDateString()+", "+new Date(ele.startDate).toDateString()}
          left={props => <List.Icon {...props} icon="plane" />}
        />
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={[styles.container]}>
      {listItems.length > 0 ? (<ScrollView >
        {listItems}
      </ScrollView>) : <Text>Press + button to create plans</Text>}

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