import React, { useState, useEffect, useRef, Icon } from 'react'
import { StyleSheet } from 'react-native';

import { View, TouchableOpacity, Linking } from 'react-native';
import { styles } from "../../style/style";
import IconFA from 'react-native-vector-icons/FontAwesome';
import { useTheme } from 'react-native-paper';
import Toast from "../shared/Toast"
import { Title,Text, TextInput, Button, Card, Portal, Modal, Dialog, IconButton } from 'react-native-paper';
import db from "../../db/db_connection"
import geo from "../../utlis/geoService"
import MapView, { PROVIDER_GOOGLE, Animated, Marker } from 'react-native-maps';

export const Places = ({ navigation, route }) => {
    const { colors } = useTheme();
    const childRef = useRef(null);

    const [visible, setVisible] = React.useState(false);
    const [name, setName] = React.useState("");
    const [url, setURL] = React.useState("");

    const [list, setList] = React.useState([]);
    const [editable, seteditable] = React.useState(false);
    const [region, setRegion] = React.useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [editableId, seteditableId] = React.useState(false);
    const [visibleDialog, setvisibleDialog] = React.useState(false);
    const [errorText, setErrorText] = React.useState("");


    const showModal = () => setVisible(true);
    const hideModal = () => {
        setName("")
        setURL("")
        seteditable(false)
        setVisible(false)
    };
    const hideDialog = () => setvisibleDialog(false);


    const containerStyle = { backgroundColor: 'white', padding: 10 };

    useEffect(() => {

        getdata();


    }, [route.params?.catId])

    async function getdata() {
        const lists = [];
        let results = await db.select("SELECT * FROM PLACES WHERE CATID=" + route.params.catId, [])
        const count = results.rows.length;
        for (let i = 0; i < count; i++) {
            const row = results.rows.item(i);
            lists.push(row);
        }
        setList(lists)
    }


    async function saveCategory() {
        if (!name || name == "") {
            setErrorText("Please Enter Name")
            childRef.current.alert();
            return
        }


        // if (!url || url == "") {
        //     setErrorText("Please Enter URL")
        //     childRef.current.alert();
        //     return
        // }

        let response = { lat: "", long: "" }
        // if (url && url != "") {
        //     let location = url.split(",")
        //     response.lat = location[0]
        //     response.long = location[1]
        //     // response = await geo.getlatlngByURL(url)
        // }

        if (!name || name=="") {
            setErrorText("Please Enter Name")
            childRef.current.alert();
            return
        }

        // let pattern = /\bhttps?:\/\/\S+/;
        // let data = url.match(pattern);
        // if (!data || !data[0]) {
        //     setErrorText("Must be url")
        //     childRef.current.alert();
        //     return
        // }
        // let convertedUrl = data[0]

        let dataArr = [name, "", region.latitude, region.longitude,region.latitudeDelta, region.longitudeDelta, route.params.catId];
        if (editable) {
            dataArr.push(editableId)
            await db.update('UPDATE PLACES SET name = ?,url = ?,lat = ?,long = ?,latDelta=?,longDelta=?, CATID = ? WHERE id = ?', dataArr);
        } else {
            await db.insert("INSERT INTO PLACES (name,url,lat,long,latDelta,longDelta,CATID) VALUES (?,?,?,?,?,?,?)", dataArr)
        }

        getdata()

        seteditable(false);
        setName("");
        setURL("");
        seteditableId(0)
        hideModal();
        setErrorText("Updated Successfully")
        childRef.current.alert();
    }

    function edit(key) {
        showModal();
        seteditable(true);
        let data = list[key]
        setName(data.name);
        setURL("");
        seteditableId(data.ID)
        setRegion({
            latitude: parseFloat(data.lat),
            longitude: parseFloat(data.long),
            latitudeDelta: parseFloat(data.latDelta),
            longitudeDelta: parseFloat(data.longDelta),
        })
    }

    function deleteCat() {
        setvisibleDialog(true)
    }



    function confirmDelete() {
        db.delete("DELETE FROM PLACES WHERE ID=" + editableId);
        setvisibleDialog(false)
        seteditable(false);
        setName("");
        setURL("");

        seteditableId(0)
        hideModal();
        getdata()
    }

    function redirecToMap(ele) {
        var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
        var url = scheme + `${ele.lat},${ele.long}`;
        Linking.openURL(url);
    }

    const markLocation = (reg) => {
        setRegion(reg)

    }



    const listItems = list.map((ele, key) =>
        <View key={key}>
            <TouchableOpacity onPress={() => { redirecToMap(ele) }}>
                <Card>
                    <Card.Title
                        title={<Title>{ele.name}</Title>}
                        right={(props) => {
                            return <View style={{ flexDirection: "row" }}>
                                <IconButton {...props} icon="ellipsis-v" onPress={() => { edit(key) }} />
                            </View>
                        }}
                        x />
                </ Card>

            </TouchableOpacity>
        </View>
    );

    return <View style={[styles.container]}>
        {listItems}
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", }}>
                    {editable && <Title>Update Place</Title>}
                    {!editable && <Title>Add Place</Title>}
                    <IconFA onPress={hideModal} style={{ textAlign: "right", paddingBottom: 20 }} name='remove' size={20} color='gray' />
                </View>
                <TextInput label="Place Name" value={name} onChangeText={name => setName(name)} />
                {/* <TextInput label="Map URl" value={url} onChangeText={url => setURL(url)} /> */}
                <Text variant="labelLarge" style={{paddingVertical:2}}>Mark locaction on Map</Text>
                <View style={{ height: "70%" }}>
                    {/*Render our MapView*/}

                    <IconFA name="map-marker"
                        style={{
                            zIndex: 3,
                            position: 'absolute',
                            marginTop: -37,
                            marginLeft: -11,
                            left: '50%',
                            top: '50%'
                        }}
                        size={40}
                        color="#f00" />
                    <MapView region={region} style={stylesMap.map} zoomEnabled={true} zoomTapEnabled={true} onRegionChangeComplete={markLocation}>
                        {/* 
                        <Marker
                            // key={index}
                            coordinate={region}
                        // title={marker.title}
                        // description={marker.description}
                        /> */}
                    </MapView>

                </View>

                <View style={{ alignSelf: 'flex-end', justifyContent: "space-between", flexDirection: 'row', marginTop: 10 }}>
                    {editable && <View style={{ width: 100 }}>
                        <Button mode="contained" onPress={() => deleteCat()}>
                            <IconFA name='trash' size={20} color='white' />
                        </Button>
                    </View>}
                    <View style={{ width: 100, marginLeft: 10 }}>
                        <Button mode="contained" onPress={() => saveCategory()}>
                            <IconFA name='save' size={20} color='white' />
                        </Button>
                    </View>
                    
                </View>
                <Toast ref={childRef} text={errorText}></Toast>

            </Modal>
        </Portal>


        <View style={{ position: "absolute", bottom: 20, right: 20 }}>
            <TouchableOpacity onPress={showModal}>
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

        <View>
            <Portal>
                <Dialog visible={visibleDialog} onDismiss={hideDialog}>
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

    </View>
};


const stylesMap = StyleSheet.create({
    mapcontainer: {
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})