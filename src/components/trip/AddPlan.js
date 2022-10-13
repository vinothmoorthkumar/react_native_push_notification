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
import { Button, useTheme, TextInput, Dialog, Provider, Portal, Searchbar, Text, Divider, TouchableRipple } from 'react-native-paper';
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
    const [timezoneList, settimezoneList] = React.useState([]);

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
        settimezoneList(tzList);
        async function getdata() {
            let results = await db.select("SELECT * FROM PLAN WHERE ID=" + route.params.id, [])
            let data = results.rows.item(0);
            setevent(data.event);
            setvenue(data.venue);
            settimezone(data.TIMEZONE);
            let gettz = tzList.find(ele => { return ele.value == data.TIMEZONE })
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
        } else {
            let guesstz = moment.tz.guess()
            let gettz = tzList.find(ele => {
                let index = ele.utc.indexOf(guesstz)
                return index > -1
            })
            settimezone(gettz.value);
            settimezoneDisplay(gettz.text)
        }



    }, [route.params?.post])


    const formatDate = (date, time) => {
        let sTime = moment(new Date(time)).format("h:mm a")
        let sDate = moment(date).format("M/DD/YYYY")
        let output = moment(`${sDate} ${sTime}`, "MM/DD/YYYY h:mm a").format('l LT');
        return output;
    }

    const onChangeSearch = query =>{
        let listfound=tzList.filter(ele=>
            ele.text.toLowerCase().includes(query.toLowerCase())
        )
        settimezoneList(listfound)
        setSearchQuery(query)
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

        let dataArr = [event, venue, formatDate(startDate, startTime), timezone, formatDate(endDate, endTime), reminder, tripId];
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

    const setTimezoneDialog = (ele) => {
        settimezone(ele.value);
        settimezoneDisplay(ele.text);
        setVisibleTimezone(false)
    }

    const reminderNotification = () => {
        let gettz=tzList.find(ele => { return ele.value == timezone })

        // let time = new Date(moment(new Date(formatDate(startDate, startTime))).subtract(5, "minutes"))
        let time =  new Date( moment.tz(formatDate(startDate, startTime),"MM/DD/YYYY hh:mm A", gettz.utc[0]).subtract(5, "minutes").format());
        let notificationObj = {
            channelId: "reminder",
            // showWhen: true,
            // when: new Date().getTime(),
            title: "Reminder",
            allowWhileIdle: true,
            usesChronometer: true,
            priority: 'high',
            importance: Importance.HIGH,
            message: `${event} at ${moment(new Date(startTime)).format('h:mm a')+ ` ${timezone}`}`, // (required)
            date: time // in 30 secs
        };
        PushNotification.localNotificationSchedule(notificationObj);
    }
    const onToggleSwitch = () => setReminder(!reminder);

    const timeConverter = (time) => {
        return moment(new Date(time)).format("h:mm a")
    }

    return <View style={[styles.container]}>
        <TextInput style={{backgroundColor:"transparent"}} label="Event" value={event} onChangeText={event => setevent(event)} />
        <TextInput style={{backgroundColor:"transparent"}}  label="Venue" reminder value={venue} onChangeText={venue => setvenue(venue)} />

        {/* Timezone */}
        <Pressable onPress={() => showTimeZoneDialog()}>
            <View pointerEvents="none">
                <TextInput style={{backgroundColor:"transparent"}}  reminder label="TimeZone" multiline={true} value={timezoneDisplay} />
            </View>
        </Pressable>



        {/* Start date and Time */}
        <Pressable onPress={() => showDatePicker()}>
            <View pointerEvents="none">
                <TextInput style={{backgroundColor:"transparent"}}  reminder label="Start Date" value={startDate.toDateString()} />
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
                <TextInput style={{backgroundColor:"transparent"}}  reminder label="Start Time" value={timeConverter(startTime)} />
            </View>
        </Pressable>

        {
            visibleStartTime && (<DateTimePicker
                value={new Date(startTime)}
                mode="time"
                display="default"
                onChange={onChangeStartTime}
            />)
        }

        {/* End -----Start date and Time */}


        <Pressable onPress={() => showEndDatePicker()}>
            <View pointerEvents="none">
                <TextInput style={{backgroundColor:"transparent"}}  reminder label="End Date" value={endDate.toDateString()} />
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
                <TextInput style={{backgroundColor:"transparent"}}  reminderlabel="End Time" value={timeConverter(endTime)} />
            </View>
        </Pressable>

        {
            visibleEndTime && (<DateTimePicker
                value={new Date(endTime)}
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
                <Portal>
                    <Dialog style={{ overFlow:"hidden",alignSelf: "center", minWidth:"90%" }} visible={visibleTimezone} onDismiss={()=>{setVisibleTimezone(false)}}>
                        <Dialog.Title>
                            Select Timezone
                        </Dialog.Title>
                        <Dialog.Content >
                            <View>
                                <Searchbar
                                        placeholder="Search"
                                        onChangeText={onChangeSearch}
                                        value={searchQuery}
                                    />
                                    <View  style={{height:"85%"}}>
                                        <ScrollView >
                                            {
                                                timezoneList.map((ele, key) => {
                                                    return <TouchableRipple onPress={() => { setTimezoneDialog(ele) }} key={key}>
                                                        <Text style={{ padding: 10 }} >{ele.text}</Text>
                                                    </TouchableRipple>
                                                })
                                            }

                                        </ScrollView>
                                    </View>
                            </View>


                        </Dialog.Content>
                    </Dialog>
                </Portal>
        </Provider>

        <Toast ref={childRef} text={errorText}></Toast>

    </View>;
};
