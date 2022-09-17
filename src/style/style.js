
import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    container: {
        alignCenter: 'center',
        padding: 20,
        flex: 1,
    },
    loader:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        backgroundColor: '#0000005e',
        justifyContent: 'center',
        zIndex:999
    }
 
});