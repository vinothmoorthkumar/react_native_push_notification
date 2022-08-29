import React from 'react'
import {
    Text,
    View,
    Pressable
} from 'react-native';
import { styles } from "../../style/style";
import DateTimePicker from '@react-native-community/datetimepicker';
import IconFA from 'react-native-vector-icons/FontAwesome';

import { Avatar, Button, Card, Title, Paragraph, TextInput } from 'react-native-paper';
const LeftContent = props => <Avatar.Icon {...props} icon="folder" />


export const AddTrip = ({ navigation, route }) => {
    const [visibleStarDate, setVisibleStarDate] = React.useState(false);
    const [visibleEndDate, setVisibleEndDate] = React.useState(false);

    const [mode, setMode] = React.useState('date');

    const [destination, setDestination] = React.useState("");
    const [name, setName] = React.useState("");
    const [startDate, setStartdate] = React.useState(new Date());
    const [endDate, setEnddate] = React.useState(new Date());

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setStartdate(currentDate);
        setVisibleStarDate(false);
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

    return <View style={[styles.container]}>
        <TextInput label="Destination" value={destination} onChangeText={destination => setDestination(destination)} />
        <TextInput label="Trip Name" value={name} onChangeText={name => setName(name)} />
        <Pressable onPress={() => showDatePicker()}>
            <View pointerEvents="none">
                <TextInput label="Start Date" value={startDate.toString()} />
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
                <TextInput label="Start Date" value={endDate.toString()} />
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
        <View style={{  alignSelf: 'flex-end',  
}}>
            <View style={{width:100}}>
                <Button mode="contained" onPress={() => console.log('Pressed')}>
                    <IconFA name='save' size={20} color='white'  />
                </Button>
            </View>
        </View>
       
        {/* <RNDateTimePicker visible={visible} mode="date" value={new Date()} onChange={onChange} /> */}

        {/* <Card>
    <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent} />
    <Card.Content>
      <Title>Card title</Title>
      <Paragraph>Card content</Paragraph>
    </Card.Content>
    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
    <Card.Actions>
      <Button>Cancel</Button>
      <Button>Ok</Button>
    </Card.Actions>
  </Card> */}
    </View>;
};
