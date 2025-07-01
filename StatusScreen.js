import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { useEffect, useState } from 'react';
import Header from '../Components/Header';

function StatusScreen() {
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const auth = getAuth();
        const uid = auth.currentUser?.uid;

        if (!uid) {
          Alert.alert("Error", "No user is logged in");
          return;
        }

        const nominationsRef = collection(db, "nominations");
        const q = query(nominationsRef, where("userId", "==", uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setStatusMessage("No application found.");
        } else {
          const data = querySnapshot.docs[0].data();
          const { isPending, isNominee } = data;

          if (isPending) {
            setStatusMessage("⏳ Your application is still pending.");
          } else if (isNominee) {
            setStatusMessage("✅ Congratulations! You have been accepted as a nominee.");
          } else {
            setStatusMessage("❌ Sorry, you were not selected as a nominee.");
          }
        }
      } catch (error) {
        console.error("Error fetching status:", error);
        Alert.alert("Error", "Failed to fetch status.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <>
      <Header title="Status" subtitle="Check your nomination status" />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : (
          <Text style={styles.statusText}>{statusMessage}</Text>
        )}
      </View>
    </>
  );
}

export default StatusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ededed',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});
