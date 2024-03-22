import React, { useEffect, useState } from 'react';
import { View,Dimensions,Text, TextInput,StyleSheet,TouchableWithoutFeedback,Keyboard,TouchableOpacity } from 'react-native';
import { useAppContext } from '../AppContext';
import LottieView from 'lottie-react-native';
import GetLocation from 'react-native-get-location'

const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const CreatepgScreen = ({ route, navigation }) => {
  const {user}=useAppContext();
  const [pgname, setpgname] = useState('');
  const [floors,setfloors]=useState(0);
  const [flats,setflats]=useState(0);
  const username=JSON.parse(user).username;
  const token=JSON.parse(user).token;

  const [city,setcity]=useState(null);
  const [address,setaddress]=useState(null);
  const [lat,setlat]=useState(null);
  const [long,setlong]=useState(null);
  const [loc,setloc]=useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const get_address=(lat,long)=>{
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`)
      .then(response => response.json())
      .then(data => {
        let city =data.address.city ||data.address.town ||data.address.village
        const tmp_address=data.display_name.length>100?data.display_name.substring(0, 100):data.display_name
        console.log(city,tmp_address);
        setcity(city.toLowerCase());
        setaddress(tmp_address);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const get_loc=()=>{
    GetLocation.getCurrentPosition({enableHighAccuracy: true,timeout: 60000})
    .then(location => {
      setIsLoading(true);
      setlat(location.latitude);
      setlong(location.longitude);
      setloc(location.latitude+','+location.longitude);
      get_address(location.latitude,location.longitude)
      setIsLoading(false);
    })
    .catch(error => {alert("give location access");})
  };


  const handleFormSubmit = () => {
    setIsLoading(true);
    fetch('http://192.168.29.186:8080/Pg_add', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+token},
    body: JSON.stringify({pgname:pgname,username:username,floors:Number(floors),flats:Number(flats),location:loc,city:city,address:address})})
    .then(response => response.json())
    .then((data) => {
                     if (data.hasOwnProperty("id")){
                      route.params.AddData([data.id,pgname,Number(floors),Number(flats),city]);
                      navigation.goBack();
                     }
                     else{alert(Object.values(data))}
                    })
    .catch(error => console.error('Error:', Object.values(error)))
    .finally(() => setIsLoading(false));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View>
      <View style={styles.container}>
      <Text style={{alignSelf:"center", fontSize:h*0.05,marginBottom:h*0.03,color:"black"}}>PG Details</Text>
      <TextInput style={styles.Ip} onChangeText={setpgname} placeholder="Enter PG Name"/>
      <TextInput style={styles.Ip} onChangeText={setfloors} placeholder="No:of floors" keyboardType='numeric'/>
      <TextInput style={styles.Ip} onChangeText={setflats} placeholder="No:of rooms per floor" keyboardType='numeric'/>

      <View style={styles.location_box}>
        <TouchableOpacity style={styles.location_btn} onPress={get_loc}><Text style={{fontWeight:"400",fontSize:h*0.02,color:"white"}}>Get Current Location</Text></TouchableOpacity>
        <TextInput style={styles.location_info} value={address?address:''} placeholder="This is required to locate your PG"  multiline={true} editable={true}/>
      </View>

      {isLoading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
          <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}} />
        </View>
      )}

      <TouchableOpacity style={styles.btn} onPress={handleFormSubmit}><Text style={styles.btntxt}>Create PG</Text></TouchableOpacity>
      </View>
      </View>
      </TouchableWithoutFeedback>  
  );
};

const styles=StyleSheet.create({
  container:{ 
    top:h*0.2,
    height:h*0.6,
    marginHorizontal:w*0.02,
    backgroundColor:'rgba(0,0,0,0.1)'
  },
  Ip: {
    height:h*0.05,
    fontSize:h*0.02,
    marginVertical:h*0.02,
    marginHorizontal:w*0.02,
    paddingVertical:0,
    backgroundColor:"white",
    justifyContent:"center"
  },
  btn: {
      height:h*0.065,
      marginHorizontal:w*0.25,
      marginTop:h*0.075,
      alignItems:"center",
      justifyContent:"center",
      borderRadius:h*0.02,
      backgroundColor:"black"
    },
  btntxt:{
      fontSize:h*0.03, 
      color:"white"
  },
  location_box:{
    flexDirection:"row",
    height:h*0.1,
    marginHorizontal:w*0.01,
  },
  location_btn:{
    flex:0.3,
    backgroundColor:'black',
    marginHorizontal:w*0.025,
    marginVertical:h*0.01,
    borderRadius:h*0.015,
    alignItems:"center",
    justifyContent:"center",
  },
  location_info:{
    flex:0.7,
    backgroundColor:'white'
  },
});

export default CreatepgScreen;