import { View, Text,ScrollView } from 'react-native'
import { getAuth } from 'firebase/auth'
import { db } from '../FirebaseConfig'
import{doc,getDoc} from 'firebase/firestore'
import { useState,useEffect } from 'react'
function NomineeBackGroundScreen({route})
{
  const {nominee} = route.params
const [backgrounds,setBackgrounds] = useState("");
useEffect( ()=>{
  async function fetchHandler()
  {
    try{
      const docRef = doc(db,'nominations',nominee.id);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists())
      {
        const data = docSnap.data();
        setBackgrounds(data.background || "Candidate didnt fill any Backgrounds!")
      }
      else{
        setBackgrounds("No Nominee Background Found!")
      }
    }
    catch(error)
    {
      console.log(error)
    }
  };
  fetchHandler();
}
,[]
) ;

return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Backgrounds
      </Text>
      <Text>{backgrounds}</Text>
    </ScrollView>
  );


}
export default NomineeBackGroundScreen;