import { Text,View,StyleSheet,TouchableOpacity,ScrollView,Dimensions,ImageBackground,Platform, StatusBar,SafeAreaView } from "react-native";
import React, { useState,useEffect } from 'react';
import { useAppContext } from "../AppContext";
import LottieView from 'lottie-react-native';

const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const GuestinfoScreen=({ route, navigation })=>{

    const [guser,setguser]=useState(route.params.data);
    const {user}=useAppContext();
    const [pstatus,setpstatus]=useState(-2);   /*-2=initiate -1=notfound 0=rejected 1=waiting 2=confirmed*/
    const [final_penality,setfinal_penality]=useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [phn,setphn]=useState(null);

    useEffect(()=>{
      const req_data1={pgid:route.params.pgid,guest:[guser[2],guser[3],guser[4],guser[5]],roomno:route.params.roomno,payer:route.params.data[1]}

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

    const handle_del=()=>{
      const req_data={pgid:route.params.pgid,roomno:route.params.roomno,username:route.params.data[1]}
      setIsLoading(true)

      fetch('http://192.168.29.186:8080/delguest', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
      body: JSON.stringify(req_data)}).then(response => response.json())
      .then((data) =>{ if (data.hasOwnProperty("success")){
                            route.params.delguest(route.params.data[1]);
                            console.log("guest deleted")
                            navigation.goBack();
                          }
                       else{alert(Object.values(data))}
      })
      .catch(error => console.error('Error:', error))
      .finally(() => setIsLoading(false));
    }

    const get_phn=()=>{
      setIsLoading(true)
      fetch('http://192.168.29.186:8080/guest_phn', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
      body: JSON.stringify({username:route.params.data[1]})}).then(response => response.json())
      .then((data) =>{ if (data.hasOwnProperty("success")){
                            setphn(data["success"])
                          }
                       else{alert(Object.values(data))}
      })
      .catch(error => console.error('Error:', error))
      .finally(() => setIsLoading(false));
    }

    const convert_ist=(utc)=>{
      var utcDate = new Date(utc);
      var utcTime = utcDate.getTime();
      var istOffsetMinutes = 330;
      var istTime = utcTime + istOffsetMinutes * 60 * 1000;
      var istDate = new Date(istTime);
      return istDate.toISOString()
    }

    const pay_msg=()=>{
      if(pstatus===2){
        return "Paid"
      }
      return "Not Paid"

    }

    return (
      <SafeAreaView style={{flex: 1,backgroundColor:"#ffffff",paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
        <View style={styles.imgcontainer}>
          <ImageBackground source={require('../../assets/Images/Black/Guest_info.png')} style={styles.img} resizeMode='contain'>
          </ImageBackground>
        </View>
        <ScrollView style={styles.scroll1} contentContainerStyle={{paddingBottom: h*0.05}}>
            <Text style={{fontSize:h*0.05,textAlign:"center",marginVertical:h*0.02,color:"black"}}>Guest Info</Text>
            <Text style={styles.left}>User Name:</Text>
            <Text style={styles.right}>{route.params.data[1]}</Text>

            <Text style={styles.left}>Start Date:</Text>
            <Text style={styles.right}>{convert_ist(guser[2]).slice(0,10)}</Text>

            <Text style={styles.left}>Start Time:</Text>
            <Text style={styles.right}>{convert_ist(guser[2]).slice(11,16)} IST</Text>           

            <Text style={styles.left}>Days stay:</Text>
            <Text style={styles.right}>{guser[3]}days</Text>

            <Text style={styles.left}>Fee:</Text>
            <Text style={styles.right}>{guser[4]}Rs</Text>

            <Text style={styles.left}>Penality_per_hour_delay:</Text>
            <Text style={styles.right}>{guser[5]}Rs</Text>

            <Text style={styles.left}>Penality Till Now:</Text>
            <Text style={styles.right}>{final_penality}Rs</Text>

            {!phn?
            (<TouchableOpacity onPress={get_phn} style={{width:w*0.5,height:h*0.05,backgroundColor:"black",justifyContent:"center",alignItems:"center",borderRadius:h*0.01}}>
              <Text style={{color:"white"}}>Get User Phone Number?</Text>
            </TouchableOpacity>): 
            (<>         
            <Text style={styles.left}>Phone</Text>
            <Text style={styles.right}>{phn}</Text> 
            </> )
            }

            <Text style={styles.pstatus}>Payment Status:{pay_msg()}</Text>

            <View style={{flexDirection:"row"}}>
            <TouchableOpacity style={[styles.del,{backgroundColor:"black"}]} onPress={() => navigation.navigate('Payment History',{pgid:route.params.pgid,roomno:route.params.roomno,username:route.params.data[1]})}><Text style={[styles.txt,{color:"white"}]}>Check History</Text></TouchableOpacity>
            <Text style={{flex:0.5}}/>
            <TouchableOpacity style={styles.del} onPress={handle_del}><Text style={styles.txt}>Delete Guest</Text></TouchableOpacity>
            </View>

        </ScrollView>
        {isLoading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}} />
          </View>
        )}
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
    color:"black"
  },
  right:{
    fontSize:h*0.023,
    textAlign:'right',
    top:-h*0.025,
    color:"black"
  },
  scroll1:{
      padding:w*0.01,
      flex:0.8
  },
  del:{
    flex:1,
    backgroundColor:'tomato',
    height:h*0.06,
    alignItems:'center',
    borderRadius:h*0.02
  },
  txt:{
    fontSize:h*0.025,
    top:h*0.015,
    color:"black"
  },
  pstatus:{
    fontSize:h*0.03,
    alignSelf:"center",
    marginVertical:h*0.03,
    color:"black"
  }
  });

export default GuestinfoScreen;