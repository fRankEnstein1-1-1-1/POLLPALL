import React, { useLayoutEffect, useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Pressable,
} from 'react-native';
import { Settings, LogOut, Bell, Shield, CircleHelp as HelpCircle, Info, ChevronRight, Moon ,Award } from 'lucide-react-native';
import{auth,db} from '../FirebaseConfig' 
import { doc, getDoc ,query, collection, where, getDocs} from 'firebase/firestore';
import Card from '../Components/Card';
import Avatar from '../Components/Avatar';
import Button from '../Components/Button';
import ElectionVotesCard from '../Components/ElectionVotesCard';
import { signOut } from 'firebase/auth';

export default function ProfilePageScreen({navigation}) {
    
    const fetchElectionVotes = async (userEmail) => {
      try {
        // 1. Fetch all nominations
        const nominationsSnapshot = await getDocs(collection(db, 'nominations'));
        
        const nominations = [];
        nominationsSnapshot.forEach((doc) => {
          nominations.push({ id: doc.id, ...doc.data() });
        });
    
        const today = new Date(); // 📅 Today's date
    
        // 2. Filter nominations by current date between startDate and endDate
        const activeNominations = nominations.filter((nomination) => {
          const startDate = new Date(nomination.startDate);
          const endDate = new Date(nomination.endDate);
          return today >= startDate && today <= endDate;
        });
    
        // 3. Group nominations by position
        const positionsMap = {};
    
        activeNominations.forEach((nomination) => {
          const { position, votes = 0, email } = nomination;
          if (!positionsMap[position]) {
            positionsMap[position] = [];
          }
          positionsMap[position].push({ email, votes });
        });
    
        // 4. Build user-specific electionVotes
        const electionVotes = Object.entries(positionsMap).map(([position, nominees]) => {
          // Sort nominees by votes descending
          const sortedNominees = nominees.sort((a, b) => b.votes - a.votes);
    
          // Find user nomination
          const userNominee = sortedNominees.find(nominee => nominee.email === userEmail);
    
          return {
            position,
            votes: userNominee ? userNominee.votes : 0,
            totalVotes: nominees.reduce((sum, nominee) => sum + (nominee.votes || 0), 0),
            rank: userNominee ? sortedNominees.findIndex(nominee => nominee.email === userEmail) + 1 : null,
          };
        });
    
        return electionVotes;
    
      } catch (error) {
        console.error('Error fetching election votes:', error);
        return [];
      }
    };
    
    
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userData, setUserData] = useState(null);
  const [votesReceived,setVotesReceived]=useState(null); 
  const [timesAsNominee,setTimesAsNominee]=useState(null);
  const [votesCast,setVotesCast] = useState(null);
  const [electionVotes, setElectionVotes] = useState([]);
  useLayoutEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userDocData = userDoc.data();
            setUserData({ ...userDocData, email: user.email });
    
            // 🛠 Fetch only valid nominations
            const nominationsQuery = query(
              collection(db, 'nominations'),
              where('email', '==', user.email),
              where('isNominee', '==', true),
              where('valid', '==', true)
            );
            const nominationsSnapshot = await getDocs(nominationsQuery);
    
            // Times the user stood as nominee
            setTimesAsNominee(nominationsSnapshot.size);
    
            // Total votes received
            let totalVotesReceived = 0;
            nominationsSnapshot.forEach(doc => {
              const data = doc.data();
              totalVotesReceived += data.votes || 0;
            });
            setVotesReceived(totalVotesReceived);
    
            // Votes cast
            const votesGiven = Object.values(userDocData.hasVotes || {}).filter(v => v === true).length;
            setVotesCast(votesGiven);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
    
      fetchUserData();
    }, []);

  useEffect(() => {
    const loadVotes = async () => {
      const votesData = await fetchElectionVotes(userData.email);
      setElectionVotes(votesData); // suppose you have electionVotes state
    };
  
    if (userData?.email) {
      loadVotes();
    }
  }, [userData]);

  const handleLogout = async() => {
    console.log("Button pressed!")
    try {
        await signOut(auth);
        navigation.navigate("Start")
        console.log('User logged out successfully');
      } catch (error) {
        console.error('Error during logout:', error.message);
      }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const renderSettingsItem = (icon, title, subtitle, rightElement, onPress) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingsItemIcon}>
        {icon}
      </View>
      <View style={styles.settingsItemContent}>
        <Text style={styles.settingsItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (onPress && <ChevronRight size={20} color="#9CA3AF" />)}
    </TouchableOpacity>
  );

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        
        {userData && (
  <>
    <View style={styles.profileSection}>
      <Avatar name={userData.name} size={80} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileEmail}>{userData.email}</Text>
      </View>
      {userData.isNominee && (
          <View style={styles.nomineeTag}>
            <Award size={14} color={'#6A5ACD'} />
            <Text style={styles.nomineeText}>Nominee</Text>
          </View>
      )}
    </View>

    <Card style={styles.statsCard}>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{timesAsNominee !== null ? timesAsNominee : "-"}</Text>
          <Text style={styles.statLabel}>Times as{'\n'}Nominee</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={styles.statValue}>{votesReceived !== null ? votesReceived : "-"}</Text>
          <Text style={styles.statLabel}>Votes{'\n'}Received</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{votesCast !== null ? votesCast : "-"}</Text>
          <Text style={styles.statLabel}>Votes{'\n'}Given</Text>
        </View>
      </View>
    </Card>

    {userData.isNominee && <ElectionVotesCard votes={electionVotes} />}
  </>
)}

        {userData.isNominee && <ElectionVotesCard votes={electionVotes} />}
        <Text style={styles.sectionTitle}>App Settings</Text>
        <Card style={styles.settingsCard}>
          {renderSettingsItem(
            <Moon size={22} color="#3B82F6" />,
            'Dark Mode',
            'Change app appearance',
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={darkMode ? '#3B82F6' : '#FFFFFF'}
            />
          )}
          {renderSettingsItem(
            <Bell size={22} color="#3B82F6" />,
            'Notifications',
            'Election updates and results',
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
              thumbColor={notificationsEnabled ? '#3B82F6' : '#FFFFFF'}
            />
          )}
        </Card>

        <Text style={styles.sectionTitle}>Support</Text>
        <Card style={styles.settingsCard}>
          {renderSettingsItem(
            <HelpCircle size={22} color="#3B82F6" />,
            'Help Center',
            'Get help with the app',
            undefined,
            () => {}
          )}
          {renderSettingsItem(
            <Info size={22} color="#3B82F6" />,
            'About',
            'App version and info',
            undefined,
            () => {}
          )}
          {renderSettingsItem(
            <Shield size={22} color="#3B82F6" />,
            'Privacy Policy',
            'How we handle your data',
            undefined,
            () => {}
          )}
        </Card>

        <View style={styles.logoutSection}>
        <Pressable onPress={handleLogout} >
          <Text style = {styles.logoutButton}>
            LogOut
          </Text>
        </Pressable>
        </View>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
    },
    nomineeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 24,
      },
      nomineeText: {
        fontFamily: 'System',
        fontSize: 12,
        color: '#6A5ACD',
        marginLeft: 4,
      },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 32,
      paddingBottom: 16,
    },
    headerTitle: {
      fontFamily: 'System',
      fontWeight: '700',
      fontSize: 24,
      color: '#6A5ACD', // Purple color instead of blue
    },
    settingsButton: {
      padding: 8,
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 24,
    },
    profileInfo: {
      marginLeft: 16,
    },
    profileName: {
      fontFamily: 'System',
      fontWeight: '600',
      fontSize: 20,
      color: '#1F2937',
      marginBottom: 2,
    },
    profileEmail: {
      fontFamily: 'System',
      fontWeight: '400',
      fontSize: 16,
      color: '#6B7280',
    },
    statsCard: {
      marginHorizontal: 16,
      marginBottom: 24,
      paddingVertical: 16,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statBorder: {
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: '#E5E7EB',
    },
    statValue: {
      fontFamily: 'System',
      fontWeight: '700',
      fontSize: 24,
      color: '#6A5ACD', // Purple color for stats
      marginBottom: 4,
    },
    statLabel: {
      fontFamily: 'System',
      fontWeight: '400',
      fontSize: 12,
      color: '#6B7280',
      textAlign: 'center',
    },
    sectionTitle: {
      fontFamily: 'System',
      fontWeight: '600',
      fontSize: 18,
      color: '#1F2937',
      marginHorizontal: 16,
      marginTop: 24,
      marginBottom: 8,
    },
    settingsCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      padding: 0,
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    settingsItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F3E8FF', // Lighter purple shade for icon background
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    settingsItemContent: {
      flex: 1,
    },
    settingsItemTitle: {
      fontFamily: 'System',
      fontWeight: '500',
      fontSize: 16,
      color: '#6A5ACD', // Purple for titles
    },
    settingsItemSubtitle: {
      fontFamily: 'System',
      fontWeight: '400',
      fontSize: 14,
      color: '#6B7280',
    },
    logoutSection: {
      backgroundColor:'red',
        elevation:33,
        width:'55%',
        alignSelf:'center',
        padding:16,
        margin:24,
        borderRadius:35,
    },
    logoutButton: {
      letterSpacing:-0.5,
      color:'white',
      fontWeight:'bold',
      fontSize:18,
      textAlign:'center',
    },
    versionText: {
      fontFamily: 'System',
      fontWeight: '400',
      fontSize: 12,
      color: '#6B7280',
      textAlign: 'center',
      marginBottom: 32,
    },
    // Switch (toggle) customizations
    switchTrackColor: {
      false: '#D1D5DB',
      true: '#D8B0FF', // Lighter purple for track when switched on
    },
    switchThumbColor: {
      true: '#6A5ACD', // Purple for the thumb
      false: '#FFFFFF', // White for the thumb when off
    }
  });
  