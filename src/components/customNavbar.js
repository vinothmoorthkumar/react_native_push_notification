import React from 'react'
import { Appbar, Menu } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { View } from 'react-native';

export function CustomNavigationBar({ options, navigation, back, title }) {

    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const route = useRoute();
    const allowedPages = ["Plans"];
    const checkRoute = allowedPages.some(ele => ele == route.name)
    const PlansMenu = <>
        {route.name=="Plans" && <View>
            <Menu.Item onPress={() => { navigation.navigate('AddTrip', { id: route.params.id }) ,closeMenu()}} title="Edit Trip" />
            <Menu.Item onPress={() => { console.log('Option 2 was pressed') }} title="Option 2" />
        </View>}

    </>

    return (
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}

            <Appbar.Content title={options.title} />
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