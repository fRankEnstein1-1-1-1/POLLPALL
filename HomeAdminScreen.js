import React, {  useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import {  query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { ChevronRight } from 'lucide-react-native';
import Header from '../Components/Header';

export default function HomeAdminScreen() {
  const [previousElections, setPreviousElections] = useState([]);
  const [upcomingElections, setUpcomingElections] = useState([]);
  const[currentElections,setCurrentElections] = useState([])
  const[TotalUsers,setTotalUsers] = useState(0);
  const[TotalVotedUsers,setTotalVotedUsers] = useState(0);

  // Utility to convert Timestamp or string to Date object
  const parseDate = (value) => {
    if (value?.toDate) return value.toDate(); // Firestore Timestamp
    return new Date(value); // Plain string
  };

  useFocusEffect(
    useCallback(() => {
      const fetchElections = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'elections'));
  
          // Normalize date to ignore time
          const normalizeDate = (date) => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d;
          };
  
          const now = normalizeDate(new Date());
          const prev = [];
          const upcoming = [];
          const curr = [];
  
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const startDate = normalizeDate(parseDate(data.startDate));
            const endDate = normalizeDate(parseDate(data.endDate));
  
            const electionData = {
              id: doc.id,
              position: data.position,
              winner: data.winner || 'None',
              date: endDate.toDateString(),
              startDate: startDate.toDateString(),
              endDate: endDate.toDateString(),
            };
  
            if (now >= startDate && now <= endDate) {
              curr.push(electionData);
            } else if (startDate > now) {
              upcoming.push(electionData);
            } else if (endDate < now) {
              prev.push(electionData);
            }
          });
  
          const sortedPrev = prev
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
  
          const sortedUpcoming = upcoming.sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
          );
  
          setPreviousElections(sortedPrev);
          setUpcomingElections(sortedUpcoming);
          setCurrentElections(curr);
  
          const usersSnapshot = await getDocs(collection(db, 'users'));
          setTotalUsers(usersSnapshot.size);
  
          const votesSnapshot = await getDocs(collection(db, 'votes'));
          setTotalVotedUsers(votesSnapshot.size);
  
        } catch (error) {
          console.error('Error fetching elections:', error.message);
        }
      };
  
      fetchElections();
    }, [])
  );
  
  async function declareWinner(positionId) {
    try {
      // 1. Get all nominations for this position
      const nominationsRef = collection(db, 'nominations');
      const q = query(nominationsRef, where('positionId', '==', positionId));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.log('No nominees found for this position.');
        return;
      }
  
      // 2. Find nominee with max votes
      let winner = null;
      let maxVotes = -1;
  
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.votes > maxVotes) {
          maxVotes = data.votes;
          winner = {
            id: docSnap.id,
            name: data.fullName,
            email: data.email,
            Votesgained:data.votes,
          };
        }
      });
  
      if (!winner) {
        console.log('No winner found (maybe all votes are 0?)');
        return;
      }
  
      // 3. Update the election document with the winner
      const electionRef = doc(db, 'elections', positionId);
      await updateDoc(electionRef, {
        winner: winner.name, // or use winner.email
        votes:winner.Votesgained,
      });
  
      console.log(`Winner declared: ${winner.name} with ${maxVotes} votes`);
    } catch (error) {
      console.error('Error declaring winner:', error);
    }
  }


  return (
    <>
      <Header title="Admin" subtitle="Home" />
      <ScrollView style={styles.container}>
      
 <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Elections</Text>
          <Text>Total users:{TotalUsers}</Text>
          <Text>Total voters:{TotalVotedUsers}</Text>
          {currentElections.map((election) => (
            <Pressable key={election.id} style={styles.card}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.position}>{election.position}</Text>
                  <Text style={styles.date}>From: {election.startDate}</Text>
                  <Text style={styles.date}>To: {election.endDate}</Text>
                </View>
                <ChevronRight size={20} color="#8E8E93" />
                <Pressable onPress={() => declareWinner(election.id)}>
                <Text>Declare Results</Text>
                </Pressable>

              </View>
            </Pressable>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Elections</Text>
          {upcomingElections.map((election) => (
            <Pressable key={election.id} style={styles.card}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.position}>{election.position}</Text>
                  <Text style={styles.date}>From: {election.startDate}</Text>
                  <Text style={styles.date}>To: {election.endDate}</Text>
                </View>
                <ChevronRight size={20} color="#8E8E93" />
              </View>
            </Pressable>
          ))}
        </View>
  <View style={styles.section}>
          <Text style={styles.sectionTitle}>Previous Elections</Text>
          {previousElections.map((election) => (
            <Pressable key={election.id} style={styles.card}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.position}>{election.position}</Text>
                  <Text style={styles.winner}>Winner: {election.winner}</Text>
                  <Text style={styles.date}>Date: {election.date}</Text>
                </View>
                <ChevronRight size={20} color="#8E8E93" />
              </View>
            </Pressable>
          ))}
        </View>
       

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
    color: '#000000',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  position: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  winner: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#48484A',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
});