import { Text,View,StyleSheet,TouchableOpacity,ScrollView,Dimensions,ImageBackground,Platform, StatusBar,SafeAreaView} from "react-native";
import React, { useState,useEffect } from 'react';
import { useAppContext } from "../AppContext";
import LottieView from 'lottie-react-native';

const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const GuestroomScreen=({ route, navigation })=>{
    const guser=route.params.ginfo;
    const {user}=useAppContext();
    const [pstatus,setpstatus]=useState(-2);   /*-2=initiate -1=notfound 0=rejected 1=waiting 2=confirmed*/
    const [final_penality,setfinal_penality]=useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
            const req_data1={pgid:route.params.pgid,guest:[guser[2],guser[3],guser[4],guser[5]],roomno:route.params.roomno,payer:JSON.parse(user).username}
            setIsLoading(true);
            fetch('http://192.168.29.186:8080/payment_guest', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
            body: JSON.stringify(req_data1)})
            .then(response => response.json())
            .then((data) =>{setpstatus(data['pstatus']);
                            setfinal_penality(data['added_penality']);
                          })
            .catch(error => console.error('Error:', error))
            .finally(() => setIsLoading(false));
    },[]);

  const change_pstatus=()=>{
    setpstatus(1);
  }

  const convert_ist=(utc)=>{
    var utcDate = new Date(utc);
    var utcTime = utcDate.getTime();
    var istOffsetMinutes = 330;
    var istTime = utcTime + istOffsetMinutes * 60 * 1000;
    var istDate = new Date(istTime);
    return istDate.toISOString()
  }

  const display=()=>{
    if(pstatus===0){
      return (
        <View style={{alignItems:"center",justifyContent:"center"}}>
        <Text style={{fontSize:h*0.02,color:'red'}}>Your Request is rejected</Text>
        <TouchableOpacity style={[styles.payment,{height:h*0.06}]} onPress={()=>navigation.navigate('Guest payconf',
        {pgid:route.params.pgid,roomno:route.params.roomno,Fee:guser[4]+final_penality,fun_pstatus:change_pstatus})}>
        <Text style={{marginTop:h*0.01,fontSize:h*0.02,color:"black"}}>Confirm with owner again?</Text>
        </TouchableOpacity>
        </View>)
    }
    else if(pstatus===-1){
      return (
        <TouchableOpacity style={styles.payment} onPress={()=>navigation.navigate('Guest payconf',
        {pgid:route.params.pgid,roomno:route.params.roomno,Fee:guser[4]+final_penality,fun_pstatus:change_pstatus})}>
        <View style={{alignItems:"center",justifyContent:"center"}}>
        <Text style={{fontSize:h*0.02,color:"black"}}>Payment Done?</Text>
        <Text style={{fontSize:h*0.02,color:"black"}}>Confirm with owner</Text>
        </View>
        </TouchableOpacity>)
    }
    else if(pstatus===1){
      return (
        <View style={{alignItems:'center'}}>
        <Text style={{fontSize:h*0.02,color:'blue'}}>Waiting for owner</Text>
        <Text style={{fontSize:h*0.02,color:'blue'}}>to confirm your request!</Text>
        </View>)
    }
    else if(pstatus===2){
      return(
        <View style={{alignItems:'center'}}>
        <Text style={{fontSize:h*0.02,color:'green'}}>Payment Done for this month</Text>
        <Text style={{fontSize:h*0.02,color:'green'}}>updates after this plan expires</Text>
        </View>
        )
    }

  }

    return (
      <SafeAreaView style={{flex: 1,backgroundColor:"#ffffff",paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
        <View style={styles.imgcontainer}>
          <ImageBackground source={require('../../assets/Images/Black/Guest_info.png')} style={styles.img} resizeMode='contain'>
          </ImageBackground>
        </View>
        <ScrollView style={styles.scroll1} contentContainerStyle={{paddingBottom: h*0.03}}>
            <Text style={{fontSize:h*0.05,textAlign:"center",marginVertical:h*0.04,color:"black"}}>My Room Info</Text>

            <Text style={styles.left}>Start Date:</Text>
            <Text style={styles.right}>{convert_ist(guser[2]).slice(0,10)}</Text>

            <Text style={styles.left}>Time:</Text>
            <Text style={styles.right}>{convert_ist(guser[2]).slice(11,16)} IST</Text>           

            <Text style={styles.left}>Days stay:</Text>
            <Text style={styles.right}>{guser[3]}days</Text>

            <Text style={styles.left}>Fee:</Text>
            <Text style={styles.right}>{guser[4]}Rs</Text>

            <Text style={styles.left}>Penality_per_hour_delay:</Text>
            <Text style={styles.right}>{guser[5]}Rs</Text>

            <Text style={styles.left}>Penality Till Now:</Text>
            <Text style={styles.right}>{final_penality}Rs</Text>

            <View style={{height:h*0.1}}>
              {display()}
            </View>
            <TouchableOpacity style={styles.del} onPress={() => navigation.navigate('Payment History',{pgid:route.params.pgid,roomno:route.params.roomno,username:JSON.parse(user).username})}><Text style={[styles.txt,{color:"white",top:0}]}>Check History</Text></TouchableOpacity>
        {isLoading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}} />
          </View>
        )}
        </ScrollView>
        </SafeAreaView>
    );
}

const styles=StyleSheet.create({
  imgcontainer:{
    flex:0.2,
    alignItems:"center"
  },
  img:{
    width:w*0.8,
    height:h*0.2
  },
    left:{
      fontSize:h*0.023,
      fontWeight:"600",
      color:"black"
    },
    right:{
      fontSize:h*0.023,
      textAlign:'right',
      top:-h*0.025,
      fontWeight:"600",
      color:"black"
    },
    scroll1:{
        flex:0.8,
        paddingHorizontal:w*0.025,
    },
    txt:{
      fontSize:h*0.025,
      top:h*0.015,
      color:"black"
    },
    payment:{
      backgroundColor:'skyblue',
      height:h*0.075,
      marginHorizontal:w*0.15,
      borderRadius:h*0.01,
      alignItems:'center',
      justifyContent:"center"
    },
    del:{
      width:w*0.3,
      backgroundColor:'black',
      height:h*0.08,
      alignItems:'center',
      justifyContent:"center",
      borderRadius:h*0.02
    },
  });

export default GuestroomScreen;