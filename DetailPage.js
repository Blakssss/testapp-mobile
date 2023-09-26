import { Keyboard } from 'react-native';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { StyleSheet, FlatList, View, TextInput, Text, Image, Button, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import {getStorage, ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage';
import { app, database, storage } from './firebase'

function Notes({ route }) {

    const { headline } = route.params;
    const [note, setNote] = useState('');
    const [notesList, setNotesList] = useState([]);
    const [imagePath, setImagePath] = useState(null);
    const [editObj, setEditObj] = useState(null)
    
  
    async function saveUpdate(){
      await updateDoc(doc(database, "notes", editObj.id), {
        text: text
      })
      if(imagePath){
        uploadImage()
      }
      setText("")
      setEditObj(null)
  }
  async function launchCamera(){
    const result = ImagePicker.requestCameraPermissionsAsync()
    if(result.granted===false){
        alert("access not provided")
    }else(
        ImagePicker.launchCameraAsync({
            quality:1 // ikke nødvendigt
        })
        .then((response) => {
            if(!response.canceled){
                setImagePath(response.assets[0].uri)
            }
        })
        .catch((error) => alert("fejl i kammeraet " + error))
    )
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
    const addNote = () => {
      if (note.trim() !== '') {
        setNotesList([...notesList, note]);
        setNote('');
        Keyboard.dismiss();
      }
    };

    async function downloadImage(){
      const storage = getStorage();
      getDownloadURL(ref(storage, editObj.id + ".jpg"))
      .then((url) => {
        setImagePath(url)
      })
    }
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={notepadStyle.container}>
        <Text style={notepadStyle.title}>{headline}</Text>
        <Image style={{width:200, height:200, justifyContent: 'center'}} source={{uri:imagePath}}/>
        <Button title= 'Pick image from Pictures' onPress={pickImage}/>
        <Button title= 'Take Picture' onPress={launchCamera}/>
        <Button title= 'Upload image' onPress={saveUpdate}/>
        <Button title= 'Download image' onPress={downloadImage}/>
  
        <View style={notepadStyle.notepadContainer}>
          <TextInput
            style={notepadStyle.noteInput}
            placeholder="Add a note..."
            onChangeText={(text) => setNote(text)}
            value={note}
            multiline={true}
          />
          <Button title="Add" onPress={addNote} />
        </View>
        <ScrollView style={notepadStyle.notesList}>
          {notesList.map((item, index) => (
            <View key={index} style={notepadStyle.noteItem}>
              <Text>{item}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      </TouchableWithoutFeedback>
    );
  }
