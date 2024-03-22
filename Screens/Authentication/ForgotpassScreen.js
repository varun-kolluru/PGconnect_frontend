import { useState,useEffect } from "react";
import { Text,View,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform, TextInput,Keyboard,TouchableWithoutFeedback, Dimensions} from "react-native";
const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const ForgotpassScreen=({navigation})=>{
    const [email,setemail] = useState('');
    const [pass,setpass] = useState('');
    const [otp,setotp]=useState(0);

    const submit_mail=()=>{
        fetch('http://192.168.29.186:8080/send_mail', {method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({email:email})})
        .then(response => response.json())
        .then((data) => {
                         if (data.hasOwnProperty("sent")){ 
                            //pass
                            }
                        else{alert(Object.values(data))}
                        })
        .catch(error => console.error('Error:', Object.values(error))); 
    }

    const submit_otp=()=>{
        fetch('http://192.168.29.186:8080/verify_otp', {method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({otp:Number(otp),email:email,pass:pass})})
        .then(response => response.json())
        .then((data) => {
                         if (data.hasOwnProperty("matched")){ 
                            navigation.goBack();
                            }
                        else{alert(Object.values(data))}
                        })
        .catch(error => console.error('Error:', Object.values(error))); 
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{flex:1}}>
              <View style={{flex:0.1}}></View>
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <Text style={styles.title}>Reset Password</Text>
                <TextInput style={styles.Ip} onChangeText={(e)=>{setemail(e.toLowerCase())}} placeholder="Registered Email ID" placeholderTextColor="white"/>
                <TouchableOpacity style={styles.submit} onPress={submit_mail}><Text style={styles.txt}>generate otp</Text></TouchableOpacity>
                <TextInput style={styles.Ip} onChangeText={setpass} placeholder="New Password" secureTextEntry={true} placeholderTextColor="white"/>
                <TextInput style={styles.Ip} onChangeText={setotp} placeholder="6-digit OTP" keyboardType="numeric" placeholderTextColor="white"/>
                <TouchableOpacity style={styles.submit} onPress={submit_otp}><Text style={styles.txt}>verify and reset</Text></TouchableOpacity>
              </KeyboardAvoidingView>
              <View style={{flex:0.2}}>
                <Text style={{textAlign:'center',fontSize:w*0.04,color:'red'}}>OTP will expire in 2mins</Text>
              </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles= StyleSheet.create({
    container: {
        marginHorizontal:w*0.1,
        flex:0.7,
        paddingTop:h*0.05,
        paddingHorizontal:w*0.05,
        backgroundColor:'rgba(0,0,0,0.1)',
        borderRadius:h*0.01
    },
    title:{
        fontSize: h*0.04,
        textAlign:"center",
        marginBottom: h*0.02,
        fontWeight:"bold",
        color:"black"
    },
    Ip: {
        height: h * 0.05,
        fontSize: h * 0.02,
        marginBottom: h * 0.025,
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginHorizontal: w * 0.02,
        marginVertical:h*0.02,
        paddingHorizontal: w * 0.02,
        paddingVertical:0,
        borderRadius: h * 0.01,
        color:"white"
      },
      submit: {
        height: h * 0.05,
        width: w * 0.5,
        left: w * 0.15,
        backgroundColor: 'black',
        borderRadius: h * 0.03,
        marginBottom: h * 0.05,
        justifyContent: 'center'
      },
      txt: {
        fontSize: h * 0.03,
        textAlign: 'center',
        color: 'white'
      }
})

export default ForgotpassScreen;