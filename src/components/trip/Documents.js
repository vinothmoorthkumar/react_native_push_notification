import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { styles } from "../../style/style";

import { Avatar, Button, Card, Title, Paragraph, TextInput, Text } from 'react-native-paper';
import db from "../../db/db_connection"
import DocumentPicker from 'react-native-document-picker';

export const Documents = ({ navigation, route }) => {
    const [singleFile, setSingleFile] = useState('');

    const selectOneFile = async () => {
        //Opening Document Picker for selection of one file
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
                //There can me more options as well
                // DocumentPicker.types.allFiles
                // DocumentPicker.types.images
                // DocumentPicker.types.plainText
                // DocumentPicker.types.audio
                // DocumentPicker.types.pdf
            });
            setSingleFile(res[0]);

            //Printing the log realted to the file
            console.log('res : ' + singleFile);
            console.log('URI : ' + singleFile.uri);
            console.log('Type : ' + singleFile.type);
            console.log('File Name : ' + singleFile.name);
            console.log('File Size : ' + singleFile.size);
            //Setting the state to show single file attributes
        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                alert('Canceled from single doc picker');
            } else {
                //For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };
    useEffect(() => {
        // async function getdata() {
        //     let results = await db.select("SELECT * FROM TRIP WHERE ID=" + route.params.id, [])
        //     let data = results.rows.item(0);
        // }
        // if (route.params?.id) {
        //     getdata();
        // }

    }, [])

    // return <View style={[styles.container]}>

    // </View>;


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={styles.titleText}>
                Example of File Picker in React Native
            </Text>
            <View style={styles.container}>
                {/*To show single file attribute*/}
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.buttonStyle}
                    onPress={selectOneFile}>
                    {/*Single file selection button*/}
                    <Text style={{ marginRight: 10, fontSize: 19 }}>
                        Click here to pick one file
                    </Text>
                    <Image
                        source={{
                            uri: 'https://img.icons8.com/offices/40/000000/attach.png',
                        }}
                        style={styles.imageIconStyle}
                    />
                </TouchableOpacity>
                {/*Showing the data of selected Single file*/}
                <Text style={styles.textStyle}>
                    File Name: {singleFile.name ? singleFile.name : ''}
                    {'\n'}
                    Type: {singleFile.type ? singleFile.type : ''}
                    {'\n'}
                    File Size: {singleFile.size ? singleFile.size : ''}
                    {'\n'}
                    URI: {singleFile.uri ? singleFile.uri : ''}
                    {'\n'}
                </Text>
                <View
                    style={{
                        backgroundColor: 'grey',
                        height: 2,
                        margin: 10
                    }} />

            </View>
        </SafeAreaView>
    );
};
