import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import geo from "../../utlis/geoService"

import { styles } from "../../style/style";
import IconFA from 'react-native-vector-icons/FontAwesome';

import { Card, Title, Paragraph, Modal, Portal, Text, Button, List } from 'react-native-paper';

import db from "../../db/db_connection"

export const Plans = ({ navigation, route }) => {
    const [plans, setPlans] = useState([]);
    const isFocused = useIsFocused()
    const [visible, setVisible] = React.useState(false);
    const [locations, setLocations] = React.useState([]);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    useEffect(() => {
        async function getdata() {
            const lists = [];
            let results = await db.select("SELECT * FROM PLAN WHERE TripID=" + route.params.id, [])
            const count = results.rows.length;
            for (let i = 0; i < count; i++) {
                const row = results.rows.item(i);
                lists.push(row);
            }
            setPlans(lists)
        }





        getdata();


    }, [isFocused])

    async function getNearyby() {
        geo.nearBy(route.params.placeId).then(function (response) {
            setVisible(true);
            setLocations(response)
            console.log("response", response[0].photos)

        })
            .catch(function (error) {
                console.log(error);
            });
    }

    const listLocation = locations.map((ele, key) =>
        <View key={key} style={{ marginBottom: 10 }}>
            <TouchableOpacity onPress={() =>
                navigation.navigate('Plans', {})
            } style={{ padding: 2 }}>

                <List.Item
                    title={ele.name}
                    description=""
                    left={props => <Image source={{ uri: 'https://i.picsum.photos/id/738/700/700.jpg?hmac=xlH5ucgV4pzJ84HvPGcJBPkFYq3HTnBZ2PeDAWaRxhk' }} style={{ width: 50, height: 50 }} />
                    }
                />
            </TouchableOpacity>
        </View>
    );

    const listItems = plans.map((ele, key) =>
        <View key={key} style={{ marginBottom: 10 }}>
            <TouchableOpacity onPress={() =>
                navigation.navigate('AddPlan', { tripId: route.params.id, id: ele.ID })
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
        {listItems.length > 0 ? (<ScrollView >
            {listItems}
        </ScrollView>) : <Text>Press + button to create trip</Text>}

        <View style={{ position: "absolute", bottom: 100, right: 25 }}>
            <TouchableOpacity onPress={() => { getNearyby() }}>
                <View style={{
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: 'gray'
                }}>
                    <IconFA size={40} />
                    <IconFA name='street-view' size={20} color='white' style={{ position: 'absolute', zIndex: 99 }} />
                </View>
            </TouchableOpacity>
        </View>


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


        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <ScrollView >
                    {listLocation}
                </ScrollView>
            </Modal>
        </Portal>

    </View>;
};
