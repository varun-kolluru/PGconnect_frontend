import React, { createContext, useContext, useState,useEffect } from 'react';
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import Chat from '../model/Chat';
import migrations from '../model/migrations';
import schema from '../model/schema';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: Platform.OS === 'ios',
  onSetUpError: error => {
    console.log(error);
  },
  dbName:'DataBase2'
})

const db = new Database({
  adapter,
  modelClasses: [Chat],
})

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [chat, setchat] = useState({});
  const [user,setuser]= useState({});
  const [reqs,setreqs]=useState([]);
  const [ws,setws]=useState();
  const [questions,setquestions]=useState([]);


const updatechat = (new_data) => {             /*{sender:[{msg1,ts1},{msg2,ts2}]} */
  setchat((prevChat) => {
    const updatedChat = { ...prevChat };                          

    Object.keys(new_data).forEach((sender) => {
      updatedChat[sender] = (updatedChat[sender] || []).concat(new_data[sender]);
    });
    return updatedChat;
  });
};

const removechat = (key) => {
  setchat((prevChat) => {
    const updatedChat = { ...prevChat };
    delete updatedChat[key];
    return updatedChat;  
  });
};

const remove_req=(idx)=>{
  setreqs((prevreq)=>{
  var t=[]
  for(let i=0;i<reqs.length;i++){
    if(i!=idx){
      t.push(reqs[i])
    }
  }
  return t 
  });
}

const remove_question=(idx)=>{
  setquestions((prevques)=>{
    var tmp_q=[]
    for(let i=0;i<questions.length;i++){
      if(i!=idx){
        tmp_q.push(questions[i])
      }
    } 
    return tmp_q 
    });
}

const set_chat=(data)=>{
  setchat(data);
}

const set_ws=(data)=>{
  setws(data);
}

  return (
    <AppContext.Provider value={{ chat,set_chat,ws,set_ws, updatechat,removechat,user,setuser,reqs,remove_req,setreqs,questions,setquestions,remove_question,db}}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext };