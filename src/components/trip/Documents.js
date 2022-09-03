import React, { useState, useEffect } from 'react'
import {View, TouchableOpacity} from 'react-native';
import { styles } from "../../style/style";

import { Avatar, Button, Card, Title, Paragraph, TextInput, Text } from 'react-native-paper';
import db from "../../db/db_connection"

export const Documents = ({ navigation, route }) => {
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
       
    </View>;
};
