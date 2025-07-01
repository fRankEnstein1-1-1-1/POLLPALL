import Header from "../Components/Header"; 
import { View,TextInput,StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import SubmitButton from "../Buttons/SubmitButton";
import { useState } from "react";
function NPromises({navigation})
{
      const [promises, setPromises] = useState("");
     
    
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
            promises: promises,
          });
    
          console.log("promises added to nomination!");
          console.log("Promises:", promises);
    
          navigation.navigate("Promises");
        } catch (error) {
          console.error("Error updating background:", error);
          Alert.alert("Error", "Failed to update background. Please try again.");
        }
      };
    
    return<>
     <Header title = "Promises"  subtitle = "Provide Your Promises"  />
        <View style = {{flex:1,backgroundColor:"ededed"}}>
            <TextInput style = {styles.Inputarea} placeholder='Type here...' multiline={true} textAlign='top' value={promises} onChangeText={setPromises} />
        </View>
        <SubmitButton  navigation = {navigation} Name = "Submit"  onPress={handleSubmit} />
    </>
}
export default NPromises
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