import React, {useState } from 'react';
import { Dimensions,View,ScrollView,Text, TextInput, TouchableOpacity,StyleSheet,ImageBackground,Platform, StatusBar,SafeAreaView} from 'react-native';
import LottieView from 'lottie-react-native';
import { useAppContext } from '../AppContext';
const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const RoomScreen = ({ route, navigation }) => {
  const [oldcap,setoldcap]=useState(route.params.roominfo['capacity'])
  const [cap,setcap]=useState(route.params.roominfo['capacity'])
  const [guests,setguests]=useState(route.params.roominfo['guests'])  /*[[roomno,username,startdate,daysstay,fee,penality],[] ]*/ 
  const {user}=useAppContext();
  const token=JSON.parse(user).token;
  const [isLoading, setIsLoading] = useState(false);

  const del_guest=(del_guest)=>{
    var tmp=[]
    for(let i=0;i<guests.length;i++){
      if(guests[i][1]!=del_guest){
        tmp.push(guests[i]);
      }
    }
    setguests(tmp);
    route.params.func_change(route.params.roominfo['roomno'],oldcap,tmp);
  }

  const add_guest=(new_guest)=>{
    var tmp=[...guests,new_guest]
    setguests(tmp)
    route.params.func_change(route.params.roominfo['roomno'],oldcap,tmp);
  }

  const create_guest=()=>{
    if(cap>guests.length){
      navigation.navigate("Create Guest",{pgid:route.params.pgid,roomno:route.params.roominfo['roomno'],addguest:add_guest})
    }
    else(alert("increase capacity before adding new guest"))
  }

  const change_capacity=()=>{
    if(oldcap<guests.length){alert("Remove Guests Before decreasing capacity")} 
    else if(oldcap<0){alert("capacity cannot be negative")}
    else if(oldcap!=cap){
      setIsLoading(true)
      fetch('http://192.168.29.186:8080/capchange', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+token},
      body: JSON.stringify({pgid:route.params.pgid,roomno:route.params.roominfo['roomno'],capacity:Number(oldcap)})}).then(response => response.json())
      .then((data) =>{
        setcap(oldcap);
        route.params.func_change(route.params.roominfo['roomno'],oldcap,guests);
      })
      .catch(error => console.error('Error:', error))
      .finally(() => setIsLoading(false));
    }
  }

  return (
    <SafeAreaView style={{flex: 1,backgroundColor:"#ffffff",paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}> 
      <View style={styles.imgcontainer}>
        <ImageBackground source={require('../../assets/Images/Black/Owner_room.png')} style={styles.img} resizeMode='contain'>
        </ImageBackground>
      </View>
      <View style={{flex:0.75}}>
        <View style={styles.head}>
          <Text style={styles.headtxt}>{route.params.roominfo['roomno']}</Text>
        </View>
        <ScrollView style={styles.scrollip} contentContainerStyle={{paddingBottom:h*0.05}}>

            <Text style={styles.subhead}>Change Capacity</Text>
            <View style={{flexDirection:'row'}}>
              <Text style={[styles.txt,{flex:0.5}]}>Current Capacity</Text><Text style={[styles.txt,{flex:0.5}]}>{cap}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
            <Text style={[styles.txt,{flex:0.4}]}>Change Capacity? </Text>
            <TextInput style={[styles.txt,{flex:0.3,backgroundColor:"rgba(202, 200, 200, 0.34)",fontSize:h*0.015,paddingVertical:0}]} onChangeText={setoldcap} placeholder='new capacity' keyboardType='numeric'/>
            <TouchableOpacity onPress={change_capacity} style={[styles.btn,{flex:0.3}]}><Text style={styles.btntxt}>Change</Text></TouchableOpacity>
            </View>
            {isLoading && (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
              <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}} />
            </View>
          )}
            <Text style={styles.subhead}>Guests</Text>
            <View style={{flexDirection:'row'}}>
              <Text style={[styles.txt,{flex:0.4}]}>Guests count</Text><Text style={[styles.txt,{flex:0.6}]}>{guests.length}</Text>
            </View>      
            {guests.map((item,index)=>(
                  <>
                  <View style={{flexDirection:'row',paddingVertical:h*0.025}}>
                    <Text style={[styles.txt,{flex:0.2}]}>{index+1}.) </Text><Text style={[styles.txt,{flex:0.5,textAlign:"center"}]}>{item[1]}</Text>
                    <TouchableOpacity style={[styles.btn,{flex:0.3}]} onPress={() => navigation.navigate('Guest Info',{data:item,pgid:route.params.pgid,roomno:route.params.roominfo['roomno'],delguest:del_guest})}>
                    <Text style={styles.btntxt}>Details</Text>
                    </TouchableOpacity>
                  </View>
                  </>
                  ))}
        </ScrollView>
        <View style={{height:h*0.1}}>
          <TouchableOpacity onPress={create_guest} style={styles.abtn}><Text style={styles.btntxt}>ADD New guest</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
  head:{
    height:h*0.07,
    width:h*0.2,
    alignSelf:"center",
    backgroundColor:"black",
    alignItems:'center',
    justifyContent:"center",
    borderEndEndRadius:h*0.04,
    borderEndStartRadius:h*0.04
  },
  headtxt:{
    fontSize:h*0.04,
    color:"white"
  },
  subhead:{
    fontWeight:"bold",
    fontSize:h*0.03,
    marginVertical:h*0.02,
    color:"black"
  },
  scrollip:{
    paddingHorizontal:h*0.01,
    paddingVertical:h*0.03,
  },
  txt:{
    fontSize:h*0.02,
    fontWeight:"500",
    padding:h*0.01,
    color:"black"
  },
  btn:{
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"black",
    marginLeft:h*0.02,
    borderRadius:h*0.015
  },
  btntxt:{
    color:"white",
    fontSize:h*0.02
  },
  abtn:{
    alignItems:"center",
    justifyContent:"center",
    alignSelf:"center",
    padding:h*0.02,
    backgroundColor:"black",
    borderRadius:h*0.01
  }
})

export default RoomScreen;