import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
       <Image
        source={require('./assets/maersk2.png')}
        style={{width: 300, height: 300}}
      />
      <Text style={{ fontSize: 20 }}>Welcome to the Mærsk Business Card</Text>
      <View style={styles.button}>
      <Button title='Contact Information'>
      </Button>
      </View>
      <StatusBar style="auto" />
    </View>
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
