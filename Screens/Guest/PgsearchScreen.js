import React, { useState } from 'react';
import { View, Text, TouchableOpacity,Keyboard, StyleSheet,Dimensions, ScrollView,ImageBackground,TextInput,TouchableWithoutFeedback,Platform, StatusBar,SafeAreaView } from 'react-native';
import { useAppContext } from '../AppContext';
import LottieView from 'lottie-react-native';
import GetLocation from 'react-native-get-location'

const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const PgsearchScreen = ({route,navigation}) => {
    const [pgs,setpgs]=useState([]);
    const {user} = useAppContext();
    const [city,setcity]=useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);



    const search=()=>{
      if(city){
        setIsLoading(true);
        fetch('http://192.168.29.186:8080/pgsearch', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
        body: JSON.stringify({city:city.toLowerCase()})})
        .then(response => response.json()).then((data) =>{
          if(data.hasOwnProperty("success")){
            if(data["success"].length===0){
              alert("no Pgs in "+city+" enrolled in PGconnect")
            }
            setpgs(data["success"])                   /*data=[[id,pgname,lat,long,address,username_id],]*/
          }
        }).catch(error => console.error('Error:', error)).finally(() => setIsLoading(false));
      }
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; 
      const radLat1 = (Math.PI / 180) * lat1;
      const radLon1 = (Math.PI / 180) * lon1;
      const radLat2 = (Math.PI / 180) * lat2;
      const radLon2 = (Math.PI / 180) * lon2;
      const dLat = radLat2 - radLat1;
      const dLon = radLon2 - radLon1;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    }

    const sort_dists=(x1,x2,data)=>{
      for(let i=0;i<data.length;i++){
        let dis=calculateDistance(x1,x2,data[i][2],data[i][3])
        data[i].push(dis)
      }
      data.sort((a,b)=>a[6]-b[6])
      setpgs(data);

    }

    const get_loc=()=>{
      setIsLoading1(true);
      GetLocation.getCurrentPosition({enableHighAccuracy: true,timeout: 60000})
      .then(location => {
        setIsLoading1(true);
        console.log(location);
        console.log(location.latitude,location.longitude);
        sort_dists(location.latitude,location.longitude,pgs);
        setIsLoading1(false);
      })
      .catch(error => {alert("give location access");})
      .finally(() => setIsLoading1(false));
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{flex: 1,backgroundColor:"#ffffff",paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}> 
          <View style={styles.imgcontainer}>
            <ImageBackground source={require('../../assets/Images/Black/Location.png')} style={styles.img} resizeMode='contain'>
            </ImageBackground>
          </View>

          <View style={{flex:0.8}}>
          <Text style={{fontSize:h*0.04,fontWeight:"700",padding:h*0.02,color:"black"}}>Search for PGs</Text>

          <View style={{flexDirection:"row"}}>
            <TextInput onChangeText={setcity} style={styles.inputbox} placeholder='Enter City Name'/>
            <TouchableOpacity onPress={search} style={[styles.btn,{flex:0.3,marginHorizontal:w*0.1,height:h*0.05}]}><Text style={styles.btntxt}>Search</Text></TouchableOpacity>
          </View>
          {pgs.length>0 &&
          <ScrollView style={styles.scrollview}>
            <TouchableOpacity onPress={get_loc} style={[styles.btn,{width:w*0.5,height:w*0.125,marginBottom:h*0.02}]}><Text style={styles.btntxt}>Sort by distance</Text></TouchableOpacity>
            {pgs.map((item,key)=>(
                <View style={styles.pgcard}>
                  <View style={{flex:0.7,justifyContent:"center",paddingLeft:h*0.01}}>
                    <Text style={{fontSize:h*0.03,fontWeight:"500",color:"black"}}>{item[1]} (id:{item[0]})</Text>
                    {item.length===7 &&
                    <Text style={{fontSize:h*0.015,fontWeight:"500",color:"black"}}>(distance:{item[6].toFixed(2)})</Text>
                    }
                  </View>
                  <View style={{flex:0.3,justifyContent:"center",alignItems:"flex-start"}}>
                    <TouchableOpacity onPress={() => navigation.navigate('PG Info',{data:item})} style={[styles.btn,{width:w*0.2,height:w*0.125}]}><Text style={styles.btntxt}>Info</Text></TouchableOpacity>
                  </View>
                </View>
              )
          )}
          </ScrollView>
          }
          {isLoading && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}} />
              </View>
              )}
            
            {isLoading1 && (
              <View style={{ flex:0.5, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,backgroundColor:"rgba(255,255,255,0.8)" }}>
                <LottieView source={require('../../assets/Animations/location_Animation.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}} />
              </View>
            )}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      
    );
}

const styles = StyleSheet.create({
  imgcontainer:{
    flex:0.2,
    alignItems:"center"
  },
  img:{
    width:w*0.8,
    height:h*0.2
  },
  scrollview:{
    padding:h*0.02
  },
  btn:{
    backgroundColor:"black",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:h*0.01 
  },
  btntxt:{
    color:"white",
    fontSize:h*0.02,
    fontWeight:"400"
  },
  pgcard:{
    flexDirection:"row",
    height:h*0.1,
    marginBottom:h*0.025,
    backgroundColor:"rgba(202, 200, 200, 0.34)",
    borderRadius:h*0.015
  },
  inputbox:{
    flex:0.7,
    marginLeft:w*0.03,
    alignSelf:"center",
    borderRadius:h*0.01,
    borderWidth:w*0.005,
    borderColor:"black",
    height:h*0.05,
    fontSize:h*0.02,
    padding:h*0.01,
    color:"black"
  }
  });

export default PgsearchScreen;