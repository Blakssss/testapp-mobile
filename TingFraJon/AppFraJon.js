import { app, database } from '../firebase'
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, FlatList, Button, View, TextInput, Text } from 'react-native';
import { useCollection } from 'react-firebase-hooks/firestore'; //install with: $ npm install react-firebase-hooks


export default function App() {
  const [text, setText] = useState('')
  const [editObj, setEditObj] = useState(null)
  const [values, loading, error] = useCollection(collection(database, "notes"))
  const data = values?.docs.map((doc) => ({...doc.data(), id: doc.id}))
  
  async function buttonHandler(){
    try{
    await addDoc(collection(database, "notes"), {
      text: text
    })
    }catch(err){
      console.log("fejl i DB " + err)
    }
  }

  async function deleteDocument(id){
      await deleteDoc(doc(database, "notes", id))
  }

  function viewUpdateDialog(item){
    // få noget at blive synligt
    setEditObj(item)
  }

  async function saveUpdate(){
      await updateDoc(doc(database, "notes", editObj.id), {
        text: text
      })
      setText("")
      setEditObj(null)
  }

  return (
    <View style={styles.container}>
      { editObj && 
        <View>
          <TextInput defaultValue={editObj.text} onChangeText={(txt) => setText(txt)} />
          <Text onPress={saveUpdate}>Save</Text>
        </View> 
      }

      <TextInput style={styles.textInput}  onChangeText={(txt) => setText(txt)} />
      <Button title='Press Me' onPress={buttonHandler} ></Button>
      <FlatList
        data={data}
        renderItem={(note) => 
          <View>
            <Text>{note.item.text}</Text>
            <Text onPress={() => deleteDocument(note.item.id)}>Delete</Text>
            <Text onPress={() => viewUpdateDialog(note.item)}>Update</Text>
          </View>
      }
      />
      <StatusBar style="auto" />
    </View>
  );
}

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