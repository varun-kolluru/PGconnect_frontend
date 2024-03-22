import { Text,View,StyleSheet,TouchableOpacity,Dimensions,Modal,Platform, StatusBar,SafeAreaView } from "react-native";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';

const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const WelcomeScreen=({route,navigation})=>{
  const [userInfo,setuserInfo]=useState(route.params.data);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  const logout=()=>{
    (async ()=>{
      try{
        let keys1 = await AsyncStorage.getAllKeys();
        console.log(keys1);
        await AsyncStorage.clear();
        navigation.reset({index: 0, routes: [{name: 'Login'}]});
      }
      catch(e){alert(e)}
    })();
  }

    return (
        <SafeAreaView style={{flex: 1,backgroundColor:"black",paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}> 
          <View style={styles.header}>
            <TouchableOpacity onPress={()=>setProfileModalVisible(true)} style={styles.profile}>
              <Icon name="user-circle-o" style={{ fontSize: h * 0.1,color:"black" }} />
            </TouchableOpacity>
            <Text style={{ fontSize: h * 0.03, top:h*0.1,color:"white" }}>Welcome {userInfo.name.split(' ')[0]}!</Text>
          </View>

          <View style={{top:-h*0.15,backgroundColor:'white',height:h*0.75,borderRadius:h*0.07}}>
            <View style={{top:h*0.15}}>
              <TouchableOpacity onPress={() => navigation.navigate('My PGs')} style={styles.button}><Text style={styles.btntxt}>Owner</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Guest')} style={styles.button}><Text style={styles.btntxt}>Guest</Text></TouchableOpacity>

              <TouchableOpacity onPress={logout} style={{top:h*0.15,width:w*0.2}}>
                <Icon name="arrow-circle-left" style={{fontSize:h*0.06,left:w*0.05,color:"black"}}/>
                <Text style={{left:w*0.02,fontSize:h*0.025,color:"black"}}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Modal animationType="fade" transparent={true} visible={isProfileModalVisible} onRequestClose={()=>setProfileModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.profileModal}>
                <Text style={styles.profileText}>Profile Info</Text>
                <Text style={styles.userInfoText}>Name: {userInfo.name}</Text>
                <Text style={styles.userInfoText}>Username: {userInfo.username}</Text>
                <Text style={styles.userInfoText}>Email: {userInfo.email}</Text>
                <Text style={styles.userInfoText}>Phone: {userInfo.phone}</Text>
              <TouchableOpacity onPress={()=>setProfileModalVisible(false)} style={styles.closeButton}>
                <Icon name="close" style={{ fontSize: h * 0.035, color: 'black' }} />
              </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView> 
    );
}

const styles = StyleSheet.create({
  profile:{
    borderColor:"white",
    top:h*0.05,
    borderRadius:h*0.1,
    alignSelf:'center',
    alignItems:'center',
    justifyContent:"center",
    backgroundColor:"white"
  },
  header:{
    height:h*0.4,
    backgroundColor:"black"
  },
  button: {
    height:h*0.07,
    marginHorizontal:w*0.3,
    marginVertical:h*0.035,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: h*0.001,
    borderRadius: h * 0.01,
    backgroundColor:"black"
  },
  btntxt: {
    fontSize:h*0.025,
    fontWeight:"400",
    color:"white"
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
    borderRadius: h * 0.02,
    padding: w * 0.05,
    elevation: 5,
    borderWidth:h*0.001,
    borderColor:"black"
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
  userInfoText: {
    fontSize: h * 0.025,
    marginBottom: h * 0.025,
    color:"black"
  },
  });

export default WelcomeScreen;