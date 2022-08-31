import React, { useEffect } from 'react'
import {
    View,
    Pressable
} from 'react-native';
import { styles } from "../../style/style";
import DateTimePicker from '@react-native-community/datetimepicker';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { useTheme } from 'react-native-paper';

import { Avatar, Button, Card, Title, Paragraph, TextInput, Text } from 'react-native-paper';
import db from "../../db/db_connection"
import { Route } from 'express';

export const AddTrip = ({ navigation, route }) => {
    const { colors } = useTheme();

    const [visibleStarDate, setVisibleStarDate] = React.useState(false);
    const [visibleEndDate, setVisibleEndDate] = React.useState(false);

    const [mode, setMode] = React.useState('date');

    const [destination, setDestination] = React.useState("");
    const [name, setName] = React.useState("");
    const [startDate, setStartdate] = React.useState(new Date());
    const [endDate, setEnddate] = React.useState(new Date());
    const [editable, seteditable] = React.useState(false);

    useEffect(() => {
        async function getdata() {
            let results = await db.select("SELECT * FROM TRIP WHERE ID=" + route.params.id, [])
            let data = results.rows.item(0);
            setDestination(data.destination);
            setName(data.name);
            setStartdate(new Date(data.startDate));
            setEnddate(new Date(data.endDate));
        }
        if (route.params?.id) {
            seteditable(true)
            getdata();
        }

    }, [route.params?.post])


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setStartdate(currentDate);
        setVisibleStarDate(false);
    };


    function showDatePicker() {
        setVisibleStarDate(true);
    }

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setEnddate(currentDate);
        setVisibleEndDate(false);
    };

    function showEndDatePicker() {
        setVisibleEndDate(true);
    }

    async function deleteTrip() {
        let result = await db.delete("DELETE FROM TRIP WHERE ID=" + route.params.id);
        navigation.navigate('Home')

    }

    async function saveTrip() {
        let dataArr = [destination, name, startDate.toString(), endDate.toString()];

        if (editable) {
            dataArr.push(route.params.id)
            await db.update('UPDATE TRIP SET destination = ? , name = ?, startDate = ?, endDate = ? WHERE id = ?', dataArr);
        } else {
            await db.insert("INSERT INTO TRIP (destination, name, startDate, endDate) VALUES (?,?,?,?)", dataArr)
        }
        navigation.navigate('Home')

    }

    return <View style={[styles.container]}>
        <TextInput label="Destination" value={destination} onChangeText={destination => setDestination(destination)} />
        <TextInput label="Trip Name" value={name} onChangeText={name => setName(name)} />
        <Pressable onPress={() => showDatePicker()}>
            <View pointerEvents="none">
                <TextInput label="Start Date" value={startDate.toDateString()} />
            </View>
        </Pressable>
        {
            visibleStarDate && (<DateTimePicker
                testID="dateTimePicker"
                value={startDate}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
            />)
        }

        <Pressable onPress={() => showEndDatePicker()}>
            <View pointerEvents="none">
                <TextInput label="Start Date" value={endDate.toDateString()} />
            </View>
        </Pressable>
        {
            visibleEndDate && (<DateTimePicker
                testID="dateTimePickerEnd"
                value={endDate}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChangeEndDate}
            />)
        }
        <View style={{ alignSelf: 'flex-end', justifyContent: "space-between", flexDirection: 'row', marginTop: 10 }}>
            <View style={{ width: 100 }}>
                {
                    editable && (
                        <Button mode="contained" onPress={() => deleteTrip()}>
                            <IconFA name='trash' size={20} color='white' />
                        </Button>
                    )

                }

            </View>
            <View style={{ width: 100 }}>
                <Button mode="contained" onPress={() => saveTrip()}>
                    <IconFA name='save' size={20} color='white' />
                </Button>
            </View>
        </View>
    </View>;
};
