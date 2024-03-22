import React, { useState } from 'react';
import { View,Dimensions,Text, TextInput,ImageBackground, TouchableOpacity,StyleSheet,TouchableWithoutFeedback,Keyboard,Platform, StatusBar,SafeAreaView } from 'react-native';
import { useAppContext } from '../AppContext';
import LottieView from 'lottie-react-native';
const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const GuestaddScreen = ({ route, navigation }) => {
  const [guestun,setguestun]=useState('');
  const [days,setdays]=useState(0);
  const [fee,setfee]=useState(0);
  const [penality,setpenality]=useState(0);
  const {user}=useAppContext();
  const token=JSON.parse(user).token;
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = () => {
    
    const req_data={pgid:route.params.pgid,roomno:route.params.roomno,username:guestun,fee:Number(fee),penality:Number(penality),days_stay:Number(days)}
    console.log(typeof(fee),fee)
    setIsLoading(true);
    fetch('http://192.168.29.186:8080/addguest', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+token},
    body: JSON.stringify(req_data)}).then(response => response.json())
    .then((data) =>{ if (data.hasOwnProperty("guest")){
                          route.params.addguest(data["guest"]);
                          navigation.goBack();
                        }
                     else{alert(Object.values(data))}
    })
    .catch(error => console.error('Error:', error))
    .finally(() => setIsLoading(false));

    fetch('http://192.168.29.186:8080/Add_Grpmsg', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+token},
    body: JSON.stringify({pgid:route.params.pgid,new_member:guestun,owner:JSON.parse(user).username})}).then(response => response.json())
    .then((data) =>{console.log(data["msg"])}
    )
    .catch(error => console.error('Error:', error))

  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{flex: 1,backgroundColor:"#ffffff",paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
        <View style={styles.imgcontainer}>
            <ImageBackground source={require('../../assets/Images/Guest_add.png')} style={styles.img} resizeMode='contain'>
            </ImageBackground>
        </View>
      <View style={{flex:0.75}}>
      <View style={styles.container}>
      
      <TextInput style={styles.Ip} onChangeText={setguestun} placeholder="Guest Username"/>
      <TextInput style={styles.Ip} onChangeText={setdays} placeholder="Days of stay" keyboardType='numeric'/>
      <TextInput style={styles.Ip} onChangeText={setfee} placeholder="Fee" keyboardType='numeric'/>
      <TextInput style={styles.Ip} onChangeText={setpenality} placeholder="Penality per hour delay" keyboardType='numeric'/>

      {isLoading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}} />
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleFormSubmit}><Text style={styles.btntxt}>Add Guest</Text></TouchableOpacity>
      </View>
      </SafeAreaView>
      </TouchableWithoutFeedback>  
  );
};

const styles=StyleSheet.create({
  imgcontainer:{
    flex:0.25,
    alignItems:"center"
  },
  img:{
    width:w*0.8,
    height:h*0.25
  },
  container:{ 
    height:h*0.4,
    marginHorizontal:w*0.02,
    backgroundColor:'rgba(0,0,0,0.1)'
  },
  Ip: {
    height:h*0.045,
    fontSize:h*0.02,
    marginVertical:h*0.02,
    marginHorizontal:w*0.02,
    backgroundColor:"white",
    paddingVertical:0,
  },
  btn: {
      height:h*0.05,
      marginHorizontal:w*0.25,
      marginTop:h*0.05,
      alignItems:"center",
      justifyContent:"center",
      borderRadius:h*0.01,
      backgroundColor:"black"
    },
  btntxt:{
      fontSize:h*0.03,
      color:"white" 
  }
});

export default GuestaddScreen;