import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native';
import { styles } from "../../style/style";
import IconFA from 'react-native-vector-icons/FontAwesome';

import { Modal, Title, TextInput, Button, Text, Checkbox } from 'react-native-paper';
import db from "../../db/db_connection"

export const CheckList = ({ navigation, route }) => {
  useEffect(() => {
    async function getdata() {
      const lists = [];
      let results = await db.select("SELECT * FROM CHECKLIST WHERE TripID=" + route.params.id, [])
      const count = results.rows.length;
      for (let i = 0; i < count; i++) {
        const row = results.rows.item(i);
        lists.push(row);
      }

      let checkedData=lists.filter(ele=>ele.checked)
      let uncheckedData=lists.filter(ele=>!ele.checked)
      setItem(uncheckedData);
      setCheckedItem(checkedData)
    }
    if (route.params?.id) {
      getdata();
    }

  }, [route.params?.post])

  const [item, setItem] = React.useState([]);
  const [checkedItem, setCheckedItem] = React.useState([]);

  async function saveTrip() {
    await db.delete("DELETE FROM CHECKLIST WHERE TripID=" + route.params.id);

    let concatArray=[...item,...checkedItem]
    concatArray.forEach(element => {
      let dataArr = [element.item, element.checked, route.params.id];
      db.insert("INSERT INTO CHECKLIST (item, checked, TripID) VALUES (?,?,?)", dataArr)
    });
  }

  function setData(data, ele) {
    item[ele]["item"] = data;
    setItem([...item])
  }

  function setChecked(data, ele) {
    if (data) {
      item[ele]["checked"] = data;
      setCheckedItem([...checkedItem, item[ele]])
      item.splice(ele, 1)
      setItem([...item])
    } else {
      checkedItem[ele]["checked"] = data;
      setItem([...item, checkedItem[ele]])
      checkedItem.splice(ele, 1)
      setCheckedItem([...checkedItem])
    }
  }



  const addItem = () => {
    setItem([...item, { item: "", checked: false }])
  }

  const listItems = item.map((ele, key) =>
    <View key={key} style={{ flexDirection: 'row' }}>
      <Checkbox status={ele.checked ? 'checked' : 'unchecked'} onPress={() => { setChecked(!ele.checked, key) }} />
      <TextInput style={{ alignSelf: "stretch", width: 300, height: 40 }} value={ele.item} onChangeText={eleData => setData(eleData, key)} />
    </View>
  );

  const unlistItems = checkedItem.map((ele, key) =>
    <View key={key} style={{ flexDirection: 'row' }}>
      <Checkbox status={ele.checked ? 'checked' : 'unchecked'} onPress={() => { setChecked(!ele.checked, key) }} />
      <Text style={{ fontSize: 15, margin: 10, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{ele.item}</Text>
    </View>
  );

  return <View style={[styles.container]}>
    {listItems.length > 0 && <Title>UnChecked List</Title>
    }
    {listItems}
    {unlistItems.length > 0 && <Title>Checked List</Title>
    }
    {unlistItems}
    {
      listItems.length > 0 && (<View style={{ alignSelf: 'flex-end', justifyContent: "space-between", flexDirection: 'row', marginTop: 10 }}>
        <View style={{ width: 100 }}>
          <Button mode="contained" onPress={() => saveTrip()}>
            <IconFA name='save' size={20} color='white' />
          </Button>
        </View>
      </View>)
    }
    {/* <Portal>
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
    </Portal> */}

    <View style={{ position: "absolute", bottom: 20, right: 20 }}>
      <TouchableOpacity onPress={addItem}>
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
