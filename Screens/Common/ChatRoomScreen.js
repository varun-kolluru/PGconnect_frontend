import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList,RefreshControl, KeyboardAvoidingView, Platform, StyleSheet,Dimensions } from 'react-native';
import { useAppContext } from '../AppContext';
import { Q } from '@nozbe/watermelondb'

const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;

const ChatRoomScreen = ({route,navigation}) => {
  const { chat,user,removechat,ws,db } = useAppContext();
  const username=JSON.parse(user).username+"_"+route.params.pgid;
  const [msg,setmsg]=useState("");
  const [roomchat,setroomchat]=useState([]);
  const [pages,setpages]=useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const room_key=username+route.params.room;


  useEffect(() => {
    if(chat[route.params.room]!=null){                      /*chat={room:[{msg1,ts1},{msg2,ts2}]}*/
    let tmp=[...roomchat,...chat[route.params.room]];       /*roomchat={room:[{msg1,ts1},{msg2,ts2}]}*/
    add_to_db(chat[route.params.room]);
    setroomchat(tmp);
    removechat(route.params.room);
    clear_cache();
    }
  }, [chat[route.params.room]]);


  const clear_cache=()=>{
    fetch('http://192.168.29.186:8080/chat_cache_clear', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
    body: JSON.stringify({key:username,sender:route.params.room})})    /*clear the cache which are seen by this user key=receiver of msg and sender=sender of msg*/
    .then(response => response.json()).then((data) =>{
    }).catch(error => console.error('Error:', error));
  }

  const onRefresh = () => {
    setRefreshing(true);
    get_db_data(pages+1);
    setpages(pages+1);
    setTimeout(() => {
       setRefreshing(false);
    }, 500); // Refresh indicator will be visible for at least 1 second
  };
 
  const add_to_db = async (data) => {
    await db.write(async () =>{
      for(let i=0;i<data.length;i++){
      const newchat = await db.get('chats').create(chat=>{chat.msgfrom=data[i].from;chat.msgto=data[i].to;chat.msg=data[i].msg;chat.ts=data[i].ts;chat.room=room_key});
      }
    })
  }

  const get_db_data = async (pages) => {
    const allchats= await db.get('chats').query(Q.where('room',room_key),Q.sortBy('ts', Q.desc),Q.take(pages*5)).fetch();
    var tmp=allchats.map(x=>({msg:x.msg,from:x.msgfrom,to:x.msgto,ts:x.ts}));
    setroomchat(tmp.reverse());
  };

  function date_time(){
    var ISTTime = new Date();
    var year = ISTTime.getFullYear().toString().substring(2, 4);
    var month = ISTTime.getMonth() + 1; 
    var date = ISTTime.getDate();
    var hours = ISTTime.getHours();
    var minutes = ISTTime.getMinutes();
    var seconds = ISTTime.getSeconds();
    month = month < 10 ? '0' + month : month;
    date = date < 10 ? '0' + date : date;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var timestamp = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
    return timestamp
  }

  const sendMessage=()=> {
    var tmp=msg.trim();
    if(tmp.length>0){  
      var data={from:username,msg:msg,to:route.params.room};                               
      ws.send(JSON.stringify(data));
      data.ts=date_time()
      add_to_db([data]);
      setroomchat([...roomchat,data])
    }
    setmsg("");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{route.params.room.split('_')[0]}</Text>
      </View>
      <View style={styles.body}>
        <FlatList data={roomchat} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} renderItem={({ item,index }) => (
          <>
            {index!==0 && roomchat[index].ts.split(' ')[0]!==roomchat[index-1].ts.split(' ')[0] &&
              <Text style={{alignSelf:"center",color:"black",fontSize:h*0.02,borderBottomColor:"black",borderBottomWidth:w*0.001}}>{roomchat[index].ts.split(' ')[0]}</Text>
            }
            <View style={[styles.messageContainer, item.from===username ? styles.sentMessage : styles.receivedMessage]}>
              <Text style={styles.messageText}>{item.msg}</Text>
              <Text style={{fontSize:h*0.015,alignSelf:"flex-end",color:"#ffffff"}}>{item.ts.split(' ')[1].substring(0,5)}</Text>
            </View>
           </> 
          )}
        />
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.footer}>
        <TextInput style={styles.input} placeholder="Type a message" value={msg} multiline={true} onChangeText={setmsg}/>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent:"center",
    height:h*0.15,
  },
  headerText: {
    color: '#ffffff',
    fontSize: h*0.035,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
  },
  messageContainer: {
    maxWidth: '80%',
    paddingHorizontal: h*0.01,
    paddingVertical:w*0.001,
    borderRadius: h*0.01,
    marginVertical:h*0.005,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'black',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  messageText: {
    fontSize:h*0.0225,
    fontWeight:"300",
    color:"#ffffff"
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: h*0.025,
    paddingVertical:h*0.01,
    backgroundColor: '#ffffff',
    borderTopWidth: h*0.001,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    fontSize:h*0.02,
    fontWeight:"300",
    height: h*0.05,
    borderColor: 'black',
    borderWidth: h*0.001,
    borderRadius: h*0.02,
    paddingHorizontal: h*0.01,
    marginRight: h*0.01,
    marginBottom:h*0.025,
    paddingVertical:0,
    color:"black"
  },
  sendButton: {
    backgroundColor: 'black',
    borderRadius: h*0.02,
    paddingVertical: h*0.01,
    paddingHorizontal: h*0.02,
    marginBottom:h*0.025
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize:h*0.018
  },
});

export default ChatRoomScreen;