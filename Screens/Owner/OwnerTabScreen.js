import React,{useEffect,useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAppContext } from '../AppContext';
import { Dimensions } from 'react-native';

// Import your screens here
import OwnerHomeScreen from './OwnerHomeScreen';
import ChatScreen from '../Common/ChatScreen';
import NotificationScreen from '../Common/NotificationScreen';
import QuestionsScreen from '../Common/QuestionsScreen';
const h= Dimensions.get("window").height;
const w= Dimensions.get("window").width;
const Tab = createBottomTabNavigator();

const OwnerTabScreen = ({route}) => {
  const {user,chat,updatechat,reqs,setreqs,questions,setquestions,set_chat,set_ws}=useAppContext();
  const pgid=route.params.data[0];

  useEffect(()=>{

    let tmp=JSON.parse(user)

    fetch('http://192.168.29.186:8080/paymentreqs', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+tmp.token},
    body: JSON.stringify({pgid:pgid})})
    .then(response => response.json()).then((data)=>{setreqs(data)})
    .catch(error => console.error('Error:', error));

    fetch('http://192.168.29.186:8080/questions', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+tmp.token},
    body: JSON.stringify({pgid:pgid,type:'owner_receiving',receiver:tmp.username})})
    .then(response => response.json()).then((data)=>{setquestions(data['msg'])})
    .catch(error => console.error('Error:', error));

    const new_ws=new WebSocket('ws://192.168.29.186:8080/chat/'+tmp.username+"_"+pgid+'/');

    new_ws.onmessage = function(e) {
      var cur_msg = JSON.parse(e.data);
        updatechat(cur_msg);
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
      <Tab.Screen name="Home" component={OwnerHomeScreen} initialParams={{data:route.params.data,DelData:route.params.DelData}} options={{tabBarIcon: ({ color, size }) => (<Icon name="home" size={size} color={color} />)}}/>
      <Tab.Screen name="Chats" component={ChatScreen} initialParams={{pgid:pgid,owner:true,owner_uname:JSON.parse(user).username+'_'+pgid}} options={{tabBarIcon: ({ color, size }) => (<Icon name="wechat" size={size} color={color} />), tabBarBadge:Object.keys(chat).length===0?null:Object.keys(chat).length}}/>
      <Tab.Screen name="notifications" component={NotificationScreen} initialParams={{pgid:pgid}} options={{tabBarIcon: ({ color, size }) => (<Icon name="bell" size={size} color={color} />), tabBarBadge:reqs.length===0?null:reqs.length}} />
      <Tab.Screen name="Questions" component={QuestionsScreen} initialParams={{pgid:pgid,pgname:route.params.data[1]}} options={{tabBarIcon: ({ color, size }) => (<Icon name="question-circle" size={size} color={color} />), tabBarBadge:questions.length===0?null:questions.length}}/>
    </Tab.Navigator>
  );
};

export default OwnerTabScreen;