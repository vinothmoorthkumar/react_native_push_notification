import React, { useState, useEffect, useRef } from 'react'
import { View, TouchableOpacity, Linking } from 'react-native';
import { styles } from "../../style/style";
import IconFA from 'react-native-vector-icons/FontAwesome';
import { useTheme } from 'react-native-paper';
import Toast from "../shared/Toast"
import { Title, TextInput, Button, Card, Portal, Modal, Dialog, IconButton } from 'react-native-paper';
import db from "../../db/db_connection"
import geo from "../../utlis/geoService"

export const Places = ({ navigation, route }) => {
    const { colors } = useTheme();
    const childRef = useRef(null);

    const [visible, setVisible] = React.useState(false);
    const [name, setName] = React.useState(false);
    const [url, setURL] = React.useState("");

    const [list, setList] = React.useState([]);
    const [editable, seteditable] = React.useState(false);
    const [editableId, seteditableId] = React.useState(false);
    const [visibleDialog, setvisibleDialog] = React.useState(false);


    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const hideDialog = () => setvisibleDialog(false);


    const containerStyle = { backgroundColor: 'white', padding: 20, margin: 20 };

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
        if (!name.trim()) {
            setErrorText("Please Enter Trip Name")
            childRef.current.alert();
            return
        }


        let response = { lat: "", long: "" }
        if (url && url != "") {
            let location = url.split(",")
            response.lat = location[0]
            response.long = location[1]
            // response = await geo.getlatlngByURL(url)
        }
        let dataArr = [name, url, response.lat, response.long, route.params.catId];
        if (editable) {
            dataArr.push(editableId)
            await db.update('UPDATE PLACES SET name = ?,url = ?,lat = ?,long = ?, CATID = ? WHERE id = ?', dataArr);
        } else {
            await db.insert("INSERT INTO PLACES (name,url,lat,long,CATID) VALUES (?,?,?,?,?)", dataArr)
        }

        getdata()

        seteditable(false);
        setName("");
        setURL("");
        seteditableId(0)
        hideModal();

    }

    function edit(key) {
        showModal();
        seteditable(true);
        let data = list[key]
        setName(data.name);
        setURL(data.url);
        seteditableId(data.ID)
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



    const listItems = list.map((ele, key) =>
        <View key={key}>
            <TouchableOpacity style={{ padding: 5 }}>
            {/* <Card>
    <Card.Title title="Card Title" subtitle="Card Subtitle" />

  </Card> */}
                <Card>
                    <Card.Title
                        title={<Title onPress={() =>
                            redirecToMap(ele)
                        }>{ele.name}</Title>}
                        // subtitle="Card Subtitle"
                        // style={{ backgroundColor: colors.text }}
                        right={(props) => <IconButton {...props} icon="pencil" onPress={() => {edit(key)}} />}
                        // right={(props) => <IconFA onPress={() => { edit(key) }} style={{ paddingRight: 5 }} size={20} color="gray" name="pencil" />}
                    />
                </ Card>

            </TouchableOpacity>
        </View>
    );

    return <View style={[styles.container]}>
        {listItems}
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <TextInput label="Place Name" value={name} onChangeText={name => setName(name)} />
                {/* <TextInput label="Gmap Location URL" value={url} onChangeText={url => setURL(url)} /> */}
                <TextInput label="Coordinates" value={url} onChangeText={url => setURL(url)} />
                <View style={{ alignSelf: 'flex-end', justifyContent: "space-between", flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ width: 100 }}>
                        <Button mode="contained" onPress={hideModal}>
                            <IconFA name='close' size={20} color='white' />
                        </Button>
                    </View>

                    <View style={{ width: 100 }}>
                        <Button mode="contained" onPress={() => deleteCat()}>
                            <IconFA name='trash' size={20} color='white' />
                        </Button>
                    </View>
                    <View style={{ width: 100 }}>
                        <Button mode="contained" onPress={() => saveCategory()}>
                            <IconFA name='save' size={20} color='white' />
                        </Button>
                    </View>
                </View>
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

        <Toast ref={childRef} text="Updated Successfully"></Toast>
    </View>
};
