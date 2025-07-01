import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import PreviousElections from './PreviousElections';

function CurrentElectionsScreen() {
  const [loading, setLoading] = useState(true);
  const [electionGroups, setElectionGroups] = useState([]);

  const parseDate = (value) => (value?.toDate ? value.toDate() : new Date(value));

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'elections'));
        const now = new Date();
        const prev = [];
        console.log("today is",now);
        snapshot.forEach((doc) => {
            const data = doc.data();
            const endDate = parseDate(data.endDate);
            const startDate = parseDate(data.startDate);
            const isSameDay = (d1, d2) =>
                d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate();
            
              if (isSameDay(endDate, now) || isSameDay(startDate, now)) {
                prev.push({
                  id: doc.id,
                  position: data.position,
                  winner: data.winner || 'None',
                  voteCount: data.votes || 0,
                  startDate: startDate.toDateString(),
                  endDate: endDate.toDateString(),
                });
              }
              
        });
       
        const sorted = prev.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

        // For example, split into groups of 3
        const groups = [];
        const groupSize = 3;
        for (let i = 0; i < sorted.length; i += groupSize) {
          groups.push(sorted.slice(i, i + groupSize));
        }

        setElectionGroups(groups);
      } catch (error) {
        console.error('Error fetching elections:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.screenTitle}>Current Elections</Text>
      {electionGroups.map((group, index) => (
        <PreviousElections
          key={index}
          data={group}
         
        />
      ))}
    </ScrollView>
  );
}

export default CurrentElectionsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    elevation:4,
    backgroundColor:"#fbfbfb",
    borderRadius:20,
    margin:12

  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
