import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native';
import { styles } from "../../style/style";
import IconFA from 'react-native-vector-icons/FontAwesome';

import { Avatar, Button, Card, Title, Paragraph, TextInput, Text } from 'react-native-paper';
import db from "../../db/db_connection"

export const Plans = ({ navigation, route }) => {


    useEffect(() => {
        async function getdata() {
            let results = await db.select("SELECT * FROM TRIP WHERE ID=" + route.params.id, [])
            let data = results.rows.item(0);
        }
        if (route.params?.id) {
            getdata();
        }

    }, [route.params?.post])

    return <View style={[styles.container]}>
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
    </View>;
};
