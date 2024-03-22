import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions,Linking,Modal,TouchableWithoutFeedback,Keyboard } from 'react-native';
import { useAppContext } from '../AppContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;

const PginfoScreen = ({ route, navigation }) => {
    const [data, setdata] = useState(route.params.data);
    const [rooms,setrooms]=useState(null);
    const {user} = useAppContext();
    const [isModalVisible,setModalVisible]=useState(false);
    const [question,setquestion]=useState('');
  
    const handleOpenMaps = () => {
      const latitude = data[2]; // Replace with your latitude
      const longitude = data[3]; // Replace with your longitude
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url)
        .then(() => console.log('Google Maps opened successfully'))
        .catch((error) => alert('Unable to open Google Maps', error));
    };

    const Available_rooms=()=>{
      console.log("clicked")
      fetch('http://192.168.29.186:8080/availablerooms', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
      body: JSON.stringify({pgid:data[0]})})
      .then(response => response.json()).then((data) =>{
        if(data.hasOwnProperty("rooms")){
          setrooms(data["rooms"])
          console.log(data["rooms"])
        }
      }).catch(error => console.error('Error:', error));

    }

    const handlesubmit=()=>{
      fetch('http://192.168.29.186:8080/questions', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
      body: JSON.stringify({pgid:data[0],receiver:data[5],sender:JSON.parse(user).username,msg:question,type:'guest_sending'})})
      .then(response => response.json()).then((data) =>{
          console.log(data["msg"])
      }).catch(error => console.error('Error:', error));
      setquestion('');
    }

  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>PG Info</Text>
  
        <View style={styles.row}>
          <Text style={styles.label}>Pg ID:</Text>
          <Text style={styles.value}>{data[0]}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={styles.label}>Pg Name:</Text>
          <Text style={styles.value}>{data[1]}</Text>
        </View>
  
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              multiline
              style={styles.textInput}
              value={data[4]}
              editable={false}
            />
          </View>
        </View>
  
        <View style={styles.row}>
        {data.length===7 &&
        <>
          <Text style={styles.label}>Distance:</Text>
          <Text style={styles.value}>{data[6].toFixed(2)} KM</Text>
        </>
        }
        </View>
  
        <TouchableOpacity style={styles.button} onPress={handleOpenMaps}>
          <Text style={styles.buttonText}>Show in Maps</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={Available_rooms}>
          <Text style={styles.buttonText}>Check No:of Rooms Available</Text>
        </TouchableOpacity>

        {rooms!==null &&
        <Text style={[styles.button,{backgroundColor:"white",fontSize:h*0.03,color:"black"}]}>Available Rooms are: {rooms}</Text>
        }
  
        <TouchableOpacity style={styles.button} onPress={()=>setModalVisible(true)}>
          <Text style={styles.buttonText}>Ask a question to Pg owner</Text>
        </TouchableOpacity>

        <Modal animationType="fade" transparent={true} visible={isModalVisible} onRequestClose={()=>setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.modalContainer}>
              <View style={styles.profileModal}>
              <TouchableOpacity onPress={()=>setModalVisible(false)} style={styles.closeButton}>
              <Icon name="close" style={{ fontSize: h * 0.035, color: 'black' }} />
              </TouchableOpacity>
              <Text style={styles.qtext}>Ask Your Question</Text>
              <TextInput style={styles.qinput} multiline value={question}
               onChangeText={setquestion} placeholder='Type here'/>
              <TouchableOpacity style={styles.submitbtn} onPress={handlesubmit}>
                <Text style={{color:"white",fontSize:h*0.02}}>Send</Text>
              </TouchableOpacity>
              </View>
            </View>
            </TouchableWithoutFeedback>
          </Modal>

      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: w*0.03,
    },
    title: {
      marginTop:h*0.05,
      fontSize: h*0.05,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: h*0.03,
      alignSelf:"center"
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: h*0.03,
    },
    label: {
      fontSize: h*0.025,
      fontWeight:"500",
      color:"black"
    },
    value: {
      fontSize: h*0.025,
      textAlign: 'right',
      color:"black"
    },
    textInputContainer: {
      flex: 1,
      marginLeft: h*0.01,
      height:h*0.1,
    },
    textInput: {
      borderColor: 'black', 
      borderWidth: w*0.005,
      borderRadius: w*0.03,
      fontSize: h*0.02, 
      flex: 1,
      color:"black"
    },
    button: {
      padding: w*0.05,
      borderRadius: w*0.03,
      alignItems: 'center',
      marginBottom: h*0.02,
      backgroundColor: 'black'
    },
    buttonText: {
      color: 'white',
      fontSize: h*0.02,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileModal: {
      width: w * 0.8,
      height: h * 0.6,
      backgroundColor: 'rgba(255,255,255,1)',
      borderRadius: h * 0.02,
      padding: w * 0.05,
      elevation: 5,
    },
    closeButton: {
      position: 'absolute',
      top: h * 0.01,
      right: w * 0.02,
    },
    qtext:{
      marginTop:h*0.03,
      fontSize:h*0.023,
      fontWeight:"600",
      padding:w*0.03,
      color:"black"
    },
    qinput:{
      height:h*0.15,
      padding:w*0.03,
      borderWidth:w*0.005,
      borderRadius:w*0.05,
      borderColor:"black",
      color:"black",
      fontSize:h*0.023
    },
    submitbtn:{
      marginTop:w*0.1,
      backgroundColor:"black",
      alignItems:"center",
      justifyContent:"center",
      marginHorizontal:w*0.2,
      padding:h*0.02,
      borderRadius:w*0.04
    }
  });
  
  export default PginfoScreen;