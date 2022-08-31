import React, { useEffect } from 'react'
import {
    View,
    Pressable
} from 'react-native';
import { styles } from "../../style/style";
import DateTimePicker from '@react-native-community/datetimepicker';
import IconFA from 'react-native-vector-icons/FontAwesome';

import { Button,TextInput,  } from 'react-native-paper';
import db from "../../db/db_connection"

export const AddPlan = ({ navigation, route }) => {
    const [visibleStarDate, setVisibleStarDate] = React.useState(false);
    const [visibleEndDate, setVisibleEndDate] = React.useState(false);

    const [mode, setMode] = React.useState('date');

    const [event, setevent] = React.useState("");
    const [venue, setvenue] = React.useState("");
    const [startDate, setStartdate] = React.useState(new Date());
    const [endDate, setEnddate] = React.useState(new Date());
    const [editable, seteditable] = React.useState(false);
    const [tripId, settripId] = React.useState(route.params.tripId);


    useEffect(() => {
        async function getdata() {
            let results = await db.select("SELECT * FROM PLAN WHERE ID=" + route.params.id, [])
            let data = results.rows.item(0);
            setevent(data.event);
            setvenue(data.venue);
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
        let result = await db.delete("DELETE FROM PLAN WHERE ID=" + route.params.id);
        navigation.navigate('Plans',{id:tripId})

    }

    async function saveTrip() {
        let dataArr = [event, venue, startDate.toString(), endDate.toString(),tripId];
        if (editable) {
            dataArr.push(route.params.id)
            await db.update('UPDATE PLAN SET event = ? , venue = ?, startDate = ?, endDate = ?, TripID = ? WHERE id = ?', dataArr);
        } else {
            let result = await db.insert("INSERT INTO PLAN (event, venue, startDate, endDate, TripID) VALUES (?,?,?,?,?)", dataArr);
        }
        navigation.navigate('Plans',{id:tripId})

    }

    return <View style={[styles.container]}>
        <TextInput label="Event" value={event} onChangeText={event => setevent(event)} />
        <TextInput label="Venue" value={venue} onChangeText={venue => setvenue(venue)} />
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
        <View style={{ alignSelf: 'flex-end', justifyContent:"space-between", flexDirection: 'row', marginTop: 10  }}>
            <View style={{ width: 100}}>
                <Button mode="contained" onPress={() => deleteTrip()}>
                    <IconFA name='trash' size={20} color='white' />
                </Button>
            </View>
            <View style={{ width: 100 }}>
                <Button mode="contained" onPress={() => saveTrip()}>
                    <IconFA name='save' size={20} color='white' />
                </Button>
            </View>
        </View>
    </View>;
};
