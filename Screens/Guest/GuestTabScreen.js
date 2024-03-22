import React from 'react';
import { useEffect,useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAppContext } from '../AppContext';

// Import your screens here
import GuestroomScreen from './GuestroomScreen';
import ChatScreen from '../Common/ChatScreen';

const Tab = createBottomTabNavigator();


const GuestTabScreen = ({route}) => {
  const {user,chat,updatechat,set_chat,set_ws}=useAppContext()
  const pgid=route.params.pgid;
  const chat_uname=JSON.parse(user).username+'_'+pgid
  const owner=route.params.ginfo[6]===JSON.parse(user).username;
  const [ws,setws]=useState(ws);

  useEffect(()=>{
    const new_ws=new WebSocket('ws://192.168.29.186:8080/chat/'+chat_uname+'/');

    new_ws.onmessage = function(e) {
      var cur_msg = JSON.parse(e.data);
      updatechat(cur_msg);       /*sent by other user to me*/
      console.log("msg received",cur_msg);
    };

    new_ws.onclose = function(e) {
      console.error('WebSocket closed by onclose');
    };

    new_ws.onerror = function(e){
      console.error(e);
    };
    set_ws(new_ws);

    return () => {
      new_ws.close();
      set_chat({});
    };
  },[])

  return (
    <Tab.Navigator initialRouteName='Home'  screenOptions={{headerShown: false, tabBarActiveTintColor: 'black'}}>
      <Tab.Screen name="Home" component={GuestroomScreen} initialParams={{pgid:pgid,roomno:route.params.roomno,ginfo:route.params.ginfo}} options={{tabBarIcon: ({ color, size }) => (<Icon name="home" size={size} color={color} />)}}/>
      <Tab.Screen name="Chats" component={ChatScreen} initialParams={{pgid:pgid,owner:owner,owner_uname:route.params.ginfo[6]+'_'+pgid}} options={{tabBarIcon: ({ color, size }) => (<Icon name="wechat" size={size} color={color} />), tabBarBadge:Object.keys(chat).length===0?null:Object.keys(chat).length}}/>
    </Tab.Navigator>
  );
};

export default GuestTabScreen;