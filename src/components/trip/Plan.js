import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, ScrollView, Image, Linking, Platform, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import geo from "../../utlis/geoService"
import { useTheme } from 'react-native-paper';

import { styles } from "../../style/style";
import IconFA from 'react-native-vector-icons/FontAwesome';

import { Card, Title, Paragraph, TouchableRipple, Portal, Text, Appbar, List, Dialog, Provider } from 'react-native-paper';
import NetInfo from "@react-native-community/netinfo";
import db from "../../db/db_connection"
import moment from "moment-timezone";
import tzList from "../../utlis/timezoneList"

export const Plans = ({ navigation, route }) => {
    const { colors } = useTheme();
    // const netInfo = useNetInfo();
    const [plans, setPlans] = useState([]);
    const isFocused = useIsFocused()
    const [visible, setVisible] = React.useState(false);
    const [locations, setLocations] = React.useState([]);

    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 10, marginHorizontal: 20 };

    useEffect(() => {
        async function getdata() {
            const lists = [];
            let results = await db.select("SELECT * FROM PLAN WHERE TripID=" + route.params.id + " ORDER BY startDate ASC", [])
            const count = results.rows.length;
            for (let i = 0; i < count; i++) {
                const row = results.rows.item(i);
                lists.push(row);
            }
            let groupeddate=groupByDate(lists);
            setPlans(groupeddate.sort( compare ))
        }
        getdata();
    }, [isFocused])


    function compare( a, b ) {
        // console.log("#####",a.date)
        // if ( a.date < b.date ){
        //   return -1;
        // }
        // if ( a.date > b.date ){
        //   return 1;
        // }
        // return 0;
        return new Date(a.date) - new Date(b.date);
      }
      
      

    function groupByDate(data) {
        // this gives an object with dates as keys
        const groups = data.reduce((groups, plan) => {
            const date = plan.startDate.split(' ')[0];
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(plan);
            return groups;
        }, {});

        // Edit: to add it in the array format instead
        const groupArrays = Object.keys(groups).map((date) => {
            return {
                date,
                plans: groups[date]
            };
        });
        return groupArrays;
    }

    function datetimeFormate(date,timezone){
        let gettz = tzList.find(ele => { return ele.value == timezone})
        return moment(new Date(date)).format("h:mm a")+` ${gettz.abbr}`
    }

    function randomColor() {
        const icons = ["#36EEE0", "#F652A0", "#BCECE0", "#BD97CB", "#66D2D6"]
        const random = Math.floor(Math.random() * icons.length);
        return icons[random]
      }

    const listItems = plans.map((eledate, datekey) =>
    {
        let getcolor= randomColor();
        return <View key={datekey} style={{ marginBottom: 10 }}>
            <Title style={{ color: colors.text }}>{moment(new Date(eledate.date)).format("ddd MMM DD")}</Title>

    {
                 eledate.plans.map((ele, key) => 
                 <View key={key} style={{marginBottom:5}}>
                    <TouchableOpacity onPress={() =>
                            navigation.navigate('AddPlan', { destination: route.params.destination,tripId: route.params.id, id: ele.ID })
                        } >
                            <View style={{flexDirection:"row", backgroundColor:"white",padding:10,borderRadius:5,borderLeftColor:getcolor, borderStyle:"solid",borderLeftWidth:3}}>
                                <View style={{borderLeftColor:"red", paddingRight:5}}>
                                    <Text variant="titleMedium">{datetimeFormate(ele.startDate,ele.TIMEZONE)}</Text>
                                </View>
                                <View style={{paddingLeft:5,borderLeftColor:getcolor, borderStyle:"solid",borderLeftWidth:2}}>
                                    <Text variant="titleMedium">{ele.event}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                 </View>)
    }

 
            {/* <Title style={{ color: colors.text }}>{moment(new Date(eledate.date)).format("ddd MMM DD")}</Title>
            {
                eledate.plans.map((ele, key) => 
                    <View key={key}>
                        <TouchableOpacity onPress={() =>
                            navigation.navigate('AddPlan', { destination: route.params.destination,tripId: route.params.id, id: ele.ID })
                        } style={{ padding: 2 }}>
                            <Card>
                                <Card.Content>
                                    <Title style={{textTransform: "capitalize"}}>{ele.event}</Title>
                                    <Paragraph>{datetimeFormate(ele.startDate,ele.TIMEZONE)}, {datetimeFormate(ele.endDate,ele.TIMEZONE)}</Paragraph>
                                </Card.Content>
                            </Card>
                        </TouchableOpacity>
                    </View>
                )
            } */}

        </View>
}
    );

    return <View style={[styles.container]}>
        {/* <Title style={{ color: colors.text }}>Fri Sep 02</Title>
        <TouchableOpacity>
            <View style={{flexDirection:"row", backgroundColor:"white",padding:10,borderRadius:10,borderLeftColor:"#74bbfb", borderStyle:"solid",borderLeftWidth:3}}>
                <View style={{borderLeftColor:"red", paddingRight:5}}>
                    <Text variant="titleMedium">7:27pm AST</Text>
                </View>
                <View style={{paddingLeft:5,borderLeftColor:"#74bbfb", borderStyle:"solid",borderLeftWidth:2}}>
                    <Text variant="titleMedium">Swimming</Text>
                </View>
            </View>
        </TouchableOpacity> */}
        {listItems.length > 0 ? (<ScrollView >
            {listItems}
        </ScrollView>) : <Text style={{ color: colors.TextInput }}>Press + button to create Plan</Text>}

        {/* <View style={{ position: "absolute", bottom: 150, right: 25 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('TopSights', { destination: route.params.destination, tripId: route.params.id }) }}>
                <View style={{
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: 'red'
                }}>
                    <IconFA size={40} />
                    <IconFA name='street-view' size={20} color='white' style={{ position: 'absolute', zIndex: 99 }} />
                </View>
            </TouchableOpacity>
        </View> */}

        <View style={{ position: "absolute", bottom: 150, right: 25 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('CheckList', { id: route.params.id }) }}>
                <View style={{
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: 'red'
                }}>
                    <IconFA size={40} />
                    <IconFA name='check' size={20} color='white' style={{ position: 'absolute', zIndex: 99 }} />
                </View>
            </TouchableOpacity>
        </View>

        <View style={{ position: "absolute", bottom: 100, right: 25 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('placeCategories', { destination: route.params.destination, tripId: route.params.id }) }}>
                <View style={{
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 100,
                    backgroundColor: 'green'
                }}>
                    <IconFA size={40} />
                    <IconFA name='map-marker' size={20} color='white' style={{ position: 'absolute', zIndex: 99 }} />
                </View>
            </TouchableOpacity>
        </View>


        <View style={{ position: "absolute", bottom: 20, right: 20 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('AddPlan', { destination: route.params.destination,tripId: route.params.id }) }}>
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
    </View>;
};
