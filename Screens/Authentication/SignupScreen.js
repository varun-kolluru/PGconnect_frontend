import { useState } from "react";
import { Text,View,StyleSheet,TouchableOpacity,Platform, StatusBar,SafeAreaView,ImageBackground, TextInput, Dimensions,TouchableWithoutFeedback, Keyboard,KeyboardAvoidingView } from "react-native";
import LottieView from 'lottie-react-native';
const h=Dimensions.get("window").height;
const w=Dimensions.get("window").width;

const SignupScreen=({navigation})=>{
    const [fn,setfn]= useState('');
    const [ln,setln]=useState('');
    const [email,setemail]=useState('');
    const [un,setun] = useState('');
    const [pass,setpass]=useState('');
    const [phn,setphn]=useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handlesubmit=()=>{
      setIsLoading(true);
        fetch('http://192.168.29.186:8080/signup', {method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({username:un,password:pass,fname:fn,lname:ln,email:email,phone:phn})})
        .then(response => response.json())
        .then(data => data==='Registered'?navigation.navigate("Login"):alert(Object.values(data)))
        .catch(error => console.error('Error:', error))
        .finally(() => setIsLoading(false));
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{flex: 1,backgroundColor:"#ffffff",paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
          <View style={styles.imgcontainer}>
            <ImageBackground source={require('../../assets/Images/Black/Signup.png')} style={styles.img} resizeMode='contain'>
            </ImageBackground>
          </View>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:0.8}}>
          <View style={styles.container}>
              <Text style={styles.title}>Signup</Text>
            
              <TextInput style={styles.Ip} onChangeText={(e)=>{setemail(e.toLowerCase())}} placeholder="Email Id" placeholderTextColor="white"/>
              <TextInput style={styles.Ip} onChangeText={setun} placeholder="Username" placeholderTextColor="white"/>
              <TextInput style={styles.Ip} onChangeText={setpass} placeholder="Password" secureTextEntry={true} placeholderTextColor="white"/>
              <TextInput style={styles.Ip} onChangeText={setfn} placeholder="First Name" placeholderTextColor="white"/>
              <TextInput style={styles.Ip} onChangeText={setln} placeholder="Last Name" placeholderTextColor="white" />
              <TextInput style={styles.Ip} onChangeText={setphn} placeholder="Phone number" keyboardType="numeric" placeholderTextColor="white"/>

              <TouchableOpacity style={styles.submit} onPress={handlesubmit}><Text style={styles.txt}>submit</Text></TouchableOpacity>

              <Text style={{fontSize:h*0.02,fontWeight:"600",color:"black"}}>Already had account?</Text>
              <TouchableOpacity style={styles.login} onPress={() => navigation.navigate('Login')}><Text style={{fontSize:h*0.025,color:'black',fontWeight:'500'}}>Login</Text></TouchableOpacity>

              {isLoading && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}}/>
              </View>
              )}
          </View>
          </KeyboardAvoidingView>
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
  container: {
    height: h * 0.65,
    width: w * 0.8,
    marginHorizontal: w * 0.1,
    backgroundColor:"rgba(0,0,0,0.1)",
    borderRadius: h * 0.02,
    padding: w * 0.05
  },
  Ip: {
    height: h * 0.04,
    fontSize: h * 0.02,
    paddingVertical:0,
    justifyContent:"center",
    marginBottom: h * 0.025,
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginHorizontal: w * 0.02,
    paddingHorizontal: w * 0.02,
    borderRadius: h * 0.01,
    color:"white"
    },
  title: {
    fontSize: h * 0.05,
    textAlign: 'center',
    marginBottom: h * 0.02,
    color: 'black',
    fontWeight: 'bold'
  },
      login: {
        top: -h * 0.03,
        height: h * 0.04,
        width: w * 0.2,
        left: w * 0.45,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: h*0.001,
        borderRadius: h * 0.01
      },
    submit: {
        height: h * 0.05,
        width: w * 0.4,
        left: w * 0.15,
        backgroundColor: 'black',
        borderRadius: h * 0.02,
        marginBottom: h * 0.05,
        justifyContent: 'center'
      },
      txt: {
        fontSize: h * 0.03,
        textAlign: 'center',
        color: 'white'
      }
  });

export default SignupScreen;