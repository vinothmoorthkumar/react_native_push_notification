import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    View,
    Pressable,
    Dimensions
} from 'react-native';
import { styles } from "../../style/style";
import DateTimePicker from '@react-native-community/datetimepicker';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { useTheme } from 'react-native-paper';
import moment from "moment";

import { Button, TextInput, Text, Dialog, Provider, Portal ,ActivityIndicator} from 'react-native-paper';
import axios from "axios";

import db from "../../db/db_connection"
import geo from "../../utlis/geoService"

import { Route } from 'express';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

export const AddTrip = ({ navigation, route }) => {
    const { colors } = useTheme();

    const [visibleStarDate, setVisibleStarDate] = React.useState(false);
    const [visibleEndDate, setVisibleEndDate] = React.useState(false);

    const [mode, setMode] = React.useState('date');

    const [destination, setDestination] = React.useState("");
    const [name, setName] = React.useState("");
    const [startDate, setStartdate] = React.useState(new Date());
    const [endDate, setEnddate] = React.useState(new Date());
    const [placeId, setplaceId] = React.useState("");

    const [editable, seteditable] = React.useState(false);
    const [loading, setLoading] = useState(false)
    const [suggestionsList, setSuggestionsList] = useState(null)
    const [showAutoComplete, setShowAutoComplete] = useState(false)
    const [visible, setVisible] = React.useState(false);
    const [errorText, setErrorText] = React.useState("");
    const [loader, setLoader] = React.useState(false);

    const childRef=useRef(null);
    const hideDialog = () => setVisible(false);

    const [selectedItem, setSelectedItem] = useState(null)
    const dropdownController = useRef(null)

    const searchRef = useRef(null)

    const getSuggestions = useCallback(async q => {
        const filterToken = q.toLowerCase()
        if (typeof q !== 'string' || q.length < 3) {
            setSuggestionsList(null)
            return
        }
        setLoading(true)
        geo.suggestions(q).then(function (response) {
            const items = response.data.predictions;
            const suggestions = items
                .filter(item => item.description.toLowerCase().includes(filterToken))
                .map(item => ({
                    id: item.place_id,
                    title: item.description,
                }))
            setSuggestionsList(suggestions)
            setLoading(false)

        })
            .catch(function (error) {
                console.log(error);
            });

    }, [])

    const onClearPress = useCallback(() => {
        setSuggestionsList(null)
    }, [])

    const onOpenSuggestionsList = useCallback(isOpened => { }, [])
    useEffect(() => {

        async function getdata() {
            let results = await db.select("SELECT * FROM TRIP WHERE ID=" + route.params.id, [])
            let data = results.rows.item(0);
            setplaceId(data.placeId);
            setDestination(data.destination);
            setName(data.name);
            setStartdate(new Date(data.startDate));
            setEnddate(new Date(data.endDate));

            setSuggestionsList([{ id: data.placeId, title: data.destination }])
            setShowAutoComplete(true)
        }
        if (route.params?.id) {
            seteditable(true)
            getdata();
        } else {
            setShowAutoComplete(true)
        }



    }, [route.params?.post])


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setStartdate(currentDate);
        setVisibleStarDate(false);
    };


    function getLocations(query) {
        setDestination(query)
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
        db.delete("DELETE FROM TRIP WHERE ID=" + route.params.id);
        navigation.navigate('Home')
    }


    async function saveTrip() {
        if(!name.trim()){
            setErrorText("Please Enter Trip Name")
            childRef.current.alert();
            return 
        }
        setLoader(true)

        let destinationImage="";
        if(destination){
            let placeDetails = await geo.getPlaceDetails(placeId)
            let photoData="";
            if(placeDetails.result && placeDetails.result.photos){
                photoData = await geo.getPhotosByRef(placeDetails.result.photos[0].photo_reference,500)._W
            }else{
                photoData = "https://picsum.photos/700"
            }

            let imageresponse = await axios.get(photoData, { responseType: 'blob' })
            var reader = new window.FileReader();
            reader.readAsDataURL(imageresponse.data);
            reader.onload = async function () {
                destinationImage = reader.result;
                let dataArr = [destination, placeId, destinationImage, name, getstartDateFormate(startDate), getendDateFormate(endDate)];
                allProcessDone(dataArr)
            }
        }else{
            let dataArr = [destination, placeId, "", name, getstartDateFormate(startDate), getendDateFormate(endDate)];
            allProcessDone(dataArr)   
        }
    }

    function allProcessDone(dataArr){
        if (editable) {
            dataArr.push(route.params.id)
            db.update('UPDATE TRIP SET destination = ? , placeId = ?,destinationImage = ?, name = ?, startDate = ?, endDate = ? WHERE id = ?', dataArr);
        } else {
            db.insert("INSERT INTO TRIP (destination,placeId,destinationImage, name, startDate, endDate) VALUES (?,?,?,?,?,?)", dataArr)
        }
        setLoader(false)

        navigation.navigate('Home')
    }

    function setDest(item) {
        setDestination(item.title)
        setplaceId(item.id)
    }

    function getstartDateFormate(date) {
        // date.setUTCHours(0, 0, 0, 0)
        // var isoDate = date.toISOString()
        var isoDate = moment(date).startOf('day').toISOString()

        return isoDate;
    }

    function getendDateFormate(date) {
        // date.setUTCHours(23, 59, 59);
        var isoDate = moment(date).endOf('day').toISOString()
        return isoDate;
    }

    return <View style={[styles.container]}>


        {
            showAutoComplete && (
                <AutocompleteDropdown
                    ref={searchRef}
                    controller={controller => {
                        dropdownController.current = controller
                    }}

                    direction={Platform.select({ ios: 'down' })}
                    initialValue={{ id: placeId }}
                    dataSet={suggestionsList}
                    onChangeText={getSuggestions}
                    onSelectItem={item => {
                        item && setDest(item)
                    }}
                    debounce={600}
                    suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
                    onClear={onClearPress}
                    //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
                    onOpenSuggestionsList={onOpenSuggestionsList}
                    loading={loading}
                    useFilter={false} // set false to prevent rerender twice
                    textInputProps={{
                        placeholder: 'Destination',
                        autoCorrect: false,
                        autoCapitalize: 'none',
                        style: {
                            backgroundColor: colors.label,
                            color: "black",
                        },
                        placeholderTextColor: colors.primary
                    }}

                    rightButtonsContainerStyle={{
                        right: 8,
                        height: 30,
                        alignSelf: 'center',

                    }}
                    inputContainerStyle={{
                        backgroundColor: colors.surfaceVariant,

                    }}
                    suggestionsListContainerStyle={{
                        backgroundColor: '#383b42',
                    }}
                    renderItem={(item, text) => <Text style={{ color: '#fff', padding: 15 }}>{item.title}</Text>}
                    inputHeight={50}
                    showChevron={false}
                    closeOnBlur={false}
                />
            )
        }




        {/* <TextInput label="Destination" value={destination} onChangeText={destination => getLocations(destination)} /> */}
        <TextInput label="Trip Name" placeholderTextColor="red" style={{ color: "red" }} value={name} onChangeText={name => setName(name)} />
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
                        <Button style={{backgroundColor:"darkred"}} mode="contained" onPress={() => deleteTrip()}>
                            <IconFA name='trash' size={20} color='white' />
                        </Button>
                    )
                }

            </View>
            <View style={{ width: 100,marginLeft:2 }}>
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
        {loader &&<View style={styles.loader} >
                <ActivityIndicator size='large' animation={true} />
        </View>}
    </View>;
};
