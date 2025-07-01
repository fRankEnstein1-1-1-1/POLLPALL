import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig"; // adjust path if needed

export default function NomineePromiseScreen({ route }) {
  const { nominee } = route.params;
  const [promises, setPromises] = useState("");

  useEffect(() => {
    const fetchPromises = async () => {
      try {
        const docRef = doc(db, "nominations", nominee.id); // nominee.id is correct here
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPromises(data.promises || "No promises available.");
        } else {
          setPromises("Nominee data not found.");
        }
      } catch (error) {
        console.error("Error fetching promises:", error);
        setPromises("Failed to load promises.");
      }
    };

    fetchPromises();
  }, []);

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Promises
      </Text>
      <Text>{promises}</Text>
    </ScrollView>
  );
}
