import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { TriangleAlert as AlertTriangle, Calendar as CalendarIcon, Timer, Users } from 'lucide-react-native';
import Header from '../Components/Header';

export default function OngoingElectionsScreen() {
  const [selectedElection, setSelectedElection] = useState(null);
  const [extendDate, setExtendDate] = useState('');

  const ongoingElections = [
    {
      id: '1',
      position: 'Student Body President',
      startDate: '2024-01-20',
      endDate: '2024-01-27',
      totalVotes: 234,
      candidates: [
        { name: 'Alice Johnson', votes: 120 },
        { name: 'Bob Smith', votes: 114 },
      ],
    },
    {
      id: '2',
      position: 'Department Representative',
      startDate: '2024-01-22',
      endDate: '2024-01-29',
      totalVotes: 156,
      candidates: [
        { name: 'Carol White', votes: 89 },
        { name: 'David Brown', votes: 67 },
      ],
    },
  ];

  const handleAbandonElection = (electionId) => {
    // Implement abandon election logic
    console.log('Abandoning election:', electionId);
  };

  const handleExtendElection = (electionId) => {
    // Implement extend election logic
    console.log('Extending election:', electionId, 'to:', extendDate);
  };

  return (<>
  <Header title="Ongoing Elections" subtitle = "Edit Ongoing Elections"/>
    <ScrollView style={styles.container}>

      {ongoingElections.map((election) => (
        <View key={election.id} style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={() => setSelectedElection(
              selectedElection === election.id ? null : election.id
            )}>
            <View>
              <Text style={styles.position}>{election.position}</Text>
              <View style={styles.dateContainer}>
                <CalendarIcon size={16} color="#8E8E93" style={styles.icon} />
                <Text style={styles.date}>
                  {election.startDate} - {election.endDate}
                </Text>
              </View>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Timer size={16} color="#8E8E93" style={styles.icon} />
                <Text style={styles.statText}>Active</Text>
              </View>
              <View style={styles.stat}>
                <Users size={16} color="#8E8E93" style={styles.icon} />
                <Text style={styles.statText}>{election.totalVotes} votes</Text>
              </View>
            </View>
          </TouchableOpacity>

          {selectedElection === election.id && (
            <View style={styles.details}>
              <View style={styles.candidates}>
                <Text style={styles.sectionTitle}>Current Standing</Text>
                {election.candidates.map((candidate, index) => (
                  <View key={index} style={styles.candidate}>
                    <Text style={styles.candidateName}>{candidate.name}</Text>
                    <View style={styles.voteContainer}>
                      <View 
                        style={[
                          styles.voteBar,
                          { width: `${(candidate.votes / election.totalVotes) * 100}%` }
                        ]} 
                      />
                      <Text style={styles.voteCount}>{candidate.votes} votes</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.adminActions}>
                <Text style={styles.sectionTitle}>Admin Actions</Text>
                
                <View style={styles.extendContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="New End Date (YYYY-MM-DD)"
                    value={extendDate}
                    onChangeText={setExtendDate}
                  />
                  <TouchableOpacity
                    style={[styles.button, styles.extendButton]}
                    onPress={() => handleExtendElection(election.id)}>
                    <Text style={styles.buttonText}>Extend Election</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.button, styles.abandonButton]}
                  onPress={() => handleAbandonElection(election.id)}>
                  <AlertTriangle size={20} color="#FFFFFF" style={styles.icon} />
                  <Text style={styles.buttonText}>Abandon Election</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  position: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
  },
  icon: {
    marginRight: 4,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    padding: 16,
  },
  candidates: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
    marginBottom: 12,
  },
  candidate: {
    marginBottom: 12,
  },
  candidateName: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  voteContainer: {
    height: 24,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  voteBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 12,
  },
  voteCount: {
    position: 'absolute',
    right: 8,
    top: 4,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#000000',
  },
  adminActions: {
    gap: 12,
  },
  extendContainer: {
    gap: 8,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  extendButton: {
    backgroundColor: '#007AFF',
  },
  abandonButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});