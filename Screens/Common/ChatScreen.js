import React, { useState,useEffect } from 'react';
import { View, TouchableOpacity, Text,StyleSheet,ScrollView,Dimensions, TextInput,Keyboard,TouchableWithoutFeedback,Platform, StatusBar,SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppContext } from '../AppContext';
import LottieView from 'lottie-react-native';

const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;
const ChatScreen=({navigation,route})=>{
    const pgid=route.params.pgid;
    const {user,chat} = useAppContext();
    const [pgmembers,setpgmembers]=useState([]);
    const [fixedfrnds,setfixedfrnds]=useState([]);
    const [friend,setfriend]=useState();
    const [friends,setfriends]=useState([]);
    const frnds_id='friends_'+String(pgid);   /*for async store key*/
    const [rendered,setrendered]=useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

      let fixed_frnds=["PG_Group"+pgid];
      if(!route.params.owner){
        fixed_frnds.push(route.params.owner_uname)
      }
      setfixedfrnds(fixed_frnds);
      var final_frnds=[];
      
      (async ()=>{
        try{
          var old_friends=await AsyncStorage.getItem(frnds_id);   /*friends_pgid_owner*/
          if(!old_friends){
            old_friends="[]";
          }
          final_frnds=get_all_frnds(JSON.parse(old_friends),fixed_frnds);
      }
        catch(e){console.log(e)}
      })();
      console.log({pgid:pgid,owner:route.params.owner_uname})
      setIsLoading(true);
      fetch('http://192.168.29.186:8080/pg_members', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
      body: JSON.stringify({pgid:pgid,owner:route.params.owner_uname})})
      .then(response => response.json()).then((data) =>{
        if(data.hasOwnProperty("members")){
          setpgmembers(data["members"]);
          console.log(data["members"])
          var pgmems=[];
          for(let i=0;i<final_frnds.length;i++){                          /*filtering out frnds left PG*/
            if(data["members"].includes(final_frnds[i])){
              pgmems.push(final_frnds[i]);
            } 
          }
          setfriends(pgmems);
          updatefrnds(pgmems);
        }
      }).catch(error => console.error('Error:', error))
      .finally(() => setIsLoading(false));
    }, []);
  
    useEffect(() => {
      if(rendered){ 
        var tmp_friends=get_all_frnds(friends,fixedfrnds);
        setfriends(tmp_friends); 
        updatefrnds(tmp_friends);
      }
      else{
        setrendered(true);
      }
    }, [chat]);

    const get_all_frnds=(old_frnds,fixed_frnds)=>{
      let new_frnds=[];
      for (let key in chat) {
        if (!old_frnds.includes(key) && !fixed_frnds.includes(key)) {
            new_frnds.push(key);
        }
      }
      return [...new_frnds,...old_frnds];
    }
     
    const updatefrnds=(n_data)=>{
      (async ()=>{
        try{
          await AsyncStorage.setItem(frnds_id,JSON.stringify(n_data));
        }
        catch(e){alert(e)}
      })();
    }

    const search=()=>{
      var t_friend=friend+'_'+pgid;
      if(friend===''){
        alert("Enter username before searching") 
        return
      }
      if(friend===JSON.parse(user).username){
        alert("self messaging is not allowed")
        return
      }
      if(friends.includes(t_friend)){
        var tmp=friends.filter(item=>item!==t_friend);
        tmp=[t_friend,...tmp]
        setfriends(tmp);
      }
      else if(pgmembers.includes(t_friend)){
        setfriends([t_friend,...friends]);
        updatefrnds([...friends,t_friend]);
      }
      else{
        alert('Not a PG Member');
      }
      setfriend("");
    }

    const room_name_display=(room,index)=>{
      if(index===0){
        return "PG Group"
      }
      else if(index===1 && route.params.owner===false){
        return room.split('_')[0]+' (Owner)'
      }
      else{
        return room.split('_')[0]
      } 
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={{flex: 1,backgroundColor:"black",paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
            <View style={{flex:0.15,backgroundColor:"black",justifyContent:"center"}}>
              <Text style={styles.headtxt}>Chats</Text>
            </View>
            <View style={{backgroundColor:"white",flex:0.85}}> 
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} placeholder='search with username' value={friend} onChangeText={setfriend} />
              <TouchableOpacity style={styles.sendButton} onPress={search}>
                <Text style={styles.sendButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.sv} contentContainerStyle={{paddingBottom: h*0.05}}>
                    {isLoading && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                      <LottieView source={require('../../assets/Animations/loader_Animation - 1705673511195.json')} autoPlay loop style={{height:h*0.3,width:w*0.75}} />
                    </View>
                    )}
              {([...fixedfrnds,...friends]).map((item,index)=>(
              
                <TouchableOpacity key={index} style={styles.room} onPress={() =>{ 
                  if(index===0){navigation.navigate('Grp Chat Room',{room:item,pgid:pgid,pgmembers:pgmembers})}
                  else{navigation.navigate('Chat Room',{room:item,pgid:pgid})}
                  }}>
                  <Text style={styles.room_title}>{room_name_display(item,index)}</Text>
                  <View style={{flex:0.2}}>
                  {chat[item] &&
                    <View style={styles.unread}><Text style={{color:"white"}}>{chat[item].length}</Text></View>
                  }
                  </View>
                </TouchableOpacity>
                
              ))} 
            </ScrollView>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    headtxt:{
        fontSize:h*0.05,
        fontWeight:"bold",
        color:"white",
        padding:h*0.02
    },
    searchip:{
        height:h*0.05,
        backgroundColor:'rgba(0,0,0,0.1)',
        marginHorizontal:h*0.02,
        marginVertical:h*0.01,
        borderRadius:h*0.03,
        textAlign:'center',
        fontSize:h*0.025
    },
    sv:{
        padding:h*0.01,
    },
    room:{
        height:h*0.1,
        flexDirection:"row",
        borderColor:'black',
        borderBottomWidth:h*0.001,
        borderTopWidth:h*0.001,
        justifyContent:"center",
        paddingHorizontal:h*0.02,
        paddingVertical:h*0.03
    },
    room_title:{   
        flex:0.8,
        fontSize:h*0.03,
        color:"black"
    },
    unread:{
      backgroundColor:"black",
      alignItems:"center",
      justifyContent:"center",
      width:h*0.03,
      height:h*0.03,
      borderRadius:h*0.015,
      left:w*0.1
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: w*0.03,
      paddingVertical: w*0.02,
      borderTopWidth: w*0.001,
      borderTopColor: '#ccc',
    },
    input: {
      flex: 1,
      height: h*0.05,
      borderWidth: w*0.005,
      borderColor: '#ccc',
      borderRadius: w*0.02,
      marginRight: w*0.02,
      paddingVertical:0
    },
    sendButton: {
      backgroundColor:'black',
      paddingVertical: w*0.03,
      paddingHorizontal: w*0.05,
      borderRadius: w*0.03,
    },
    sendButtonText: {
      color: 'white',
    },

  });

export default ChatScreen;