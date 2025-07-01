import { Pressable, View, Text, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { auth } from '../FirebaseConfig';
import { increment } from 'firebase/firestore';
import { useState, useEffect } from 'react';

function VoteButton({ nomineeId, nomineePosition }) {
  const db = getFirestore();
  const [electionId, setElectionId] = useState(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false); // 🔥 new state

  useEffect(() => {
    const fetchElectionAndVoteStatus = async () => {
      try {
        const snapshot = await getDocs(collection(db, "elections"));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let matchedElectionId = null;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const startDate = new Date(data.startDate);
          const endDate = new Date(data.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);

          if (today >= startDate && today <= endDate && data.position === nomineePosition) {
            matchedElectionId = docSnap.id;
          }
        });

        if (!matchedElectionId) {
          console.log("No matching election today for this position");
          return;
        }

        setElectionId(matchedElectionId);

        // 🔥 Check if user already voted
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.hasVotes && userData.hasVotes[matchedElectionId]) {
              console.log("User already voted for this election");
              setAlreadyVoted(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching election or user vote status:", error);
      }
    };

    fetchElectionAndVoteStatus();
  }, [nomineePosition]);

  async function handleVote() {
    if (!electionId) {
      Alert.alert("Error", "No active election found");
      return;
    }

    if (alreadyVoted) {
      Alert.alert("Cheater 😡", "You have already voted in this election!");
      return;
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert("Error", "No fingerprint scanner found!");
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert("Error", "You are not recognized. You can't vote!");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Scan your fingerprint to continue",
      fallbackLabel: "Use Passcode",
    });

    if (result.success) {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);

      try {
        // ✅ Update hasVotes
        await updateDoc(userDocRef, {
          [`hasVotes.${electionId}`]: true,
        });

        // ✅ Increment votes
        const nomineeDocRef = doc(db, 'nominations', nomineeId);
        await updateDoc(nomineeDocRef, {
          votes: increment(1),
        });

        setAlreadyVoted(true); // 🔥 So button is disabled now

        Alert.alert("Success 🎉", "Your vote has been recorded!");
      } catch (error) {
        console.error("Voting error:", error);
        Alert.alert("Error", "Voting failed. Try again later.");
      }
    } else {
      Alert.alert("Failed", "Authentication Failed");
    }
  }

  function confirmVote() {
    if (!electionId) {
      Alert.alert("Error", "Election is not ready. Try again later.");
      return;
    }

    if (alreadyVoted) {
      Alert.alert("Cheater 😡", "You have already voted!");
      return;
    }

    Alert.alert(
      "Caution ⚠️",
      "You are about to vote for this candidate",
      [
        { text: "OK", onPress: handleVote, style: 'destructive' },
        {
          text: 'Cancel',
          onPress: () => {
            Alert.alert('Returned', "You didn't vote for this candidate!", [
              { text: 'ok', style: 'cancel' }
            ]);
          },
          style: 'cancel'
        }
      ]
    );
  }
  return (
    <View>
      <Pressable style={styles.ButtonContainer} onPress={confirmVote}>
        <Text style={styles.textContainer}>Vote</Text>
      </Pressable>
    </View>
  );
}

export default VoteButton;

const styles = StyleSheet.create({
  ButtonContainer: {
    backgroundColor: '#028a0f',
    elevation: 33,
    width: '55%',
    alignSelf: 'center',
    padding: 16,
    margin: 24,
    borderRadius: 35,
  },
  textContainer: {
    letterSpacing: -0.5,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
  }
});
