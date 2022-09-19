import React from 'react'
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

export function CustomNavigationBar({ options, navigation, back, title }) {

    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const route = useRoute();
    const allowedPages = ["Plans","Home"];
    const { colors } = useTheme();
    const checkRoute = allowedPages.some(ele => ele == route.name)
    const PlansMenu = <>

        {route.name=="Home" && <View>
            <Menu.Item onPress={() => { navigation.navigate('Documents') ,closeMenu()}} title="Documents" />
        </View>}

        {route.name=="Plans" && <View>
            {/* <Menu.Item onPress={() => { navigation.navigate('AddTrip', { id: route.params.id }) ,closeMenu()}} title="Edit Trip" /> */}
            <Menu.Item onPress={() => { navigation.navigate('CheckList', { id: route.params.id }) ,closeMenu()}}  title="Check List" />
        </View>}

    </>

    return (
        <Appbar.Header style={{backgroundColor:colors.background}}>
            {back ? <Appbar.BackAction  onPress={navigation.goBack} /> : null}

            <Appbar.Content titleStyle={{color:colors.text}}  title={options.title} />
            {checkRoute ? (
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <Appbar.Action icon="bars" color="gray" onPress={openMenu} />
                    }>
                    {PlansMenu}
                </Menu>
            ) : null}
        </Appbar.Header>
    );
}