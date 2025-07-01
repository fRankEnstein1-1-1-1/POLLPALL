 import Header from "../Components/Header"; 
import { View,TextInput,StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import SubmitButton from "../Buttons/SubmitButton";
import { useState } from "react";
function NAchievements({navigation})
{
      const [achievements, setAchievements] = useState("");
     
    
      const handleSubmit = async () => {
    
    console.log("Button Clicked!")
       
        try {
          // Query the nominations collection to find the user's document
           const auth = getAuth();
      const uid = auth.currentUser?.uid;
 if (!uid) {
          console.error("No user logged in");
          return;
        }
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
            achievements: achievements,
          });
    
          console.log("Achievements added to nomination!");
          console.log("achievements:", achievements);
    
          navigation.navigate("Promises");
        } catch (error) {
          console.error("Error updating background:", error);
          Alert.alert("Error", "Failed to update background. Please try again.");
        }
      };
    
    return<>
     <Header title = "Achievements"  subtitle = "Provide Your Achievements"  />
        <View style = {{flex:1,backgroundColor:"ededed"}}>
            <TextInput style = {styles.Inputarea} placeholder='Type here...' multiline={true} textAlign='top' value={achievements} onChangeText={setAchievements} />
        </View>
        <SubmitButton  navigation = {navigation} Name = "Next"  onPress={handleSubmit} />
    </>
}
export default NAchievements;
const styles = StyleSheet.create({
    Inputarea:{
        flex:1,
        margin:32,
        padding:20,
        backgroundColor:"#fafafa",
        height:500,
        elevation:12,
        borderRadius:20,
        textAlignVertical:'top'
    }
})