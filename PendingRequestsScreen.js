import { View, Text, ScrollView, TouchableOpacity, Pressable,StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../Components/Header';
import { Check, X } from 'lucide-react-native';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

export default function PendingRequestScreen() {
  const [nominations, setNominations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNominations = async () => {
      try {
        const q = query(
          collection(db, 'nominations'),
          where('isPending', '==', true)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNominations(fetched);
      } catch (error) {
        console.error('Error fetching nominations:', error);
      }
    };

    fetchNominations();
  }, []);

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'nominations', id), {
        isAccepted:true,
        isNominee: true,
        isPending: false,
      });
      setNominations(prev => prev.filter(nominee => nominee.id !== id));
    } catch (error) {
      console.error('Error approving nominee:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateDoc(doc(db, 'nominations', id), {
        isAccepted: false,
        isPending: false,
      });
      setNominations(prev => prev.filter(nominee => nominee.id !== id));
    } catch (error) {
      console.error('Error rejecting nominee:', error);
    }
  };

  return (
    <>
      <Header title="Pending Requests" subtitle="Accept or Reject  Requests" />
      <ScrollView style={styles.container}>
        {nominations.map((request) => (
          <View key={request.id} style={styles.card}>
            <Pressable
              onPress={() => navigation.navigate('ANomDetails', { nominee: request })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{request.fullName}</Text>
                <Text style={styles.position}>{request.position}</Text>
              </View>

              <View style={styles.details}>
                <Text style={styles.detail}>Department: {request.department}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.approveButton]}
                  onPress={() => handleApprove(request.id)}
                >
                  <Check size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleReject(request.id)}
                >
                  <X size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
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
  cardHeader: {
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  position: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#48484A',
  },
  details: {
    marginBottom: 16,
  },
  detail: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#8E8E93',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  approveButton: {
    backgroundColor: '#34C759',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginLeft: 8,
  },
});
