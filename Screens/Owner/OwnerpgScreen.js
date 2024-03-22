import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Dimensions,ImageBackground,Platform, StatusBar,SafeAreaView } from 'react-native';
import { useAppContext } from '../AppContext';
import LottieView from 'lottie-react-native';

const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;

const OwnerpgScreen = ({ route, navigation }) => {
  const [Data, setData] = useState([]);
  const { user } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
      fetch('http://192.168.29.186:8080/Pg_data', {method: 'POST',headers: {'Content-Type': 'application/json',Authorization: 'Token ' + JSON.parse(user).token,},
      body: JSON.stringify({ username: JSON.parse(user).username })}).then((response) => response.json())
      .then((data) => {
              setData(data);
            })
      .catch((error) => console.error('Error:', error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleaddData = (data) => {
    let tmp_data = [...Data, data];
    setData(tmp_data);
  };

  const handledelData=(pgid)=>{
    let tmp_data=Data.filter(x=>x[0]!==pgid);
    setData(tmp_data);
  }

  return (
    <SafeAreaView style={{flex: 1,backgroundColor:"#ffffff",paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}> 
      <View style={styles.imgcontainer}>
        <ImageBackground source={require('../../assets/Images/Black/pgs_owner.png')} style={styles.img} resizeMode='contain'>
        </ImageBackground>
      </View>
      <View style={{flex:0.75}}>
        <View>
          <Text style={{fontSize:h*0.04,fontWeight:"700",padding:h*0.02,color:"black"}}>Owned PGs</Text>
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom: h*0.05}}>
          {Data.map((item, index) => (
            <View style={styles.pgcard} key={index}>
              <View style={{flex:1,flexDirection:"row"}}>
                <View style={{paddingTop:h*0.02,paddingLeft:h*0.015,flex:0.7}}>
                  <Text style={styles.pgTitle}>{item[1]}</Text>
                  <Text style={{color:"black"}}>(unique id: {item[0]})</Text>
                </View>
                <View style={{flex:0.3,alignItems:"flex-start",justifyContent:"center"}}>
                  <TouchableOpacity key={index} onPress={() => navigation.navigate('Owner Tab', { data: item,DelData: handledelData })} style={{backgroundColor:"black",paddingHorizontal:h*0.025,paddingVertical:h*0.01,borderRadius:h*0.01}}>
                    <Text style={{fontSize:h*0.025,color:"white",fontWeight:"500"}}>GO</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView> 
        {isLoading && (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
              <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}} />
            </View> 
          )}
        <View style={{height:h*0.15,justifyContent:"center",alignItems:"center"}}>
        <TouchableOpacity onPress={() => navigation.navigate('Create PG', { AddData: handleaddData })} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New</Text>
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
    width:w*0.8,
    height:h*0.25
  },
  scrollView:{
    padding:h*0.03
  },
  pgcard:{
    height:h*0.125,
    backgroundColor:"rgba(202, 200, 200, 0.34)",
    marginBottom:h*0.025,
    borderRadius:h*0.02
  },
  pgTitle:{
    fontSize:h*0.035,
    fontWeight:"600",
    color:"black"
  },
  addButton:{
    backgroundColor:"black",
    paddingHorizontal:h*0.05,
    paddingVertical:h*0.02,
    borderRadius:h*0.01
  },
  addButtonText:{
    color:"white",
    fontSize:h*0.025
  }
});

export default OwnerpgScreen;
