import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions} from "react-native";
import { useAppContext } from "../AppContext";

const h = Dimensions.get("window").height;
const w = Dimensions.get("window").width;

const PaymentHistoryScreen=({ route })=>{
    const {user}=useAppContext();
    const [data,setdata]=useState([]);
    
    useEffect(()=>{
        fetch('http://192.168.29.186:8080/all_payments', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
        body: JSON.stringify({pgid:route.params.pgid,roomno:route.params.roomno,username:route.params.username})})
        .then(response => response.json()).then((data)=>{setdata(data["payments"])}) 
        .catch(error => console.error('Error:', error));
    },[])


    return ( 
        <View style={styles.container}>
          <Text style={styles.title}>Payments History</Text>
          <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom: h*0.05}}>
            {data.map((item, index) => (
                <View style={{marginBottom:w*0.01,height:h*0.175,borderBottomWidth:h*0.001,borderColor:'black',backgroundColor:item.status===2?"lightgreen":"rgba(200,0,0,0.2)"}} key={index}>
                  <Text style={styles.txt}>Name in upi:-{item.name_in_upi}</Text>
                  <Text style={styles.txt}>UPI methord:-{item.method}</Text>
                  <Text style={styles.txt}>Amount Paid:-{item.Amount_paid}</Text>
                  <Text style={styles.txt}>Fee+penality:-{item.actual_amount}</Text>
                  <Text style={styles.txt}>payment date:-{item.payment_date}</Text>
                  <Text style={styles.txt}>accepted by owner:-{item.status===2?"True":"False"}</Text>
                </View>
            ))}
          </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      padding: h * 0.02,
      height:h*0.75,
    },
    title: {
      fontSize: h * 0.04,
      fontWeight: 'bold',
      marginBottom: h * 0.02,
      paddingTop:h*0.05,
      color:"black"
    },
    txt:{
      fontSize:h*0.02,
      color:"black"
    }
})

export default PaymentHistoryScreen;