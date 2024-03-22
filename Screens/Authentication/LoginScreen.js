import { useState } from "react";
import { Text,View,StyleSheet,TouchableOpacity,ImageBackground, TextInput,Keyboard,TouchableWithoutFeedback, Dimensions,Platform, StatusBar,SafeAreaView} from "react-native";
import { useAppContext } from "../AppContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const LoginScreen=({navigation})=>{
    const [un,setun] = useState('');
    const [pass,setpass]=useState('');
    const {setuser}=useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    const set_state=(token,refresh_token,name,username,email,phone)=>{
        (async ()=>{
            try{
              await AsyncStorage.setItem('user',JSON.stringify({token:token,refresh_token:refresh_token,username:username,name:name,email:email,phone:phone}));
              setuser(JSON.stringify({token:token,refresh_token:refresh_token,username:username,name:name,email:email,phone:phone}));
            }
            catch(e){alert(e)}
          })();
        }

    const handlesubmit=()=>{
        setIsLoading(true);

        fetch('http://192.168.29.186:8080/signin', {method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({username:un,password:pass})})
        .then(response => response.json())
        .then((data) => {
                         if (data.hasOwnProperty("token")){ 
                            set_state(data.token,data.refresh_token,data.name,data.username,data.email,data.phone);
                            navigation.reset({index: 0, routes: [{name: 'Welcome',params:{data:data}}]});
                            }
                        else{alert(Object.values(data))}
                        })
        .catch(error => console.error('Error:', Object.values(error)))
        .finally(() => setIsLoading(false));
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{flex: 1,backgroundColor:"#ffffff",paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}> 
          <View style={styles.imgcontainer}>
            <ImageBackground source={require('../../assets/Images/Black/Login.png')} style={styles.img} resizeMode='contain'>
            </ImageBackground>
          </View>
          <View style={{flex:0.75,alignItems:"center",}}>
            <View style={styles.container}>
              <Text style={styles.title}>Login</Text>
              <TextInput style={styles.Ip} onChangeText={(e) => { setun(e.toLowerCase()) }} placeholder="Email ID" placeholderTextColor="white" />
              <TextInput secureTextEntry={true} onChangeText={setpass} style={styles.Ip} placeholder="Password" placeholderTextColor="white"/>
              <TouchableOpacity style={styles.submit} onPress={handlesubmit}><Text style={styles.txt}>Login</Text></TouchableOpacity>
              <Text style={{ fontSize: h * 0.02,fontWeight:"600",color:"black"}}>New to PG connect?</Text>
              <TouchableOpacity style={styles.signup} onPress={() => navigation.navigate('Signup')}><Text style={{ fontSize: h * 0.025, color: 'black', fontWeight: '500' }}>Signup</Text></TouchableOpacity>
              <TouchableOpacity style={styles.fpassword} onPress={() => navigation.navigate('Forgot Password')}><Text style={{ fontSize: w * 0.042, color: 'black', fontWeight: '500' }}>Forgot Password?</Text></TouchableOpacity>
          
              {isLoading && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}}/>
              </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
        imgcontainer:{
          flex:0.25,
          alignItems:"center"
        },
        img:{
          width:w*0.8,
          height:h*0.25
        },
        container: {
          height: h * 0.55,
          width: w * 0.8,
          marginHorizontal: w * 0.1,
          backgroundColor:"rgba(0,0,0,0.1)",
          borderRadius: h * 0.02,
          padding: w * 0.05
        },
        title: {
            fontSize: h * 0.05,
            textAlign: 'center',
            marginBottom: h * 0.05,
            color: 'black',
            fontWeight: '500'
          },
        Ip: {
          height: h*0.05,
          fontSize: h * 0.02,
          marginBottom: h * 0.03,
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginHorizontal: w * 0.02,
          paddingHorizontal: w * 0.02,
          paddingVertical:0,
          borderRadius: h * 0.01,
          color:"white"
        },
        submit: {
          height: h * 0.05,
          width: w * 0.4,
          alignSelf:"center",
          backgroundColor: 'black',
          borderRadius: h * 0.01,
          marginTop:h*0.03,
          marginBottom: h * 0.05,
          justifyContent: 'center'
        },
        txt: {
          fontSize: h * 0.03,
          textAlign: 'center',
          color: 'white'
        },
        signup: {
          top: -h * 0.03,
          height: h * 0.04,
          width: w * 0.25,
          left: w * 0.42,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: 'black',
          borderWidth: h*0.001,
          borderRadius: h * 0.01
        },
        fpassword: {
          width: w * 0.4,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: 'black',
          padding:h*0.001,
          borderWidth: h*0.001,
          borderRadius: h * 0.01
        }
      });

export default LoginScreen;
