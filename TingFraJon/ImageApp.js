import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, FlatList, Button, View, TextInput, Text, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {getStorage, ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage';
import { app, database, storage } from '../firebase'


export default function App() {
  const [text, setText] = useState('')
  const [notes, setNotes] = useState([])
  const [editObj, setEditObj] = useState(null)
  const [imagePath, setImagePath] = useState(null);


  
  function buttonHandler(){
    setNotes([...notes, {key:notes.length, name:text}])   
  }


  async function pickImage(){
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    })
    if(!result.canceled){
      setImagePath(result.assets[0].uri)
    }
  }
  async function uploadImage(){
    const res = await fetch(imagePath)
    const blob = await res.blob()
    const storage = getStorage();
    const storageRef = ref(storage, editObj.id + ".jpg")

    uploadBytes(storageRef, blob).then((snapshot) => {
        alert("image uploaded")
    })
  }
  async function downloadImage(){
    const storage = getStorage();
    getDownloadURL(ref(storage, editObj.id + ".jpg"))
    .then((url) => {
      setImagePath(url)
    })
  }
  async function deleteImage(){
    const storage = getStorage();
    const imageRef = ref(storage, editObj.id + ".jpg");
      await deleteObject(imageRef);
      alert('Image deleted successfully');
      setImagePath(null);
  }
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      { editObj && 
        <View>
          <TextInput defaultValue={editObj.text} onChangeText={(txt) => setText(txt)} />
          <Text onPress={saveUpdate}>Save</Text>
        </View> 
      }
      <TextInput style={styles.textInput}  onChangeText={(txt) => setText(txt)} />
      <Button title='Press Me' onPress={buttonHandler} ></Button>
      <FlatList
        data={notes}
        renderItem={(note) => 
          <View>
            <Text>{note.item.name}</Text>
          </View>
      }
      />
        <Image style={{width:200, height:200, justifyContent: 'center'}} source={{uri:imagePath}}/>
            <Button title= 'Pick image' onPress={pickImage}/>
            <Button title= 'Upload image' onPress={uploadImage}/>
            <Button title= 'Download image' onPress={downloadImage}/>
            <Button title= 'Delete image' onPress={deleteImage}/>

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