import { StyleSheet, Text, View,ScrollView,Dimensions } from 'react-native'
import React from 'react'
import { useEffect } from 'react';
const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const GrpmembersScreen = ({route}) => {

    useEffect(() => {
        console.log(route.params.pgmembers)
      }, []);

  return (
    <View style={{flex:1}}>

    <View style={{backgroundColor:"black",flex:0.2,alignItems:"center",justifyContent:"center"}}>
    <Text style={{color:"white"}}>Group Members</Text>
    </View>
    <ScrollView style={{flex:0.8,marginHorizontal:w*0.02}} contentContainerStyle={{paddingBottom: h*0.03}}>
    {route.params.pgmembers.map((item,index)=>(
        <View style={{borderBottomWidth:h*0.001,borderColor:"black",height:h*0.05,justifyContent:"center"}} key={index}>
            <Text style={{fontSize:h*0.02,color:"black"}}>{item.split('_')[0]}</Text>
        </View>
    )
    )}
    </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({})

export default GrpmembersScreen

