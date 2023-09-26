import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, View } from "react-native";

export default function App() {
    function buttonHandler(){
        alert("Death is here");

    }

    return(
        <View style={styles.container}>
            <Button title= 'Press Me' onPress={buttonHandler} ></Button>
            <StatusBar style="auto"></StatusBar>
            </View>
    );
}