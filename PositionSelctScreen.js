import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../Components/Header";
import { db } from "../FirebaseConfig"; // Adjust this import to your path
import { collection, getDocs ,doc,updateDoc,getDoc} from "firebase/firestore";
import { auth } from "../FirebaseConfig";


export default function PositionSelectScreen({ navigation }) {
  const [positions, setPositions] = useState([]);
  const [hasVotes, setHasVotes] = useState({}); // <-- new state

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "elections"));
        const validPositions = [];
  
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        const electionsToday = {}; // this will only store today's elections
  
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const startDate = new Date(data.startDate);
          const endDate = new Date(data.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
  
          if (today >= startDate && today <= endDate) {
            validPositions.push({ id: docSnap.id, ...data });
            electionsToday[docSnap.id] = false; // just today's elections
          }
        });
  
        setPositions(validPositions);
  
        // 🔥 Fetch user document
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
  
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const existingVotes = userData.hasVotes || {};
  
            // 🔥 Start from existing votes
            const mergedVotes = { ...existingVotes };
  
            // 🔥 Only add new elections if missing
            for (const positionId in electionsToday) {
              if (!(positionId in mergedVotes)) {
                mergedVotes[positionId] = false; // user hasn't voted yet for this new election
              }
            }
  
            console.log("MERGED VOTES FINAL:", mergedVotes);
  
            setHasVotes(mergedVotes);
  
            // 🔥 Save merged votes back to Firestore
            await updateDoc(userRef, {
              hasVotes: mergedVotes,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };
  
    fetchPositions();
  }, []);
  

  function NavigationHandler(position) {
    navigation.navigate("NomineeSelectScreen", { data: position });
  }

  const groupedPositions = [];
  for (let i = 0; i < positions.length; i += 2) {
    groupedPositions.push(positions.slice(i, i + 2));
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Header title="Vote" subtitle="Select a position to vote" />
        <View style={styles.body}>
          {groupedPositions.map((group, index) => (
            <View style={styles.foot} key={index}>
              {group.map((positions, subIndex) => (
                <Pressable
                  key={subIndex}
                  onPress={() => {
                    NavigationHandler(positions);
                  }}
                >
                  <LinearGradient
                    colors={["rgb(121, 89, 180)", "rgb(81, 19, 131)"]}
                    style={styles.table}
                  >
                    <Text style={styles.tabletext}>{positions.position}</Text>
                  </LinearGradient>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#edededs",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  body: {
    marginTop: 20,
    flex: 1,
    width: "100%",
    padding: 10,
  },
  table: {
    width: 140,
    height: 160,
    borderRadius: 15,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
    marginHorizontal: 10,
  },
  foot: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  tabletext: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});