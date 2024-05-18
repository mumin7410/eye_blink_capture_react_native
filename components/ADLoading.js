import React from 'react';
import { Text, StyleSheet, Pressable,View,TouchableOpacity, Image, ActivityIndicator } from 'react-native';

export default function ADLoading({
    fontsize=15
}){
    const styles = StyleSheet.create({
       container:{
        flex:1,
        alignSelf:'center',
        alignItems:"center",
        justifyContent:"center",
       },
       text:{
        fontSize:fontsize,
        color:'#292D32',
        fontFamily:'Kanit-Regular',
        marginTop:10
       }
    })
    return(
        <>
            <View style={styles.container}>
                {/* <Image 
                    source={require('../../assets/commonPages/truck_loading.gif')}
                    style={{ width:imgW,height:imgH}} 
                    resizeMode='cover' 
                /> */}
                <ActivityIndicator size="large"/>
                <Text style={styles.text}>Loading</Text>
            </View>
        </>
    )
}