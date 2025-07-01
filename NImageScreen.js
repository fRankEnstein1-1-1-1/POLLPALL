import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { db } from "../FirebaseConfig"; // adjust if neede
import { addDoc, collection } from "firebase/firestore";

import { auth } from "../FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react-native";
import { query, where, getDocs } from "firebase/firestore";
import Header from "../Components/Header";

const positions = [
  { label: "Secretary", value: "Secretary" },
  { label: "Student Body President", value: "Student Body President" },
  { label: "Vice President", value: "Vice President" },
  { label: "Treasurer", value: "Treasurer" },
];

export default function NomineeApplication({navigation}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is authenticated:", user.uid);
      } else {
        console.log("No authenticated user!");
      }
    });

    return unsubscribe;
  }, []);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [bio, setBio] = useState("");
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log("Picked PDF:", file);
        setPdf(file); // save to state
      } else {
        console.log("No file selected");
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const validateForm = () => {
    if (!fullName.trim()) return "Please enter your full name";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      return "Please enter a valid email";
    if (!position) return "Please select a position";
    if (!bio.trim()) return "Please enter your bio";

    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert("Error", error);
      return;
    }

    setLoading(true);
    const user = auth.currentUser;
const uid = user ? user.uid : null;

if (!uid) {
  Alert.alert("Error", "User not authenticated.");
  setLoading(false);
  return;
}
   console.log(position, startDate, endDate);
    try {
      // 1. Find the election document based on position + dates
      const electionsRef = collection(db, "elections");
      const q = query(
        electionsRef,
        where("position", "==", position),
        where("startDate", "==", startDate),
        where("endDate", "==", endDate)
      );
    
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert(
          "Error",
          "No matching election found for selected position and dates."
        );
        setLoading(false);
        return;
      }

      const electionDoc = querySnapshot.docs[0]; // assuming only one match
      const positionId = electionDoc.id;

      // 2. Convert PDF to base64
      const response = await fetch(pdf.uri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result;
        if (base64data.length > 700000) {
          Alert.alert(
            "PDF too large",
            "Please upload a file smaller than ~500 KB."
          );
          setLoading(false);
          return;
        }

        // 3. Add nomination to Firestore including positionId
        await addDoc(collection(db, "nominations"), {
          userId:uid,
          
          fullName,
          email,
          department,
          position,
          positionId, // ✅ INCLUDE POSITION ID HERE
          bio,
          pdfBase64: base64data,
          isPending: true,
          isAccepted: false,
          startDate,
          endDate,
          votes: 0,
          createdAt: new Date().toISOString(),
        });

        Alert.alert("Success", "Your application has been submitted!", [
          {
            text: "OK",
            onPress: () => {
              setFullName("");
              setEmail("");
              setDepartment("");
              setPosition("");
              setBio("");
              setPdf(null);
              setEndDate("");
              setStartDate("");
            },
          },
        ]);
        navigation.navigate("Nback")
        setLoading(false);
      };

      reader.readAsDataURL(blob);
       

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit application. Please try again.");
      setLoading(false);
    }
 
  };

  return (
    <>
    <Header title="Nominee Application" subtitle=""/>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Nominee Application</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Department</Text>
          <TextInput
            style={[styles.input]}
            value={department}
            onChangeText={setDepartment}
            placeholder="Department"
            numberOfLines={1}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Position Applying For</Text>
          {positions.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.positionButton,
                position === item.value && styles.selectedPositionButton,
              ]}
              onPress={() => setPosition(item.value)}
            >
              <Text
                style={[
                  styles.positionButtonText,
                  position === item.value && styles.selectedPositionText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
         
        </View>
        <View style={styles.dateContainer}>
          <CalendarIcon size={20} color="#8E8E93" style={styles.icon} />
          <TextInput
            style={styles.inputDate}
            placeholder="Start Date (YYYY-MM-DD)"
            value={startDate}
            onChangeText={setStartDate}
          />
        </View>

        <View style={styles.dateContainer}>
          <CalendarIcon size={20} color="#8E8E93" style={styles.icon} />
          <TextInput
            style={styles.inputDate}
            placeholder="End Date (YYYY-MM-DD)"
            value={endDate}
            onChangeText={setEndDate}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Short Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Student ID (PDF)</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickPdf}>
            <Text style={styles.imageButtonText}>
              {pdf ? "Change PDF" : "Upload PDF"}
            </Text>
          </TouchableOpacity>
          {pdf && <Text style={styles.pdfName}>📄 {pdf.name}</Text>}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  icon: {
    marginRight: 8,
  },
  inputDate: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  selectedPositionButton: {
    backgroundColor: "#6A5ACD",
  },
 positionButton: {
  textAlign:'center',
  padding: 12,
  borderRadius: 8,  

 },
  positionButtonText: {
    color: "#333",
    fontSize: 14,
  },

  selectedPositionText: {
    color: "white",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  bioInput: {
    height: 120,
    textAlignVertical: "top",
  },
  imageButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  imageButtonText: {
    color: "#666",
    fontSize: 16,
  },
  pdfName: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
    fontStyle: "italic",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    color: "black",
    backgroundColor: "#f9f9f9",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    color: "black",
    backgroundColor: "#f9f9f9",
  },
});