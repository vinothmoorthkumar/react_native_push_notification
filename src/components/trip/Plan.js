import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { styles } from "../../style/style";
import IconFA from 'react-native-vector-icons/FontAwesome';

import { Avatar, Button, Card, Title, Paragraph, TextInput, Text } from 'react-native-paper';
import db from "../../db/db_connection"

export const Plans = ({ navigation, route }) => {
    const [plans, setPlans] = useState([]);
    const isFocused = useIsFocused()


    useEffect(() => {
        async function getdata() {
            const lists = [];
            let results = await db.select("SELECT * FROM PLAN WHERE TripID="+route.params.id, [])
            const count = results.rows.length;
            for (let i = 0; i < count; i++) {
                const row = results.rows.item(i);
                lists.push(row);
            }
            console.log("lists", lists)
            setPlans(lists)
        }
        getdata();
    }, [isFocused])


    const listItems = plans.map((ele, key) =>
        <View key={key} style={{ marginBottom: 10 }}>
            <TouchableOpacity onPress={() =>
                navigation.navigate('AddPlan', { tripId:route.params.id, id: ele.ID })
            } style={{ padding: 2 }}>
                <Card>
                    <Card.Content>
                        <Title>{ele.event} - {ele.venue}</Title>
                        <Paragraph>{new Date(ele.startDate).toDateString()}, {new Date(ele.endDate).toDateString()}</Paragraph>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        </View>
    );

    return <View style={[styles.container]}>
        <ScrollView >
            {listItems}
        </ScrollView>
        <View style={{ position: "absolute", bottom: 20, right: 20 }}>

            <TouchableOpacity onPress={() => { navigation.navigate('AddPlan', { tripId: route.params.id }) }}>
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
    </View>;
};
