import React, { useEffect, useRef } from 'react'
import {
    View,
    Pressable,
    ScrollView,
    TouchableOpacity,

} from 'react-native';
import { styles } from "../../style/style";
import DateTimePicker from '@react-native-community/datetimepicker';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { Button, useTheme, TextInput, Dialog, Provider, Portal, Searchbar, Text, Divider,TouchableRipple } from 'react-native-paper';
import db from "../../db/db_connection"
import PushNotification, { Importance } from "react-native-push-notification";
import moment from "moment-timezone";
// import DropDown from "react-native-paper-dropdown";
import tzList from "../../utlis/timezoneList"
export const AddPlan = ({ navigation, route }) => {
    const [visibleStarDate, setVisibleStarDate] = React.useState(false);
    const [visibleStartTime, setVisibleStarTime] = React.useState(false);
    const [visibleEndTime, setVisibleEndTime] = React.useState(false);
    const [visibleEndDate, setVisibleEndDate] = React.useState(false);
    const [timezone, settimezone] = React.useState("");
    const [timezoneDisplay, settimezoneDisplay] = React.useState("");
    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = query => setSearchQuery(query);
    const [visibleTimezone, setVisibleTimezone] = React.useState(false);
    const showTimeZoneDialog = () => setVisibleTimezone(true);

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
    const [reminder, setReminder] = React.useState(false);

    const childRef = useRef(null);

    const hideDialog = () => setVisible(false);
    const { colors } = useTheme();


    useEffect(() => {
        async function getdata() {
            let results = await db.select("SELECT * FROM PLAN WHERE ID=" + route.params.id, [])
            let data = results.rows.item(0);
            setevent(data.event);
            setvenue(data.venue);
            settimezone(data.TIMEZONE);
            let gettz= tzList.find(ele=>{return ele.abbr==data.TIMEZONE})
            settimezoneDisplay(gettz.text)
            setReminder(data.ALERT)
            setStartdate(new Date(data.startDate));
            setEnddate(new Date(data.endDate));
            setStartTime(data.startDate);
            setEndTime(data.endDate);
        }
        if (route.params?.id) {
            seteditable(true)
            getdata();
        }



    }, [route.params?.post])


    const formatDate = (date, time) => {
        let dateObj = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${time.getHours()}:${time.getMinutes()}`
        // var x = new Date(dateObj).toISOString()
        // moment.utc('2015-01-22T16:11:36.36-07:00').format('l LT')

        return moment.utc(dateObj).format('l LT');
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
    function confirmDelete() {
        db.delete("DELETE FROM PLAN WHERE ID=" + route.params.id);
        navigation.navigate('Plans', { destination: route.params.destination, id: tripId })
    }

    async function saveTrip() {
        if (!event.trim()) {
            setErrorText("Please Enter Event")
            childRef.current.alert();
            return
        }

        let dataArr = [event, venue, formatDate(startDate, startTime),timezone, formatDate(endDate, endTime), reminder, tripId];
        if (editable) {
            dataArr.push(route.params.id)
            await db.update('UPDATE PLAN SET event = ?, venue = ?, startDate = ?,TIMEZONE = ?, endDate = ?, alert = ?, TripID = ? WHERE id = ?', dataArr);
        } else {
            let result = await db.insert("INSERT INTO PLAN (event, venue, startDate,TIMEZONE, endDate,alert, TripID) VALUES (?,?,?,?,?,?,?)", dataArr);
        }

        if (reminder) {
            reminderNotification()
        }
        navigation.navigate('Plans', { destination: route.params.destination, id: tripId })
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

    const setTimezoneDialog=(ele)=>{
        settimezone(ele.abbr);
        settimezoneDisplay(ele.text);

        setVisibleTimezone(false)
    }

    const reminderNotification = () => {
        let notificationObj = {
            channelId: "reminder",
            title: "Reminder",
            allowWhileIdle: true,
            usesChronometer: true,
            priority: 'high',
            importance: Importance.HIGH,
            message: `${event} at ${moment(startTime).format('h:mm a')}`, // (required)
            // date: new Date(Date.now() + 60 * 1000), // in 30 secs
            date: new Date(moment(formatDate(startDate, startTime)).subtract(5, "minutes")), // in 30 secs
        };
        PushNotification.localNotificationSchedule(notificationObj);
    }
    const onToggleSwitch = () => setReminder(!reminder);

    const timeConverter = (time) => {
        return moment(time).format("h:mm a")
    }

    return <View style={[styles.container]}>
        <TextInput label="Event" reminder value={event} onChangeText={event => setevent(event)} />
        <TextInput label="Venue" reminder value={venue} onChangeText={venue => setvenue(venue)} />

        {/* Timezone */}
        <Pressable onPress={() => showTimeZoneDialog()}>
            <View pointerEvents="none">
                <TextInput reminder label="TimeZone" value={timezoneDisplay} />
            </View>
        </Pressable>



        {/* Start date and Time */}
        <Pressable onPress={() => showDatePicker()}>
            <View pointerEvents="none">
                <TextInput reminder label="Start Date" value={startDate.toDateString()} />
            </View>
        </Pressable>

        {
            visibleStarDate && (<DateTimePicker
                testID="dateTimePicker"
                value={startDate}
                mode={mode}
                display="default"
                onChange={onChange}
            />)
        }

        <Pressable onPress={() => setVisibleStarTime(true)}>
            <View pointerEvents="none">
                <TextInput reminder label="Start Time" value={timeConverter(startTime)} />
            </View>
        </Pressable>

        {
            visibleStartTime && (<DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={onChangeStartTime}
            />)
        }

        {/* End -----Start date and Time */}


        <Pressable onPress={() => showEndDatePicker()}>
            <View pointerEvents="none">
                <TextInput reminder label="End Date" value={endDate.toDateString()} />
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
                <TextInput reminderlabel="End Time" value={timeConverter(endTime)} />
            </View>
        </Pressable>

        {
            visibleEndTime && (<DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={onChangeEndTime}
            />)
        }




        <View style={{ alignSelf: 'flex-end', justifyContent: "space-between", flexDirection: 'row', marginTop: 10 }}>
            <View style={{ width: 100 }}>
                {
                    editable && (
                        <Button style={{ backgroundColor: "darkred" }} mode="contained" onPress={() => deleteTrip()}>
                            <IconFA name='trash' size={20} color='white' />
                        </Button>
                    )

                }

            </View>
            <View style={{ width: 100, marginLeft: 2 }}>
                <Button style={{ color: "red" }} mode="contained" onPress={() => saveTrip()}>
                    <IconFA name='save' size={20} color='white' />
                </Button>
            </View>
        </View>

        <View style={{ alignSelf: 'flex-end', width: 200, marginTop: 10 }}>
            <Button mode="contained" style={{ backgroundColor: reminder ? "darkgreen" : "darkred" }} icon={reminder ? "bell" : "bell-slash"} onPress={() => setReminder(!reminder)}>
                Alert
            </Button>
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

        <Provider>
            <View>
                <Portal>
                    <Dialog style={{overflow:"hidden"}} visible={visibleTimezone}>
                    <Dialog.Title>Select Timezone</Dialog.Title>
                        <Dialog.Content >
                            <Searchbar
                            placeholder="Search"
                            onChangeText={onChangeSearch}
                            value={searchQuery}
                            />
                            <ScrollView style={{marginTop:10, height:"80%"}}>
                                {
                                        tzList.map((ele,key)=>{
                                            return <TouchableRipple onPress={()=>{setTimezoneDialog(ele)}} key={key}>
                                                <Text  style={{padding:10}} >{ele.text}</Text>
                                            </TouchableRipple>
                                        })
                                    }
                                
                            </ScrollView>

                            
                        </Dialog.Content>

                    </Dialog>
                </Portal>
            </View>
        </Provider>

        <Toast ref={childRef} text={errorText}></Toast>

    </View>;
};
