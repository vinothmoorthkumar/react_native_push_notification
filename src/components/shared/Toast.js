import React, { forwardRef, useImperativeHandle } from 'react'
import { Snackbar, Text } from 'react-native-paper';
import { View } from 'react-native';




export default Toast = forwardRef((props, ref) => {
  const [visible, setVisible] = React.useState(false);
  useImperativeHandle(ref, () => ({
    alert() {
      setVisible(true);
    }
  }))

  function dismiss() {
    setVisible(false);
  }

  return (
    <View style={{ flex: 1, width:200 , justifyContent: "center", alignItems: "center", textAlign: "center", zIndex: 10 }}>
      <Snackbar
        duration={1000}
        visible={visible}
        onDismiss={dismiss}
        style={{ textAlign: "center"}}>
        <Text style={{ color: "white", textAlign: "center" }}> {props.text}</Text>
      </Snackbar>
    </View>
  )
})
