import { useState,useEffect } from "react";
import { Text,View, Dimensions} from "react-native";
import { useAppContext } from "../AppContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import Video from 'react-native-video';
const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const StartScreen=({navigation})=>{
    const {setuser}=useAppContext();

    useEffect(()=>{
        (async ()=>{
          try{
            let tmp=await AsyncStorage.getItem('user');
            if(tmp){
                 tmp=JSON.parse(tmp);
                 get_new_tokens(tmp); 
                }
            else{
              setTimeout(() => {
                navigation.reset({index: 0, routes: [{name: 'Login'}]});
              }, 5000);
            }
          }
          catch(e){alert(e)}
        })();
      },[]);

    const get_new_tokens=(info)=>{
        fetch('http://192.168.29.186:8080/token_update', {method: 'POST',headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({refresh_token:info.refresh_token})})
        .then(response => response.json())
        .then((data) => {
                         if (data.hasOwnProperty("token")){
                          info.token=data.token;
                          info.refresh_token=data.refresh_token;
                          set_new_tokens(info);
                         }
                         else{              
                        setTimeout(() => {
                          navigation.reset({index: 0, routes: [{name: 'Login'}]});
                        }, 5000);}
                        })
        .catch(error => alert('Check your Network'));
    }
    
    const set_new_tokens=(updated_info)=>{
        (async ()=>{
            try{
              await AsyncStorage.setItem('user',JSON.stringify(updated_info));
              setuser(JSON.stringify(updated_info));
              setTimeout(() => {
              navigation.reset({index: 0, routes: [{name: 'Welcome',params:{data:updated_info}}]});
            }, 5000);
            }
            catch(e){alert(e)}
          })();
    }

    return (
      <View style={{ flex:1,backgroundColor:"#ffffff",justifyContent:"center",alignItems:"center"}}>
        <Video
        source={require('../../assets/Animations/video_full.mp4')}
        style={{ height: h * 0.5, width: w * 0.8 }}
        controls={false}  // Optional: Add controls for play/pause, etc.
        resizeMode="cover"  // Optional: Adjust the video's aspect ratio
        repeat={true}  // Optional: Set to true if you want the video to loop
        autoplay={true}  // Optional: Autoplay the video
         />
        </View>

    );
}

export default StartScreen;
