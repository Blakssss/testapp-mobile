/*
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, TextInput, navigation } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function App({navigation}) {
  return (
    <View style={styles.container}>
      
      <Text style={{ fontSize: 20 }}>Make a new note</Text>
      <View style={styles.button}>
      <Button title='Contact Information' onPress={() => navigation.navigate('Notes.js')}>
      </Button>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Notes" component={NotesScreen} /> {}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC0CB',
    alignItems: 'center',
    justifyContent: 'center',
    Text: 200,
  },
  button: {
    width: 200,
    height: 40,
    alignItems: 'center',
    backgroundColor: 'lightblue', // Set the background color to white
    borderWidth: 2,
    borderColor: 'black', // Add a border color if needed
  },

 
});
*/
// ALT OVENOVER ER BUSINESSCARD APPEN
/*

import React, { useState } from 'react';
import {StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


export default function App() {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Notes" component={Notes} />
      </Stack.Navigator>
    </NavigationContainer>);
        
}

function Home({navigation,route}){

  const [text, setText] = useState('')
  const [list, setList] = useState([])
  
  function toggleExpanded(index){
    const updatedList = [...list];
    updatedList[index].expanded = !updatedList[index].expanded
    setList(updatedList)
  }

  function addBtnPressed(){
    console.log("shiiit worked" + text)
    setList([...list,{headline:text, expanded: false}]);
    setText(''); 
    console.log("hello" + list)
  }
  return(
    <View style={styles.container}>
      <TextInput placeholder='Ny Note' onChangeText={(txt)=>setText(txt)}/>
      <Button title='Add' onPress={addBtnPressed}></Button>
      <FlatList
        style={styles.listItem}
        data={list}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Notes', { headline: item.headline })}>
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

function Notes({ route }) {
  const { headline } = route.params;
  const [note, setNote] = useState('');
  const [notesList, setNotesList] = useState([]);

  // Function to add a new note
  const addNote = () => {
    if (note.trim() !== '') {
      setNotesList([...notesList, note]);
      setNote('');
    }
  };

  return (
    <View style={notepadStyle.container}>
      <Text style={notepadStyle.title}>{headline}</Text>
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
  );
}
//ALT OVENOVER HER ER NOTEBOOK APP
*/




   







//TIDLIGERE VERSION AF NOTEPAD, HVOR VI TAGER TITLEN PÅ VORES KNAP OG BRUGER NAVIGATE TIL AT OVERFØRE DEN TIL EN NY SIDE
import React, { useState } from 'react';
import {StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, ScrollView, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import {getStorage, ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage';
import { app, database, storage } from '../firebase'


export default function App() {
  const Stack = createNativeStackNavigator();
  const [imagePath, setImagePath] = useState(null);
  const [editObj, setEditObj] = useState(null)


  async function pickImage(){
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true
    })
    if(!result.canceled){
      setImagePath(result.assets[0].uri)
    }
  }
  async function uploadImage(){
        const res = await fetch(imagePath);
        const blob = await res.blob();
        const storage = getStorage();
        const storageRef = ref(storage, editObj.id + ".jpg");
  
        uploadBytes(storageRef, blob).then((snapshot) => {
          alert("Image uploaded");
        });
     
  }
  async function downloadImage(){
    const storage = getStorage();
    getDownloadURL(ref(storage, editObj.id + ".jpg"))
    .then((url) => {
      setImagePath(url)
    })
  }
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
  const DetailPage = ({navigation, route}) => {
    const message = route.params?.message
  
    return (
      <View>
        <Text>Detaljer... {message.name}</Text>
        <Image style={{width:200, height:200, justifyContent: 'center'}} source={{uri:imagePath}}/>
              <Button title= 'Pick image' onPress={pickImage}/>
              <Button title= 'Upload image' onPress={uploadImage}/>
              <Button title= 'Download image' onPress={downloadImage}/>
      </View>
    )
  }
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
          name="ListPage" 
          component={ListPage} 
          />
          <Stack.Screen 
          name="DetailPage" 
          component={DetailPage} 
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
   
}

const ListPage = ({navigation, route}) => {
  const myList = [{key:'1', name:'Anna'},{key:'2', name:'Bob'}]
  function handleButton(item){
  navigation.navigate('DetailPage',{message:item})
  }
  return (
    <View>
      <Text></Text>
      <FlatList
      data={myList}
      renderItem={(note)  => <Button title={note.item.name} onPress={()=>handleButton(note.item)} />}
      />
    </View>
  )
}







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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  list: {
    width: '100%',
  },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expandedText: {
    marginTop: 10,
    color: '#666',
  },
});