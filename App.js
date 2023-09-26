import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Keyboard } from 'react-native';
import { useState } from 'react';
import { StyleSheet,note , FlatList, View, TextInput, Text, Image, Button, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import {getStorage, ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage';
import { app, database, storage } from './firebase'
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect } from 'react';



export default function App() {
  
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name="HomePage" component={Home} />
        <Stack.Screen name="Notes" component={Notes} />
      </Stack.Navigator>
    </NavigationContainer>
    );
}

///////////////////////////////////////////////HOME/////////////////////////////////////////////////////

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
            <TouchableOpacity onPress={() => navigation.navigate('Notes', { id: item.id, text: item.text, headline: item.headline })}>
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
//////////////////////////////////////////////NOTES/////////////////////////////////////////////////

export function Notes({ route }) {

    const { headline } = route.params;
    const [note, setNote] = useState('');
    const [notesList, setNotesList] = useState([]);
    const [imagePath, setImagePath] = useState(null);
    const [editObj, setEditObj] = useState(null)
    
  
   
  /////////////////////////////////////TAKING PICTURES WITH CAMERA///////////////////////////////////////
    async function launchCamera(){
    console.log('launchCamera Current editObj:', editObj);
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
                const timestamp = new Date().getTime(); // Generating a timestamp
                setEditObj({ id: timestamp.toString() }); // Using timestamp as id for editObj
            }
        })
        .catch((error) => alert("fejl i kammeraet " + error))
    )
  }

  ///////////////////////////////////////CHOOSE IMAGE FROM LIBRARY/////////////////////////////////////////
    async function pickImage(){
      console.log(' pick image Current editObj:', editObj);
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    })
    if(!result.canceled){
      setImagePath(result.assets[0].uri)
      setEditObj({ id: headline }); // Using timestamp as id for editObj

    }
  }

  /////////////////////////////////////////////UPLOAD IMAGE////////////////////////////////////////////////
    async function uploadImage(){
      console.log('upladeImage Current editObj:', editObj);

      if (!editObj) {
        alert("No object selected for editing");
        return;
    }
    const res = await fetch(imagePath)
    const blob = await res.blob()
    const storage = getStorage();
    const storageRef = ref(storage, editObj.id + ".jpg")
  
    try {
      await uploadBytes(storageRef, blob);

      alert("image uploaded");
      
      // Set the latest ID in Firestore
      const latestRef = doc(database, "latest", "imageID");
      await setDoc(latestRef, { id: editObj.id }, { merge: true });

  } catch (error) {
      console.error("Error uploading image or updating latest image ID:", error);
  }
  }
  ///////////////////////////////////////SAVE IMAGE AND NOTE//////////////////////////////////////////////////
  async function saveUpdate(){
    console.log(' saveupdate Current editObj:', editObj);
    const docRef = doc(database, "notes", editObj.id);

    await setDoc(docRef, { text: note }, { merge: true });

    if(imagePath){
      uploadImage()
    }
}

////////////////////////////////////////////////DOWNLOAD IMAGE TO APP///////////////////////////////////
async function downloadImage() {
  try {
      // Get reference to the image in Firebase Storage using headline
      const storage = getStorage();
      const imageRef = ref(storage, headline + ".jpg");
          
      // Get the download URL for the image
      const url = await getDownloadURL(imageRef);
      
      setImagePath(url);
  } catch (error) {
      console.error("Error fetching image:", error);
  }
}

///////////////////////////////////////////////////ADD NEW NOTE//////////////////////////////////////////////
  const addNote = () => {
    if (note.trim() !== '') {
      setNotesList([...notesList, note]);
      Keyboard.dismiss();
    }
  };

//////////////////////////////////////RERTURN WITH VIEW AND ALL IT CONTAINS//////////////////////////////////    
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



  ///////////////////////////////////////////////STYLESHEET//////////////////////////////////////////////
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

  const notepadStyle = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    notepadContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    noteInput: {
      marginTop: 30,
      height: 50,
      borderColor: 'gray',
      borderWidth: 1,
      marginRight: 2,
      padding: 8,
      borderRadius: 10,
    },
    notesList: {
      flex: 1,
    },
    noteItem: {
      padding: 8,
      borderBottomWidth: 1,
      borderColor: 'lightgray',
    },
    noteContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between", // Place text and button at each end of the row
      marginBottom: 16,
    },
    noteText: {
      flex: 1, // Expand to take remaining space
      marginRight: 8, // Add some spacing between text and button
    },
    deleteButton: {
      backgroundColor: "darkblue", // Dark blue background
      padding: 10, // Adjust padding as needed for the desired size
      borderRadius: 50, // Make it round by setting a large border radius
    },
    deleteButtonText: {
      color: "white", 
    },
  });
  
