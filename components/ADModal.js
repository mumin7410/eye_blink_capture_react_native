import React, { useState } from 'react';
import { Text, StyleSheet, Pressable,View,TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native';

export default function ADModal({modalVisible,Status}){
    const styles = StyleSheet.create({
       container:{
        padding:20,
        alignItems:'center',
        backgroundColor:'#FFF',
        justifyContent:'center',
        borderRadius:8
       },
       modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        paddingHorizontal:16
    },
    })
    const [state, setState] = useState(true)
    return(
        <>
            <Modal animationType="slide" transparent={true} visible={modalVisible} >
                <View style={styles.modal}>
                    <View style={styles.container}>
                        {/* icon */}
                        {Status === 'found' ? <Image 
                            source={require('../assets/success.gif')}
                            style={{ width:80,height:80}} 
                            resizeMode='cover' 
                        />
                        :
                        <Image 
                            source={require('../assets/fail.gif')}
                            style={{ width:80,height:80}} 
                            resizeMode='cover' 
                        />}
                        {/* text */}
                        <Text>{Status === 'found' ? 'Check-in Success' : 'Check-in Failed'}</Text>
                    </View>
                </View>
            </Modal>
        </>
    )
}