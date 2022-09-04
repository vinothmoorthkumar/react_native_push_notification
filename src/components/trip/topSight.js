import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { styles } from "../../style/style";
import NetInfo from "@react-native-community/netinfo";
import geo from "../../utlis/geoService"
import axios from "axios";
import { Avatar, Button, Card, Title, Paragraph, TextInput, List } from 'react-native-paper';
import db from "../../db/db_connection"

export const TopSights = ({ navigation, route }) => {

    const [locations, setLocations] = React.useState([]);

    useEffect(() => {
            // db.delete("DROP TABLE Destination");

        async function getdata() {
            let results = await db.select("SELECT * FROM Destination WHERE TripID=" + route.params.tripId, [])
            let lists = [];
            const count = results.rows.length;
            for (let i = 0; i < count; i++) {
                const row = results.rows.item(i);
                let obj = {
                    name: row.name,
                    photoUri: row.image,
                    geometry: {
                        location: {
                            lat: row.lat,
                            lng: row.long
                        }
                    }
                }
                lists.push(obj);
            }
            setLocations(lists)
            if (lists.length===0) {
                console.log("online list")
                NetInfo.fetch().then(state => {
                    if (state.isInternetReachable) {
                        geo.thingstodo(route.params.destination).then(function (response) {
                            // setVisible(true);
                            let cstArr = [];
                            response.forEach(async element => {
                                if (element.photos && element.photos.length > 0) {
                                    element["photoUri"] = geo.getPhotosByRef(element.photos[0].photo_reference)._W

                                } else {
                                    element["photoUri"] = "https://picsum.photos/700"
                                }
                                let imageresponse = await axios.get(element["photoUri"], { responseType: 'blob' })

                                var reader = new window.FileReader();
                                reader.readAsDataURL(imageresponse.data);
                                reader.onload = function () {
                                    var imageDataUrl = reader.result;
                                    let dataArr = [imageDataUrl, element.name, element.geometry.location.lat, element.geometry.location.lng, route.params.tripId];
                                    db.insert("INSERT INTO Destination (image, name,lat,long, TripID) VALUES (?,?,?,?,?)", dataArr)
                                    cstArr.push(element)
                                }
                            });

                            // response.forEach(element => {
                            //     let dataArr = [element.photoUri, element.name, element.geometry.location.lat, element.geometry.location.lng, route.params.tripId];
                            //     db.insert("INSERT INTO Destination (image, name,lat,long, TripID) VALUES (?,?,?,?,?)", dataArr)
                            // });
                            setLocations(response)

                        })
                            .catch(function (error) {
                                console.log(error);
                            });
                    } else {
                        Alert.alert("You are offline!")
                    }
                })
            }

        }


        if (route.params?.destination) {
            getdata();
        }

    }, [route.params?.destination])
    function redirecToMap(ele) {
        let location = ele.geometry.location
        var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
        var url = scheme + `${location.lat},${location.lng}`;
        Linking.openURL(url);
    }

    const listLocation = locations.map((ele, key) =>
        <View key={key} style={{ marginBottom: 10 }}>
            <TouchableOpacity onPress={() =>
                redirecToMap(ele)
            } style={{ padding: 2 }}>

                <List.Item
                    title={ele.name}
                    description=""
                    left={props => <Image source={{ uri: ele.photoUri }} style={{ width: 50, height: 50 }} />
                    }
                />
            </TouchableOpacity>
        </View>
    );

    return <View style={[styles.container, { backgroundColor: "white" }]}>
        <ScrollView >
            {listLocation}

        </ScrollView>
    </View>;
};
