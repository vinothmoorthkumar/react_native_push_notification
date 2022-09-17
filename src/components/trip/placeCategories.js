import React, { useState, useEffect, useRef } from 'react'
import { View, TouchableOpacity } from 'react-native';
import { styles } from "../../style/style";
import IconFA from 'react-native-vector-icons/FontAwesome';
import { useTheme } from 'react-native-paper';
import Toast from "../shared/Toast"
import { Title, TextInput, Button, Card, Portal, Modal, Dialog, IconButton, Avatar } from 'react-native-paper';
import db from "../../db/db_connection"
export const PlaceCategories = ({ navigation, route }) => {
    const { colors } = useTheme();
    const childRef = useRef(null);

    const [visible, setVisible] = React.useState(false);
    const [name, setName] = React.useState(false);
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


    }, [route.params?.tripId])

    async function getdata() {
        const lists = [];
        let results = await db.select("SELECT * FROM CATEGORY WHERE TripID=" + route.params.tripId, [])
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
        let dataArr = [name, route.params.tripId];
        if (editable) {
            dataArr.push(editableId)
            await db.update('UPDATE CATEGORY SET name = ?, TripID = ? WHERE id = ?', dataArr);
        } else {
            await db.insert("INSERT INTO CATEGORY (name,TripID) VALUES (?,?)", dataArr)
        }

        getdata()

        seteditable(false);
        setName("");
        seteditableId(0)
        hideModal();

    }

    function edit(key) {
        showModal();
        seteditable(true);
        let getData = list[key]
        setName(getData.name);
        seteditableId(getData.ID)
    }

    function deleteCat() {
        setvisibleDialog(true)
    }



    function confirmDelete() {
        db.delete("DELETE FROM CATEGORY WHERE ID=" + editableId);
        setvisibleDialog(false)
        seteditable(false);
        setName("");
        seteditableId(0)
        hideModal();
        getdata()
    }


    const listItems = list.map((ele, key) =>
        <View key={key}>
            <TouchableOpacity style={{ padding: 2 }}>
                <Card>
                    <Card.Title
                        title={<Title onPress={() =>
                            navigation.navigate('Places', {catId:ele.ID})
                        }>{ele.name}</Title>}
                        onPress={() =>
                            navigation.navigate('Places', { catId: ele.ID })
                        }
                        right={(props) => <IconButton {...props} icon="pencil" onPress={() => {edit(key)}} />}
                    />
                </Card>
            </TouchableOpacity>
        </View>
    );

    return <View style={[styles.container]}>
        {listItems}
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <TextInput label="Category Name" value={name} onChangeText={name => setName(name)} />
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
