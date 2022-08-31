import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native';
import { styles } from "../../style/style";
import IconFA from 'react-native-vector-icons/FontAwesome';

import { Modal, Portal, TextInput, Button, Provider } from 'react-native-paper';
import db from "../../db/db_connection"

export const CheckList = ({ navigation, route }) => {
  useEffect(() => {
    async function getdata() {
      let results = await db.select("SELECT * FROM TRIP WHERE ID=" + route.params.id, [])
      let data = results.rows.item(0);
    }
    if (route.params?.id) {
      getdata();
    }

  }, [route.params?.post])

  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20 };

  return <View style={[styles.container]}>

    <Portal>
      <Modal style={{ padding: 20 }} visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
        <TextInput label="Event" value={value} onChangeText={event => setValue(event)} />

        <View style={{ alignSelf: 'flex-end', justifyContent: "space-between", flexDirection: 'row', marginTop: 10 }}>
            <Button mode="contained" onPress={hideModal}>
              <IconFA name='remove' size={20} color='white' />
            </Button>
            <Button mode="contained" onPress={() => { }}>
              <IconFA name='save' size={20} color='white' />
            </Button>
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

  </View>;
};
