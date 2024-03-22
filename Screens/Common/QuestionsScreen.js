import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput } from "react-native";
import { useAppContext } from "../AppContext";

const h = Dimensions.get("window").height;
const w = Dimensions.get("window").width;

const QuestionsScreen=({ route, navigation })=>{
    const {user,questions,setquestions,remove_question}=useAppContext();
    const [ipvalues,setipvalues]=useState([]);
    
    useEffect(()=>{
        var tmp=[]
        for(let i=0;i<questions.length;i++){
          tmp.push('')
        }
        setipvalues(tmp);
    },[])

    const changetxt=(txt,index)=>{
        const tmp1=[...ipvalues]
        tmp1[index]=txt;
        setipvalues(tmp1);
    }

    const remove_ipvalue=(idx)=>{
      setipvalues(prev => prev.filter((_, i) => i !== idx));
    }

    const handlesubmit=(res,idx)=>{
        if(ipvalues[idx].length===0){return alert("cannot send empty msg")}
        remove_ipvalue(idx);
        remove_question(idx);
        const tmp={pgid:route.params.pgid,type:'owner_sending',sender:JSON.parse(user).username,receiver:res,index:idx,msg:ipvalues[idx],pgname:route.params.pgname}

        fetch('http://192.168.29.186:8080/questions', {method: 'POST',headers: {'Content-Type': 'application/json','Authorization': 'Token '+JSON.parse(user).token},
        body: JSON.stringify(tmp)})
        .then(response => response.json()).then((data)=>{console.log(data);remove_question(idx);}) 
        .catch(error => console.error('Error:', error));
    }

    return ( 
        <View style={styles.container}>
          <Text style={styles.title}>Questions from PG Searchers</Text>
          <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom: h*0.05}}>
            {questions.map((item, index) => (
                <View style={styles.msgbox} key={index}>
                    <Text style={styles.msghead}>{item[1]}</Text>
                    <TextInput multiline value={item[0]} style={{height:h*0.06,color:"black"}} editable={false}/>
                    <View style={styles.ipbox}>
                    <TextInput multiline style={styles.ip} value={ipvalues[index]} onChangeText={(txt)=>changetxt(txt,index)} placeholder="Type your reply"/>
                    <TouchableOpacity multiline value={item[0]} style={styles.btn} onPress={()=>handlesubmit(item[1],index)}>
                        <Text style={{color:"white"}}>Reply</Text>
                    </TouchableOpacity>
                    </View>  
                </View>
            ))}
          </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      padding: h * 0.02,
      height:h*0.75,
    },
    title: {
      fontSize: h * 0.04,
      fontWeight: 'bold',
      marginBottom: h * 0.02,
      paddingTop:h*0.05,
      color:"black"
    },
    msgbox:{
      backgroundColor:'rgba(0,0,0,0.1)',
      height:h*0.15,
      marginVertical:w*0.02,
    },
    msghead:{
      height:h*0.03,
      fontWeight:"bold",
      backgroundColor:"black",
      color:"white",  
    },
    ipbox:{
        height:h*0.06,
        flexDirection:"row",
    },
    ip:{
        flex:0.75,
        backgroundColor:'white'
    },
    btn:{
        flex:0.25,
        backgroundColor:'black',
        alignItems:'center',
        justifyContent:"center"
    }
})

export default QuestionsScreen;