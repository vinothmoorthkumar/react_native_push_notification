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

export const AddTrip = ({ navigation, route }) => {
    const { colors } = useTheme();

    const [visibleStarDate, setVisibleStarDate] = React.useState(false);
    const [visibleEndDate, setVisibleEndDate] = React.useState(false);

    const [mode, setMode] = React.useState('date');

    const [destination, setDestination] = React.useState("");
    const [name, setName] = React.useState("");
    const [startDate, setStartdate] = React.useState(new Date());
    const [endDate, setEnddate] = React.useState(new Date());


    useEffect(() => {
        createTable();
    }, [])
    const createTable = async () => {
        await db.createtable(
            "CREATE TABLE IF NOT EXISTS "
            + "TRIP"
            + "(ID INTEGER PRIMARY KEY AUTOINCREMENT, destination TEXT,name TEXT,startDate TEXT,endDate TEXT);"
        )
    }

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

    async function saveTrip() {
        let dataArr=[destination,name,startDate.toString(),endDate.toString()];
        await db.insert("INSERT INTO TRIP (destination, name, startDate, endDate) VALUES (?,?,?,?)",dataArr)
       let result= await db.select("SELECT * FROM TRIP",[])
        console.log("result test",result.rows.item(0))
    }

    return <View style={[styles.container, { backgroundColor: colors.primary }]}>
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
        <View style={{
            alignSelf: 'flex-end',
        }}>
            <View style={{ width: 100 }}>
                <Button mode="contained" onPress={() => saveTrip()}>
                    <IconFA name='save' size={20} color='white' />
                </Button>
            </View>
        </View>
    </View>;
};
