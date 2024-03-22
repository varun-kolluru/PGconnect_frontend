import React, { useEffect, useState } from 'react';
import { View,Dimensions,Text, TextInput, TouchableOpacity,StyleSheet,TouchableWithoutFeedback,Keyboard } from 'react-native';
import { useAppContext } from '../AppContext';
import LottieView from 'lottie-react-native';

const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const GuestpayconfScreen=({ route, navigation })=>{
    const [pmode, setpmode] = useState('');
    const [name,setname]= useState('');
    const [paid,setpaid]=useState('');
    const [pdate,setpdate]=useState('');
    const {user}=useAppContext();
    const [isLoading,setIsLoading]=useState(false);

    const handleFormSubmit=()=>{
      let tmp=JSON.parse(user);
      req_data={pgid:route.params.pgid,roomno:route.params.roomno,payer:tmp.username,name_in_upi:name,
                method:pmode,Amount_paid:Number(paid),actual_amount:route.params.Fee,payment_date:pdate,status:1}

      console.log('clicked')
      setIsLoading(true);
      fetch('http://192.168.29.186:8080/paymentadd', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+tmp.token},
      body: JSON.stringify(req_data)})
      .then(response => response.json()).then((data)=>{console.log(data)
        if (data.hasOwnProperty("success")){
          route.params.fun_pstatus();
          navigation.goBack();
        }
        else{
          alert(Object.values(data));
        }
      }
      ).catch(error => console.error('Error:', error))
      .finally(() => setIsLoading(false));
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
  
        <View style={styles.container}>

        <TextInput style={styles.Ip} onChangeText={setpmode} placeholder="Payment mode (Gpay/phonepay/Paytm etc)"/>
        <TextInput style={styles.Ip} onChangeText={setname} placeholder="Your Name in UPI app"/>
        <Text style={styles.Ip}>Total Fee+penaliy: {route.params.Fee}</Text>
        <TextInput style={styles.Ip} onChangeText={setpaid} placeholder="Amount Paid" keyboardType='numeric'/>
        <TextInput style={styles.Ip} onChangeText={setpdate} placeholder="Payment date:  dd/mm/yyyy"/>
  
        <View style={{top:h*0.02, alignItems:'center'}}><Text style={{color:"black"}}>All the above information is for owner reference only</Text></View>
        <TouchableOpacity style={styles.btn} onPress={handleFormSubmit}><Text style={styles.btntxt}>Confirm with owner</Text></TouchableOpacity>
        {isLoading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
          <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}} />
        </View>
      )}
        </View>
        </View>
        </TouchableWithoutFeedback> 
    );
}

const styles=StyleSheet.create({
    container:{ 
        top:h*0.1,
        height:h*0.6,
        marginHorizontal:w*0.02,
        backgroundColor:'rgba(0,0,0,0.1)'
      },
      Ip: {
        height:h*0.045,
        fontSize:h*0.02,
        marginVertical:h*0.02,
        marginHorizontal:w*0.02,
        backgroundColor:"white",
        justifyContent:"center",
        color:"black"
      },
      btn: {
          height:h*0.05,
          marginHorizontal:w*0.175,
          marginTop:h*0.05,
          alignItems:"center",
          borderRadius:h*0.02,
          backgroundColor:"black",
          alignItems:"center",
          justifyContent:"center"
        },
      btntxt:{
          fontSize:h*0.03,
          color:"white" 
      }
    });

export default GuestpayconfScreen;