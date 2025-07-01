import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import NImageScreen from '../Screens/NImageScreen.js';
import NBack from '../Screens/NBack.js';
import NAchievements from '../Screens/NAchievements.js';
import NPromises from '../Screens/NPromises.js';
import StatusScreen from '../Screens/StatusScreen.js';
import { useState, useEffect } from 'react';

const Stack = createNativeStackNavigator();

function NomInputNav() {
  const [isPending, setIsPending] = useState(false); // track if application is pending

  useEffect(() => {
    const fetchNominationStatus = async () => {
      try {
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        console.log("ispending",isPending)
        if (!uid) {
          console.log("Error: No user is logged in");
          return;
        }

        const nominationsRef = collection(db, "nominations");
        const q = query(nominationsRef, where("userId", "==", uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No nomination found.");
        }
         else {
          const data = querySnapshot.docs[0].data();
          const { isPending, isNominee } = data;

          // Set the state for the pending status
          setIsPending(isPending);

      
        }
      } catch (error) {
        console.log("Error fetching nomination status:", error);
      }
    };

    fetchNominationStatus();
  }, []); // Run this effect when the component mounts

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
     {isPending ? (
        <Stack.Screen name="Status" component={StatusScreen} />
      ) : (
        <>
          <Stack.Screen name="image" component={NImageScreen} />
          <Stack.Screen name="Nback" component={NBack} />
          <Stack.Screen name="NAchievement" component={NAchievements} />
          <Stack.Screen name="Promises" component={NPromises} />
          <Stack.Screen name="Status" component={StatusScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default NomInputNav;
