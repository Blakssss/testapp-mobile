import { useState } from 'react';
import { StyleSheet, FlatList, View, TextInput, Text, Image, Button, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';


export function Home({navigation,route}){
    const [text, setText] = useState('')
    const [list, setList] = useState([])
    
  
    function addBtnPressed(){
      setList([...list,{headline:text, expanded: false}]);
      setText(''); 
    }
    return(
      <View style={notepadStyle.container}>
        <TextInput placeholder='Ny Note' onChangeText={(txt)=>setText(txt)}/>
        <Button title='Add' onPress={addBtnPressed}></Button>
        <FlatList
          style={styles.listItem}
          data={list}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Notes',{id: note.item.id,text: note.item.text} )}>
              <View>
                <Text style={styles.headline}>{item.headline}</Text>
                {item.expanded && <Text style={styles.expandedText}>{item.headline}</Text>}
              </View>
            </TouchableOpacity>
           )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }

  /////////////////////////////////////STYLESHEET//////////////////////////////////////////////
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop:200
    },
    textInput:{
      backgroundColor:'lightblue',
      minWidth: 200
    }
  });
