import { View, Text,ScrollView } from 'react-native'
import { getAuth } from 'firebase/auth'
import { db } from '../FirebaseConfig'
import{doc,getDoc} from 'firebase/firestore'
import { useState,useEffect } from 'react'
function NomineeAchievementsScreen({route})
{
  const {nominee} = route.params
const [Acheivements,setAcheivements] = useState("");
useEffect( ()=>{
  async function fetchHandler()
  {
    try{
      const docRef = doc(db,'nominations',nominee.id);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists())
      {
        const data = docSnap.data();
        setAcheivements(data.achievements || "Candidate didnt fill any Backgrounds!")
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
        Achievements
      </Text>
      <Text>{Acheivements}</Text>
    </ScrollView>
  );


}
export default NomineeAchievementsScreen;