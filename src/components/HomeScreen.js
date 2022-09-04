import React, { useState, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { List, Button, Card, Title, Paragraph, Text } from 'react-native-paper';
import { styles } from "../style/style";
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import IconFA from 'react-native-vector-icons/FontAwesome';
import db from "../db/db_connection"
import {Notification} from "../components/Notification"

export const HomeScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [upcomingtrips, setUpcomingtrips] = useState([]);
  const [pastrips, setpast] = useState([]);

  const isFocused = useIsFocused()
  const { colors } = useTheme();

  useEffect(() => {
    // db.delete("DROP TABLE TRIP");
    async function getTrip() {
      let pastresults = await db.select("SELECT * FROM TRIP WHERE TRIP.endDate < date('now') ORDER BY startDate ASC", [])

      let currentresults = await db.select("SELECT * FROM TRIP WHERE startDate<=strftime('%Y-%m-%dT%H:%M:%fZ', 'now','start of day') and endDate>=strftime('%Y-%m-%dT%H:%M:%fZ', 'now','start of day')", [])

      let upcomingresults = await db.select("SELECT * FROM TRIP WHERE TRIP.startDate > date('now', '+1 day') ORDER BY startDate ASC ", [])

      setpast(structureArr(pastresults))
      setTrips(structureArr(currentresults))
      setUpcomingtrips(structureArr(upcomingresults))

    }
    getTrip();

  }, [isFocused])

  function ListComponent({ ele }) {
    return (
      <View style={{ marginBottom: 10 }}>
        <TouchableOpacity onPress={() =>
          navigation.navigate('Plans', { id: ele.ID, placeId: ele.placeId, destination: ele.destination })
        } style={{ padding: 2 }}>
          <Card>
            <Card.Title title={ele.name} subtitle={new Date(ele.startDate).toDateString() + ", " + new Date(ele.endDate).toDateString()} left={props => <List.Icon {...props} icon={randomIcon()} />} />
            <Card.Content>
              {/* <Title>Card title</Title>
              <Paragraph>Card content</Paragraph> */}
            </Card.Content>
            {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
            {/* <Card.Actions>
              <Button>Cancel</Button>
              <Button>Ok</Button>
            </Card.Actions> */}
          </Card>

          {/* <List.Item style={{ backgroundColor: "#fff" }}
            title={ele.name}
            description={new Date(ele.startDate).toDateString() + ", " + new Date(ele.endDate).toDateString()}
            left={props => <List.Icon {...props} icon={randomIcon()} />}
          /> */}
        </TouchableOpacity>
        
      </View>
    );
  }

  function randomIcon() {
    const icons = ["plane", "bed", "globe", "ship", "umbrella"]
    const random = Math.floor(Math.random() * icons.length);
    return icons[random]
  }


  function structureArr(results) {
    const lists = [];
    const count = results.rows.length;

    for (let i = 0; i < count; i++) {
      const row = results.rows.item(i);
      lists.push(row);
    }
    return lists;
  }

  const PastlistItems = pastrips.map((ele, key) =>
    <ListComponent ele={ele} key={key} />
  );

  const currentlistItems = trips.map((ele, key) =>
    <ListComponent ele={ele} key={key} />
  );

  const upcominglistItems = upcomingtrips.map((ele, key) =>
    <ListComponent ele={ele} key={key} />
  );


  return (
    <View style={[styles.container]}>
      {/* {listItems.length > 0 ? (<ScrollView >
        {listItems}
      </ScrollView>) : <Text style={{color: colors.TextInput}}>Press + button to create plans</Text>} */}

      {
        (PastlistItems.length > 0 || currentlistItems.length > 0 || upcominglistItems.length > 0) ? (
          <ScrollView >

            {currentlistItems.length > 0 && <Title style={{ color: colors.text }}>OnGoing Trip</Title>}
            {currentlistItems}
            {upcominglistItems.length > 0 && (<Title style={{ color: colors.text }}>UpComing Trip</Title>)}
            {upcominglistItems}

            {PastlistItems.length > 0 && (<Title style={{ color: colors.text }}>Past Trip</Title>)}
            {PastlistItems}

          </ScrollView>
        ) : <Text style={{ color: colors.TextInput }}>Press + button to create trip</Text>}



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
      {/* <Notification /> */}
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


