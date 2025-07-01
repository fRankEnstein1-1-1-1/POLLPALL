import { View, TextInput, StyleSheet, Alert } from 'react-native';
import Header from "../Components/Header";
import SubmitButton from '../Buttons/SubmitButton';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { useState } from 'react';
import { getAuth } from 'firebase/auth';

function NBack({ navigation }) {
  const [background, setBackground] = useState("");
 

  const handleSubmit = async () => {
 const auth = getAuth();
  const uid = auth.currentUser?.uid;

    if (!uid) {
      console.error("No user logged in");
      return;
    }

    try {
      // Query the nominations collection to find the user's document
      const nominationsRef = collection(db, "nominations");
      const q = query(nominationsRef, where("userId", "==", uid)); // assuming you stored userId while creating nomination
      
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error("No nomination found for this user.");
        Alert.alert("Error", "No nomination found.");
        return;
      }

      const docRef = querySnapshot.docs[0].ref; // get the document reference

      // Update the background field
      await updateDoc(docRef, {
        background: background,
      });

      console.log("Background added to nomination!");
      console.log("Background:", background);

      navigation.navigate("NAchievement");
    } catch (error) {
      console.error("Error updating background:", error);
      Alert.alert("Error", "Failed to update background. Please try again.");
    }
  };

  return (
    <>
      <Header title="BackGround" subtitle="Provide Your Background" />
      <View style={{ flex: 1, backgroundColor: "#ededed" }}>
        <TextInput
          style={styles.Inputarea}
          placeholder='Type your background here...'
          multiline={true}
          textAlign='top'
          value={background}
          onChangeText={setBackground}
        />
      </View>
      <SubmitButton navigation={navigation} Name="Next" onPress={handleSubmit} />
    </>
  );
}
export default NBack;
const styles= StyleSheet.create({
    Inputarea:{
        padding:32,
        margin:32,
        flex:1,
        height:500,
    borderRadius:20,
    elevation:12,
        backgroundColor:"#fafafa",
        textAlignVertical:"top",
    }
}
)