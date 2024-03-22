import React from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { useAppContext } from "../AppContext";
import Icon from 'react-native-vector-icons/FontAwesome';

const h = Dimensions.get("window").height;
const w = Dimensions.get("window").width;

const NotificationScreen = ({ route }) => {
  const {user,reqs,setreqs,remove_req}=useAppContext()

  const confirmation=(idx,accept)=>{
    let tmp=JSON.parse(user)
    console.log("pressed",idx,accept)
    if(accept===1){
      fetch('http://192.168.29.186:8080/payment_statuschange', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+tmp.token},
      body: JSON.stringify({pgid:route.params.pgid,roomno:reqs[idx][0],payer:reqs[idx][1],status:2})})
      .then(response => response.json()).then((data)=>{console.log(data)})
      .catch(error => console.error('Error:', error));
    }
    if(accept===0){
      fetch('http://192.168.29.186:8080/payment_statuschange', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+tmp.token},
      body: JSON.stringify({pgid:route.params.pgid,roomno:reqs[idx][0],payer:reqs[idx][1],status:0})})
      .then(response => response.json()).then((data)=>{console.log(data)})
      .catch(error => console.error('Error:', error));
    }
    remove_req(idx);
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
      <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom: h*0.05}}>
        {reqs.map((item, index) => (
          <View key={index} style={styles.notificationContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.txt}>Room no:-{item[0]}</Text>
              <Text style={styles.txt}>username:-{item[1]}</Text>
              <Text style={styles.txt}>Name in upi:-{item[2]}</Text>
              <Text style={styles.txt}>UPI methord:-{item[3]}</Text>
              <Text style={styles.txt}>Amount Paid:-{item[4]}</Text>
              <Text style={styles.txt}>Fee+penality:-{item[5]}</Text>
              <Text style={styles.txt}>payment date:-{item[6]}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={[styles.button,{backgroundColor:"green"}]} onPress={() => confirmation(index, 1)}>
                <Icon name="check" size={h * 0.02} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button,{backgroundColor:"red"}]} onPress={() => confirmation(index, 0)}>
                <Icon name="close" size={h * 0.02} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: h * 0.02,
    height:h*0.8
  },
  title: {
    fontSize: h * 0.04,
    fontWeight: 'bold',
    marginBottom: h * 0.02,
    paddingTop:h*0.05,
    color:"black"
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: h * 0.02,
    marginBottom: h * 0.01,
    borderRadius: h * 0.01,
    backgroundColor: 'lightgrey',
  },
  leftContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: h * 0.02,
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flex:0.4
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: h * 0.015,
    margin:h*0.005,
    borderRadius: h * 0.005,
  },
  txt:{fontSize:h*0.02,color:"black"}
});

export default NotificationScreen;
