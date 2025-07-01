import * as LocalAuthentication from "expo-local-authentication";
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';

function SubmitButton({ navigation, Name, onPress }) {
  async function handleFingerprintAuth() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    console.log("Taking Fingerprint!");

    if (!hasHardware) {
      Alert.alert("Error", "No fingerprint scanner found!");
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert("Error", "You are not recognized, you can't proceed!");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Scan your fingerprint to continue",
      fallbackLabel: "Use Passcode",
    });

    if (result.success) {
      Alert.alert("Success", "Authentication Successful!");
      // onPress && onPress(); // call the function from parent
    } else {
      Alert.alert("Failed", "Authentication Failed");
    }
    navigation.navigate('Status');
  }

  function ExitHandler() {
    if (Name === "Submit") {
      onPress && onPress();
      Alert.alert("Submit", "Are you sure to submit?", [
        { text: 'Submit', onPress: handleFingerprintAuth, style: 'destructive' },
        { text: 'Cancel', style: 'cancel' }
      ]);
    } else {
      console.log("Triggered")
      console.log("onpress",onPress)
      onPress && onPress();
    }
  }

  return (
    <View>
      <Pressable onPress={ExitHandler} style={styles.ButtonContainer}>
        <Text style={styles.textContainer}>{Name}</Text>
      </Pressable>
    </View>
  );
}
 export default SubmitButton;
 const styles = StyleSheet.create({
    ButtonContainer:{
        backgroundColor:'red',
        elevation:33,
        width:'55%',
        alignSelf:'center',
        padding:16,
        margin:24,
        borderRadius:35,
    },
    textContainer:{
        letterSpacing:-0.5,
        color:'white',
        fontWeight:'bold',
        fontSize:18,
        textAlign:'center',
    }
 })