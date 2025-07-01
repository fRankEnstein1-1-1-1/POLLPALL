import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { db } from '../FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Avatar from '../Components/Avatar';
import Header from '../Components/Header';



export default function NomineeSelectScreen({navigation,route}) { 
  const {data} = route.params;
  const [NOMINEES, setNominees] = useState([]);
  useEffect(() => {
    const fetchNominees = async () => {
      try {
        const now = new Date();
        const startDate = new Date(`${data.startDate}T00:00:00`);
        const endDate = new Date(`${data.endDate}T23:59:59`);
      
  
        if (now < startDate || now > endDate) {
          console.log("Election not currently active.");
          setNominees([]);
          return;
        }
        console.log("Data.position",data.position)
        const q = query(
          collection(db, 'nominations'),
          where('position', '==', data?.position),
          where('isAccepted', '==', true)
        );
       
        const snapshot = await getDocs(q);
  
       
  
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNominees(fetched);
      } catch (error) {
        console.error("Error fetching nominees:", error);
      }
    };
  
    fetchNominees();
  }, []);
  
  
   
    function NavigationHandler(item)
    {
      navigation.navigate("NomineeDetails",{nominee:item});
    }

    const renderNomineeCard = ({ item }) => (
      <TouchableOpacity style={styles.card} onPress={() => NavigationHandler(item)}>
        <View style={styles.cardContent}>
        
        
          <View style={styles.textContent}> 
             <Avatar name={item.fullName} size={100} style={styles.image} />
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.bio}>{`Bio : ${item.bio}`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
    

  return (
    <View style={styles.container}>
        <Header title = {data.position} subtitle = "Select Nominees" />
      <FlatList
        data={NOMINEES}
        renderItem={ renderNomineeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: '#333',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    
    backgroundColor: '#faf8f9',
    // borderRadius: 16,
 borderRadius:20,
    overflow: 'hidden',
    height:350,
    elevation:12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
   marginBottom:5,
    alignSelf:'center'
  },
  cardContent: {
    padding: 16,
    color:"blue",
    
  },
  name: {
    fontSize: 20,
    color:"black",
    textAlign:'center',
    fontWeight: 'bold',
    
  },
  bio: {
    padding:20,
    marginTop:20,
    borderRadius:20,
    elevation:6,
    height:"55%",
    width:"100%",
    borderWidth:1,
    backgroundColor:"#f8f8ff",
    borderColor:"blue",
    justifyContent:'center',
    alignItems:'center',
    fontSize: 20,
    fontWeight: 'light',
    color: '#333',
  },
  position: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
 textContent:{
  height:"100%",
  justifyContent:'flex-end'
 }
 
});