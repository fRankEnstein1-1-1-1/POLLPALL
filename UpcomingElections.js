import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

function UpcomingElections ({ data, title }) {
  return (
    <View style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.electionName}>{item.position}</Text>
            <Text style={styles.winner}>Winner: {item.winner}</Text>
            <Text style={styles.voteCount}>Votes: {item.voteCount}</Text>
            <Text style={styles.date}>Starts on: {item.startDate}</Text>
            <Text style={styles.date}>Ended on: {item.endDate}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default UpcomingElections;

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  electionName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  winner: {
    fontSize: 16,
    
  },
  voteCount: {
    fontSize: 14,
    color: '#444',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});
