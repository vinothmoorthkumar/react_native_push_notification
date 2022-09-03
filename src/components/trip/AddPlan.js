import React, { useEffect, useRef } from 'react'
import {
    View,
    Pressable,
    Text
} from 'react-native';
import { styles } from "../../style/style";
import DateTimePicker from '@react-native-community/datetimepicker';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { Button, TextInput,  Dialog, Provider, Portal } from 'react-native-paper';
import db from "../../db/db_connection"

export const AddPlan = ({ navigation, route }) => {
    const [visibleStarDate, setVisibleStarDate] = React.useState(false);
    const [visibleStartTime, setVisibleStarTime] = React.useState(false);
    const [visibleEndTime, setVisibleEndTime] = React.useState(false);
    const [visibleEndDate, setVisibleEndDate] = React.useState(false);

    const [mode, setMode] = React.useState('date');

    const [event, setevent] = React.useState("");
    const [venue, setvenue] = React.useState("");
    const [startDate, setStartdate] = React.useState(new Date());
    const [endDate, setEnddate] = React.useState(new Date());
    const [editable, seteditable] = React.useState(false);
    const [tripId, settripId] = React.useState(route.params.tripId);
    const [startTime, setStartTime] = React.useState(new Date());
    const [endTime, setEndTime] = React.useState(new Date());
    const [visible, setVisible] = React.useState(false);
    const [errorText, setErrorText] = React.useState("");

    const childRef=useRef(null);

    const hideDialog = () => setVisible(false);


    useEffect(() => {
        async function getdata() {
            let results = await db.select("SELECT * FROM PLAN WHERE ID=" + route.params.id, [])
            let data = results.rows.item(0);
            setevent(data.event);
            setvenue(data.venue);
            setStartdate(new Date(data.startDate));
            setEnddate(new Date(data.endDate));
            setStartTime(new Date(data.startDate));
            setEndTime(new Date(data.endDate));
        }
        if (route.params?.id) {
            seteditable(true)
            getdata();
        }



    }, [route.params?.post])


    const formatDate=(date,time)=>{
        let dateObj=`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${time.getHours()}:${time.getMinutes()}`
        var x = new Date(dateObj).toISOString()
        return x;
    }



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

     function deleteTrip() {
        setVisible(true)
    }
    function confirmDelete(){
        db.delete("DELETE FROM PLAN WHERE ID=" + route.params.id);
        navigation.navigate('Plans', { id: tripId })
    }

    async function saveTrip() {
        if(!event.trim()){
            setErrorText("Please Enter Event")
            childRef.current.alert();
            return 
        }

     
        let dataArr = [event, venue, formatDate(startDate,startTime),formatDate(endDate,endTime), tripId];
        if (editable) {
            dataArr.push(route.params.id)
            await db.update('UPDATE PLAN SET event = ?, venue = ?, startDate = ?, endDate = ?, TripID = ? WHERE id = ?', dataArr);
        } else {
            let result = await db.insert("INSERT INTO PLAN (event, venue, startDate, endDate, TripID) VALUES (?,?,?,?,?)", dataArr);
        }
        navigation.navigate('Plans', { id: tripId })
    }


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setStartdate(currentDate);
        setVisibleStarDate(false);
    };


    const onChangeStartTime = (event, selectedTime) => {
        const currentTime = selectedTime || date;
        setStartTime(currentTime);
        setVisibleStarTime(false);
    };

    const onChangeEndTime = (event, selectedTime) => {
        const currentTime = selectedTime || date;
        setEndTime(currentTime);
        setVisibleEndTime(false);
    };

    return <View style={[styles.container]}>
        <TextInput label="Event" value={event} onChangeText={event => setevent(event)} />
        <TextInput label="Venue" value={venue} onChangeText={venue => setvenue(venue)} />

        {/* Start date and Time */}
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

        <Pressable onPress={() => setVisibleStarTime(true)}>
            <View pointerEvents="none">
                <TextInput label="Start Time" value={startTime.toLocaleTimeString()} />
            </View>
        </Pressable>

        {
            visibleStartTime && (<DateTimePicker
                value={startTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeStartTime}
            />)
        }

        {/* End -----Start date and Time */}


        <Pressable onPress={() => showEndDatePicker()}>
            <View pointerEvents="none">
                <TextInput label="End Date" value={endDate.toDateString()} />
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

        <Pressable onPress={() => setVisibleEndTime(true)}>
            <View pointerEvents="none">
                <TextInput label="End Time" value={endTime.toLocaleTimeString()} />
            </View>
        </Pressable>

        {
            visibleEndTime && (<DateTimePicker
                value={endTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChangeEndTime}
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


        <Provider>
            <View>
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Are you sure want to delete?</Dialog.Title>
                        {/* <Dialog.Content>
                            <Paragraph>This is simple dialog</Paragraph>
                        </Dialog.Content> */}
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Cancel</Button>
                            <Button onPress={confirmDelete}>Confirm</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </Provider>

        <Toast ref={childRef} text={errorText}></Toast>

    </View>;
};
