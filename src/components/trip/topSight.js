import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { styles } from "../../style/style";
import NetInfo from "@react-native-community/netinfo";
import geo from "../../utlis/geoService"

import { Avatar, Button, Card, Title, Paragraph, TextInput, List } from 'react-native-paper';
import db from "../../db/db_connection"

export const TopSights = ({ navigation, route }) => {

    const [locations, setLocations] = React.useState([]);

    useEffect(() => {
        async function getdata() {
            NetInfo.fetch().then(state => {
                if (state.isInternetReachable) {
                    geo.thingstodo(route.params.destination).then(function (response) {
                        // setVisible(true);
                        let cstArr = [];
                        response.forEach(element => {
                            if (element.photos && element.photos.length > 0) {
                                element["photoUri"] = geo.getPhotosByRef(element.photos[0].photo_reference)._W

                            } else {
                                element["photoUri"] = "https://picsum.photos/700"
                            }
                            cstArr.push(element)

                        });
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

        console.log("DDD", route.params)


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
