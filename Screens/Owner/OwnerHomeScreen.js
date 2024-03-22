import { useState,useEffect } from "react";
import { Text,View,StyleSheet,TouchableOpacity,ScrollView,Dimensions,ImageBackground,SafeAreaView,Platform, StatusBar, Alert} from "react-native";
import { useAppContext } from "../AppContext";
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const OwnerHomeScreen=({route,navigation})=>{
    const [pgid,pgname,floors,flats,city]=route.params.data;
    const [rooms,setrooms]=useState([]);        /*[ [{roomno:101,capacity:3,guests:[guests]}...], ]  */
    const {user}=useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
      setIsLoading(true);
          fetch('http://192.168.29.186:8080/cguests', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
          body: JSON.stringify({pgid:pgid})})
          .then(response => response.json()).then((data) =>{update_rooms(data)}).catch(error => console.error('Error:', error))
          .finally(() => setIsLoading(false));
	}, [])

  const update_rooms=(ndata)=>{         /* ndata= [ [[rno,cap],[rno,cap]], [[g1 info],[g2 info]] ]*/ 
      let result=[]
      for (let row = 1; row <= floors; row++) {
        let innerList = [];
        for (let column = 1; column <= flats; column++) {
          innerList.push({roomno:(row*100)+column,capacity:0,guests:[]});
        }
        result.push(innerList);
      }

      for (let i=0 ; i<ndata[0].length; i++){
        let r=Math.floor(ndata[0][i][0]/100)-1;
        let c=Math.floor(ndata[0][i][0]%100)-1;
        result[r][c]["capacity"]=ndata[0][i][1];
      }

      for (let i=0 ; i<ndata[1].length; i++){
        let r=Math.floor(ndata[1][i][0]/100)-1;
        let c=Math.floor(ndata[1][i][0]%100)-1;
        result[r][c]["guests"].push(ndata[1][i]);
      }
    setrooms(result);
}

const change_params=(troomno,tcap,tguest)=>{
  let trooms=[...rooms];
  let r=Math.floor(troomno/100)-1;
  let c=Math.floor(troomno%100)-1;
  trooms[r][c]={roomno:troomno,capacity:tcap,guests:tguest}
  setrooms(trooms)
}

const delete_pg=()=>{
  data={pgid:pgid,username:JSON.parse(user).username,city:city}
  console.log("confirm",data);
  setIsLoading(true);
  fetch('http://192.168.29.186:8080/pg_del', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
  body: JSON.stringify(data)})
  .then(response => response.json()).then((data) =>{
    console.log("pg deleted"); 
    route.params.DelData(pgid);
    navigation.goBack();
  }).catch(error => console.error('Error:', error))
  .finally(() => setIsLoading(false));
}

const Show_alert=()=>{
  Alert.alert("Permanently Delete PG?","once confirmed all the PG data will be deleted permanently",
              [{text:"Confirm",onPress:delete_pg},
               {text:"cancel", onPress:()=>console.log('Pressed cancel')}
              ]);
}

return (
  <SafeAreaView style={{flex: 1}}> 
    <View style={styles.header}>
      <ImageBackground source={require('../../assets/Images/Owner_home.png')} style={{height:h*0.3,width:w*1}}>
        <Icon  onPress={Show_alert} name="delete-forever" style={{alignSelf:"flex-end", fontSize: h * 0.05,color:"rgba(255,0,0,0.8)",marginTop:w*0.02,marginRight:w*0.02}} />
      </ImageBackground> 
    </View>

    <View style={{top:-h*0.075,backgroundColor:"#ffffff",borderRadius:h*0.06}}>
      <Text style={{marginTop:h*0.02,fontSize:h*0.04,fontWeight:"bold",color:"black",alignSelf:"center",marginBottom:h*0.01}}>{pgname}</Text>
      <ScrollView style={styles.outerScroll} contentContainerStyle={{paddingBottom: h*0.05}}>
        {rooms.map((item, rowIndex) => (
          <ScrollView key={rowIndex} horizontal showsHorizontalScrollIndicator={false}>
            {item.map((item1) => (
              <TouchableOpacity key={item1.roomno} style={styles.cell} onPress={() => navigation.navigate('Room', { pgid: pgid, roominfo: item1, func_change: change_params })}>
                <Text style={styles.cellHead}>{item1.roomno}</Text>
                <View style={[styles.capacity, { backgroundColor: item1.guests.length === item1.capacity ? 'black' : 'white' }]}>
                  <Text style={[styles.capacityText,{ color: item1.guests.length === item1.capacity ? 'white' : 'black' }]}>{item1.guests.length} of {item1.capacity}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ))}
      </ScrollView>
        {isLoading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
            <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}} />
          </View>
        )}
  </View>
  </SafeAreaView>
);
};


const styles = StyleSheet.create({
header: {
  height: h * 0.3,
  justifyContent: "flex-end"
},
outerScroll: {
  height: h * 0.6,
},
cell: {
  height: h * 0.15,
  width: h * 0.2,
  backgroundColor:"rgba(202, 200, 200, 0.5)",
  marginHorizontal: w*0.01,
  marginTop: w*0.02,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius:h*0.01,
},
cellHead: {
  textAlign: 'center',
  fontSize: h * 0.03,
  fontWeight:"600",
  color: "black",
},
capacity: {
  top: h * 0.01,
  height: h * 0.025,
  width: h * 0.075,
  justifyContent:"center",
  alignItems: 'center',
  borderRadius: h * 0.02,
},
capacityText: {
  fontSize: h * 0.02,
},
});

export default OwnerHomeScreen;



