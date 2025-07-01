import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { CalendarIcon, Clock } from 'lucide-react-native'; // Assuming these are from lucide-react-native
import Header from '../Components/Header'; // Assuming you have a Header component

export default function ScheduleScreen() {
  const [position, setPosition] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const positions = [
    'Student Body President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Department Representative',
  ];

    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()
  
    const isValidDate = (dateString) => {
      // Format check: YYYY-MM-DD
      const regex = /^\d{4}-(\d{2})-(\d{2})$/;
      const match = dateString.match(regex);
    
      if (!match) return false;
    
      const year = parseInt(dateString.substring(0, 4), 10);
      const month = parseInt(dateString.substring(5, 7), 10);
      const day = parseInt(dateString.substring(8, 10), 10);
    
      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;
    
      const date = new Date(dateString);
      return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
      );
    };
    

  const handleSchedule = async () => {
    if (!position || !startDate || !endDate) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
     
      return;
    }


     /*  if(now>start)
      {
        Alert.alert('Not Possible', 'cant declare elections before today.');
        setEndDate('')
      setStartDate('')
        return;
      } */
 if (end < start) {
      alert("End date cannot be before start date.");
       setEndDate('')
      setStartDate('')
      return;
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      Alert.alert("Invalid Date", "Please enter valid dates in YYYY-MM-DD format.");
      setEndDate('');
      setStartDate('');
      return;
    }
    
  

    try {
      await addDoc(collection(db, 'elections'), {
        position,
        startDate,
        "winner":null,
        endDate,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Election scheduled successfully!');
      // Optional: reset fields
      setPosition('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Error scheduling election:', error.message);
      Alert.alert('Error', 'Failed to schedule election.');
    }
  };

  return (
    <>
      <Header title="Schedule" subtitle="Schedule Elections" />
      <ScrollView style={styles.container}>
        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Position</Text>
            <View style={styles.positionList}>
              {positions.map((pos) => (
                <TouchableOpacity
                  key={pos}
                  style={[
                    styles.positionButton,
                    position === pos && styles.positionButtonActive,
                  ]}
                  onPress={() => setPosition(pos)}
                >
                  <Text
                    style={[
                      styles.positionButtonText,
                      position === pos && styles.positionButtonTextActive,
                    ]}
                  >
                    {pos}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Election Period</Text>

            <View style={styles.dateContainer}>
              <CalendarIcon size={20} color="#8E8E93" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Start Date (YYYY-MM-DD)"
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>

            <View style={styles.dateContainer}>
              <Clock size={20} color="#8E8E93" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="End Date (YYYY-MM-DD)"
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSchedule}>
            <Text style={styles.submitButtonText}>Schedule Election</Text>
          </TouchableOpacity>
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
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
    marginBottom: 12,
  },
  positionList: {
    gap: 8,
  },
  positionButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  positionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  positionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#000000',
    textAlign: 'center',
  },
  positionButtonTextActive: {
    color: '#FFFFFF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});