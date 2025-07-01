import Header from '../Components/Header';
import PreviousElectionsScreen from '../Components/PreviousElectionsScreen';
import UpcomingElectionsScreen from '../Components/UpcomingElectionsScreen';
import { StyleSheet, Text, SafeAreaView, View, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../FirebaseConfig';
import { useEffect, useState } from 'react';
import CurrentElectionsScreen from '../Components/CurrentElectionsScreen';
function HomeScreen() {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserName();
  }, []);

  

  
  const dummy = [{ key: 'content' }];

  return (
    <>
    <Header title={userName? `Welcome ${userName} ` : `Welcome` } subtitle={"Your Voice Matters!"}/>
     
    <View style={styles.Maincontainer}>
      <StatusBar style="light" />
      
      <FlatList
        data={dummy}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={
          <> 
            <CurrentElectionsScreen/>
            <PreviousElectionsScreen />
            <UpcomingElectionsScreen />
         </>
        }
        contentContainerStyle={styles.contentContainer}
      />
    </View> </>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  Maincontainer: {
    flex: 1,
    backgroundColor: 'white',
    padding:12,

  },
  container: {
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 60,
  },
  winnercontainer:{
    flex:1
  }
});
