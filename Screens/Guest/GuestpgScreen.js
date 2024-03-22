import React, { useState,useEffect } from 'react';
import { View, TouchableOpacity, Text,StyleSheet,ScrollView,Dimensions,ImageBackground,Modal,Platform, StatusBar,SafeAreaView } from 'react-native';
import { useAppContext } from '../AppContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';

const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const GuestpgScreen = ({route,navigation }) => {

  const [Data,setData]=useState([]);
  const {user}=useAppContext();
  const [msgs,setmsgs]=useState([]);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    (async ()=>{
      try{
        let tmp=JSON.parse(user);

        setIsLoading(true);
        fetch('http://192.168.29.186:8080/gPg_data', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+tmp.token},
        body: JSON.stringify({username:tmp.username})})
        .then(response => response.json()).then((data) =>{setData(data);console.log("fetched");})
        .catch(error => console.error('Error:', error))
        .finally(() => setIsLoading(false));

        fetch('http://192.168.29.186:8080/questions', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+tmp.token},
        body: JSON.stringify({receiver:tmp.username,type:'guest_receiving'})})
        .then(response => response.json()).then((data) =>{setmsgs(data['msg']);console.log(data['msg'])})
        .catch(error => console.error('Error:', error));
      }
      catch(e){alert(e)}
    })();

  },[]);

  const clear_msgs=()=>{
    fetch('http://192.168.29.186:8080/questions', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
    body: JSON.stringify({receiver:JSON.parse(user).username,type:'guest_clear'})})
    .then(response => response.json()).then((data) =>{console.log(data['msg'])})
    .catch(error => console.error('Error:', error));
  }

  return (
    <SafeAreaView style={{flex: 1,backgroundColor:"#ffffff",paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
      <View style={styles.imgcontainer}>
        <ImageBackground source={require('../../assets/Images/Black/pgs_guest.png')} style={styles.img} resizeMode='contain'>
          <TouchableOpacity style={styles.msgbox} onPress={()=>{setProfileModalVisible(true),clear_msgs();}}>
            <Icon name="envelope"  style={{ fontSize: h * 0.065,color:"black" }} />
            {msgs.length>0 &&
            <View style={styles.badge}>
              <Text style={{fontSize:h*0.02,color:"black"}}>{msgs.length}</Text>
            </View>
            }
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <Modal animationType="fade" transparent={true} visible={isProfileModalVisible} onRequestClose={()=>setProfileModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.profileModal}>
                <Text style={styles.profileText}>MSGs from PG Owners</Text>
                <ScrollView>
                    {msgs.map((item,index) => (
                      <Text style={{fontSize:h*0.02,marginVertical:h*0.02,color:"black"}}>{index+1}.)({item[2]}):- {item[0]}</Text>
                    ))}
                </ScrollView>

              <TouchableOpacity onPress={()=>{setProfileModalVisible(false);setmsgs([]);}} style={styles.closeButton}>
              <Icon name="close" style={{ fontSize: h * 0.035, color: 'black' }} />
              </TouchableOpacity>
              </View>
            </View>
        </Modal>
      <View style={{flex:0.75}}>
      <View>
        <Text style={{fontSize:h*0.04,fontWeight:"700",padding:h*0.02,color:"black"}}>Joined PGs</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom: h*0.025}}>
        {Object.entries(Data).map(([key, value]) => (                      /*{pgid:[[pgname,roomno,start_date,days_stay,fee,penality,owner_uname]]}*/
          <View style={styles.pgCard} key={key}>
            <Text style={styles.pgTitle}>{value[0][0]}</Text>
            <Text style={styles.pgId}>(unique id: {key})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {value.map((item1) => (
                <TouchableOpacity
                  style={styles.cell}
                  key={item1[1]}
                  onPress={() => navigation.navigate('Guest Tab', { pgid: key, roomno: item1[1],ginfo:item1 })}
                >
                  <Text style={styles.cellText}>Room {item1[1]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
      {isLoading && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}} />
              </View>
      )}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('PG Search')} style={styles.sbtn}>
          <Text style={{color:"white",fontSize:h*0.025}}>Find More PGs</Text>
        </TouchableOpacity>
      </View>
      </View>
      </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  imgcontainer:{
    flex:0.25,
    alignItems:"center"
  },
  img:{
    width:w*0.9,
    height:h*0.25
  },
  msgbox:{
    height:h*0.065,
    width:h*0.065,
    alignSelf:"flex-end"
  },
  badge:{
    height:h*0.03,
    width:h*0.03,
    backgroundColor:'tomato',
    borderRadius:h*0.05,
    top:-h*0.07,
    left:h*0.045,
    alignItems:"center",
    justifyContent:"center",
  },
  scrollView: {
    height: h * 0.5,
    padding:h*0.02,
  },
  footer:{
    height:h*0.2,
    alignItems:"center",
  },
  sbtn:{
    top:h*0.04,
    backgroundColor:"black",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:h*0.02,
    paddingHorizontal:h*0.05,
    paddingVertical:h*0.02,
  },
  pgCard: {
    backgroundColor:"rgba(202, 200, 200, 0.34)",
    height: h * 0.23,
    marginBottom:h*0.02,
    borderRadius: h * 0.02,
    justifyContent: 'center',
    paddingHorizontal: w * 0.05,
    paddingTop:w*0.05
  },
  pgTitle: {
    fontSize: h * 0.04,
    color:"black"
  },
  pgId: {
    fontSize: h * 0.02,
    marginBottom: h * 0.01,
    color:"black"
  },
  cell: {
    backgroundColor:"black",
    width: w * 0.4,
    margin: w * 0.01,
    borderRadius: w * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    height: h * 0.1,
  },
  cellText: {
    fontSize: h * 0.02,
    color:"white",
    fontWeight:"500"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModal: {
    width: w * 0.8,
    height: h * 0.6,
    backgroundColor: 'white',
    borderWidth:w*0.005,
    borderColor:"black",
    borderRadius: h * 0.02,
    padding: w * 0.05,
    elevation: 5,
  },
  profileText: {
    top:h*0.05,
    fontSize: h * 0.04,
    textAlign: 'center',
    marginBottom: h * 0.1,
    color:"black"
  },
  closeButton: {
    position: 'absolute',
    top: h * 0.01,
    right: w * 0.02,
  },
});

export default GuestpgScreen;