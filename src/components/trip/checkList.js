import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native';
import { styles } from "../../style/style";
import IconFA from 'react-native-vector-icons/FontAwesome';

import { Modal, Title, TextInput, Button, Text, Checkbox } from 'react-native-paper';
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

  const [item, setItem] = React.useState([]);
  const [checkedItem, setCheckedItem] = React.useState([]);

  async function saveTrip() {
    let dataArr = [destination, name, startDate.toString(), endDate.toString()];

    if (editable) {
      dataArr.push(route.params.id)
      await db.update('UPDATE TRIP SET destination = ? , name = ?, startDate = ?, endDate = ? WHERE id = ?', dataArr);
    } else {
      await db.insert("INSERT INTO TRIP (destination, name, startDate, endDate) VALUES (?,?,?,?)", dataArr)
    }
    navigation.navigate('Home')

  }

  function setData(data,ele){
    item[ele]["item"]=data;
    setItem([...item])
  }

  function setChecked(data,ele){
    if(data){
      item[ele]["checked"]=data;
      setCheckedItem([...checkedItem,item[ele]])
      item.splice(ele, 1)
      setItem([...item])
    }else{
      checkedItem[ele]["checked"]=data;
      setItem([...item,checkedItem[ele]])
      checkedItem.splice(ele, 1)
      setCheckedItem([...checkedItem])
    }
    console.log("checkedItem",checkedItem)
  }



  const addItem = () => {
    setItem([...item,{item:"",checked:false}])
  }

  const listItems = item.map((ele, key) =>
    <View key={key} style={{ flexDirection: 'row' }}>
      <Checkbox status={ele.checked ? 'checked' : 'unchecked'} onPress={() => { setChecked(!ele.checked,key)}} />
      <TextInput style={{ alignSelf: "stretch", width: 300, height: 40 }} value={ele.item} onChangeText={eleData => setData(eleData,key)} />
    </View>
  );

  const unlistItems = checkedItem.map((ele, key) =>
  <View key={key} style={{ flexDirection: 'row' }}>
    <Checkbox status={ele.checked ? 'checked' : 'unchecked'} onPress={() => { setChecked(!ele.checked,key)}} />
    <Text style={{fontSize:15, margin:10, textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>{ele.item}</Text>
  </View>
);

  return <View style={[styles.container]}>
        { listItems.length>0 &&   <Title>UnChecked List</Title>
}
    {listItems}
    { unlistItems.length>0 &&   <Title>Checked List</Title>
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
